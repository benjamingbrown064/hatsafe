import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

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

export async function POST(request: NextRequest) {
  try {
    // Check if OpenAI API key is configured
    if (!process.env.OPENAI_API_KEY) {
      console.error('OPENAI_API_KEY is not configured');
      return NextResponse.json(
        { 
          success: false,
          error: 'AI extraction not configured',
          details: 'OpenAI API key is missing'
        },
        { status: 500 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Convert file to base64 for OpenAI Vision API
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = buffer.toString('base64');
    const mimeType = file.type;

    // Call OpenAI Vision API to extract data
    console.log('Calling OpenAI API with file:', file.name, 'type:', mimeType);
    
    let response;
    try {
      response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `You are an expert at extracting structured data from compliance documents, certificates, licenses, and permits used in construction and trades.

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
  "confidence": 0.0-1.0 (your confidence in the extraction),
  "rawText": "brief summary of what you see"
}

If you cannot confidently extract a field, set it to null. Focus especially on finding expiry dates as they are critical for compliance tracking.`
        },
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: 'Please extract structured data from this document:'
            },
            {
              type: 'image_url',
              image_url: {
                url: `data:${mimeType};base64,${base64}`
              }
            }
          ]
        }
      ],
      max_tokens: 500,
      temperature: 0.1 // Low temperature for consistent extraction
      });
    } catch (openaiError) {
      console.error('OpenAI API error:', openaiError);
      throw new Error(`OpenAI API failed: ${openaiError instanceof Error ? openaiError.message : 'Unknown error'}`);
    }

    console.log('OpenAI API response received');
    const content = response.choices[0]?.message?.content;
    
    if (!content) {
      throw new Error('No response from AI');
    }

    // Parse the JSON response
    let extractedData: ExtractedData;
    
    try {
      // Remove markdown code blocks if present
      const cleanedContent = content.replace(/```json\n?|\n?```/g, '').trim();
      extractedData = JSON.parse(cleanedContent);
    } catch (parseError) {
      console.error('Failed to parse AI response:', content);
      throw new Error('Invalid AI response format');
    }

    // Validate and normalize dates
    if (extractedData.issueDate) {
      const issueDate = new Date(extractedData.issueDate);
      if (isNaN(issueDate.getTime())) {
        extractedData.issueDate = undefined;
      } else {
        extractedData.issueDate = issueDate.toISOString().split('T')[0];
      }
    }

    if (extractedData.expiryDate) {
      const expiryDate = new Date(extractedData.expiryDate);
      if (isNaN(expiryDate.getTime())) {
        extractedData.expiryDate = undefined;
      } else {
        extractedData.expiryDate = expiryDate.toISOString().split('T')[0];
      }
    }

    // Ensure confidence is between 0 and 1
    if (typeof extractedData.confidence !== 'number' || extractedData.confidence < 0 || extractedData.confidence > 1) {
      extractedData.confidence = 0.5;
    }

    return NextResponse.json({
      success: true,
      extracted: extractedData
    });

  } catch (error) {
    console.error('Document extraction error:', error);
    
    // Log full error details for debugging
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorStack = error instanceof Error ? error.stack : undefined;
    
    console.error('Error message:', errorMessage);
    console.error('Error stack:', errorStack);
    
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to extract data from document',
        details: errorMessage,
        stack: process.env.NODE_ENV === 'development' ? errorStack : undefined
      },
      { status: 500 }
    );
  }
}
