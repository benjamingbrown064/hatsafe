import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { createClient } from '@/lib/supabase/server';
import { checkRateLimit } from '@/lib/rateLimit';
import { checkAIAccess } from '@/lib/planLimits';
import { logAuditEvent } from '@/lib/auditLog';
import logger from '@/lib/logger';

const AI_MODEL = process.env.AI_EXTRACTION_MODEL || 'gpt-4o-mini';

const EXTRACTION_PROMPT = `You are an expert at extracting structured data from compliance documents, certificates, licenses, and permits used in construction and trades.

Extract the following information from the document:
- Document type (e.g., "CSCS Card", "Driving License", "Insurance Certificate", "MOT Certificate", "PAT Testing Certificate", etc.)
- Document number (certification number, license number, policy number, etc.)
- Issue date (when the document was issued)
- Expiry date (when the document expires) - CRITICAL FIELD
- Issuer (organization that issued the document)
- Holder name (person or company the document belongs to)

Return ONLY valid JSON with this structure:
{
  "documentType": "string",
  "documentNumber": "string or null",
  "issueDate": "YYYY-MM-DD or null",
  "expiryDate": "YYYY-MM-DD or null",
  "issuer": "string or null",
  "holderName": "string or null",
  "confidence": 0.0-1.0,
  "rawText": "brief summary of what you see"
}

If you cannot confidently extract a field, set it to null. Focus especially on finding expiry dates as they are critical for compliance tracking.`;

interface ExtractedData {
  documentType: string;
  documentNumber?: string;
  issueDate?: string;
  expiryDate?: string;
  issuer?: string;
  holderName?: string;
  confidence: number;
  rawText?: string;
}

async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries = 3,
  initialDelay = 1000
): Promise<T> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (err) {
      if (i === maxRetries - 1) throw err;
      await new Promise((r) => setTimeout(r, initialDelay * Math.pow(2, i)));
    }
  }
  throw new Error('Max retries exceeded');
}

export async function POST(request: NextRequest) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ success: false, error: 'AI extraction not configured' }, { status: 500 });
    }

    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Rate limit — extraction is expensive
    const rl = await checkRateLimit(user.id, 'extraction');
    if (!rl.success) return rl.response!;

    const { data: userData } = await supabase
      .from('users')
      .select('organisation_id')
      .eq('id', user.id)
      .single();

    if (!userData?.organisation_id) {
      return NextResponse.json({ error: 'No organisation found' }, { status: 400 });
    }

    // Plan gate: AI extraction requires Professional+
    const aiAccess = await checkAIAccess(supabase, userData.organisation_id);
    if (!aiAccess.allowed) return aiAccess.response!;

    // Consent check
    const { data: userRecord } = await supabase
      .from('users')
      .select('ai_processing_consent')
      .eq('id', user.id)
      .single();

    if (!userRecord?.ai_processing_consent) {
      return NextResponse.json(
        {
          error: 'AI processing consent required',
          consentRequired: true,
          message: 'You must consent to AI processing before using document extraction.',
        },
        { status: 403 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = buffer.toString('base64');
    const mimeType = file.type;

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const response = await retryWithBackoff(() =>
      openai.chat.completions.create({
        model: AI_MODEL,
        messages: [
          { role: 'system', content: EXTRACTION_PROMPT },
          {
            role: 'user',
            content: [
              { type: 'text', text: 'Please extract structured data from this document:' },
              { type: 'image_url', image_url: { url: `data:${mimeType};base64,${base64}` } },
            ],
          },
        ],
        max_tokens: 500,
        temperature: 0.1,
      })
    );

    const content = response.choices[0]?.message?.content;
    if (!content) {
      return NextResponse.json({ success: false, error: 'No response from AI' }, { status: 500 });
    }

    let extractedData: ExtractedData;
    try {
      const cleaned = content.replace(/```json\n?|\n?```/g, '').trim();
      extractedData = JSON.parse(cleaned);
    } catch {
      logger.error({ content }, 'Failed to parse AI response');
      return NextResponse.json({ success: false, error: 'AI returned invalid format' }, { status: 500 });
    }

    // Validate dates
    if (extractedData.issueDate) {
      const d = new Date(extractedData.issueDate);
      extractedData.issueDate = isNaN(d.getTime()) ? undefined : d.toISOString().split('T')[0];
    }
    if (extractedData.expiryDate) {
      const d = new Date(extractedData.expiryDate);
      // Reject unreasonable dates (before 1990 or after 2100)
      if (isNaN(d.getTime()) || d.getFullYear() < 1990 || d.getFullYear() > 2100) {
        extractedData.expiryDate = undefined;
      } else {
        extractedData.expiryDate = d.toISOString().split('T')[0];
      }
    }
    if (typeof extractedData.confidence !== 'number' || extractedData.confidence < 0 || extractedData.confidence > 1) {
      extractedData.confidence = 0.5;
    }

    // Track AI usage
    await supabase.from('ai_usage').insert({
      organisation_id: userData.organisation_id,
      user_id: user.id,
      model: AI_MODEL,
      action: 'document_extraction',
      tokens_used: response.usage?.total_tokens || 0,
      created_at: new Date().toISOString(),
    }).maybeSingle();

    await logAuditEvent(supabase, {
      organisation_id: userData.organisation_id,
      user_id: user.id,
      action: 'ai_extraction',
      metadata: { model: AI_MODEL, confidence: extractedData.confidence },
    });

    return NextResponse.json({ success: true, extracted: extractedData });
  } catch (error) {
    logger.error({ err: error }, 'Document extraction error');
    return NextResponse.json({ success: false, error: 'Failed to extract data from document' }, { status: 500 });
  }
}
