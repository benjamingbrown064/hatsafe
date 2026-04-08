# HatSafe - Technical Architecture Reference

**Version:** 2.0  
**Last Updated:** 2026-04-08  
**System:** HatSafe MVP  
**Audience:** Engineering Team

---

## Architecture Overview

HatSafe is a serverless, multi-tenant SaaS application built on:
- **Frontend:** Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Backend:** Next.js API Routes (serverless functions)
- **Database:** PostgreSQL (Supabase)
- **Storage:** Supabase Storage (S3-backed)
- **AI:** OpenAI GPT-4o-mini Vision
- **Email:** SendGrid or Resend
- **Hosting:** Vercel

**Design Principles:**
- Simplicity - minimal moving parts
- Scalability - serverless, auto-scaling
- Security - Row-Level Security, encrypted storage
- Speed - edge functions, optimistic UI
- Cost efficiency - pay-per-use

---

## System Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                      USER BROWSER                            │
│  (Next.js React + Tailwind CSS)                              │
└──────────────────────┬───────────────────────────────────────┘
                       │ HTTPS
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                 VERCEL EDGE NETWORK                          │
│  CDN + Edge Middleware (auth, geo-routing)                  │
└──────────────────────┬───────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│              NEXT.JS API ROUTES (AWS Lambda)                 │
│  /api/documents/extract  → AI extraction                    │
│  /api/documents/upload   → File upload + DB insert          │
│  /api/notifications/send → Email dispatch                   │
└────┬────────────┬────────────┬─────────────┬────────────────┘
     │            │            │             │
     ▼            ▼            ▼             ▼
┌─────────┐  ┌──────────┐ ┌───────────┐ ┌──────────────┐
│ OpenAI  │  │ Supabase │ │ Supabase  │ │ SendGrid/    │
│ GPT-4o  │  │ Postgres │ │ Storage   │ │ Resend       │
│ mini    │  │ (RLS)    │ │ (S3)      │ │              │
└─────────┘  └──────────┘ └───────────┘ └──────────────┘
```

---

## Frontend Architecture

### Technology Stack
- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS 3
- **Icons:** Lucide React
- **Components:** Radix UI (headless)

### Key Pages
- `/` - Public homepage
- `/dashboard` - Compliance dashboard (alerts, calendar)
- `/people`, `/vehicles`, `/assets` - Entity management
- `/documents` - Document list and upload
- `/settings` - Org settings, users, billing

### Data Fetching
- **Server Components:** Fetch directly from Supabase (async RSC)
- **Client Components:** SWR for real-time updates
- **Optimistic UI:** Immediate feedback on uploads

### State Management
- React Server Components for server data
- React hooks (useState, useContext) for client state
- No global state library (MVP scope is simple)

### Styling System
- **Colors:** Safety Yellow (#FFC107), Deep Black (#1A1A1A)
- **Breakpoints:** sm(640), md(768), lg(1024), xl(1280)
- Defined in `tailwind.config.js`

---

## Backend Architecture

### API Routes (Serverless Functions)

**Environment:** AWS Lambda via Vercel
- Auto-scaling (0 to N instances)
- 10-second timeout
- 1GB memory
- Stateless (no persistent connections)

---

### Key Endpoints

#### POST `/api/documents/extract`
**Purpose:** AI extraction from uploaded file

**Input:**
```typescript
{
  fileBase64: string;
  fileName: string;
  mimeType: string;
}
```

**Output:**
```typescript
{
  success: boolean;
  extraction: {
    documentType: string;
    documentNumber: string;
    issueDate: string;        // YYYY-MM-DD
    expiryDate: string;       // YYYY-MM-DD
    issuer: string;
    holderName: string;
    confidence: number;       // 0.0 - 1.0
  };
  error?: string;
}
```

**Processing:**
1. Validate file (type, <10MB)
2. Send to OpenAI Vision API
3. Parse structured JSON
4. Validate and normalize dates
5. Calculate confidence
6. Return extraction data

**Error Handling:**
- Invalid file type → 400
- File too large → 413
- AI API failure → 503 (retry)
- Timeout → 504

---

#### POST `/api/documents/upload`
**Purpose:** Save file to storage and create DB record

**Input:**
```typescript
{
  file: File;
  entityType: 'person' | 'vehicle' | 'asset';
  entityId: string;
  documentType: string;
  documentNumber?: string;
  issueDate?: string;
  expiryDate?: string;
  issuer?: string;
  aiExtracted: boolean;
  aiConfidence?: number;
}
```

**Processing:**
1. Upload file to Supabase Storage
2. Generate path: `{orgId}/{entityType}/{entityId}/{uuid}.{ext}`
3. Create document record
4. Calculate `expiry_status`
5. Return document ID and URL

**Security:**
- Auth required (Supabase JWT)
- RLS policies enforce org isolation
- File type whitelist: PDF, JPG, PNG
- 10MB size limit

---

#### POST `/api/notifications/send` (Cron)
**Purpose:** Send email notifications

**Trigger:** Vercel Cron (daily 6am GMT)

**Processing:**
1. Query documents expiring in 30/14/7 days
2. Group by user
3. Generate email template
4. Send via SendGrid/Resend
5. Log notification

**Rate Limiting:**
- Max 100 emails per batch
- 1-second delay between sends
- Retry failed sends (max 3 attempts)

---

## Database Schema

### Technology
- **Provider:** Supabase (managed Postgres)
- **Region:** EU West (London)
- **Version:** PostgreSQL 15+
- **Pooling:** Supavisor

---

### Core Tables

**organisations**
```sql
- id (UUID, PK)
- name
- plan (starter | professional | business)
- stripe_customer_id
- stripe_subscription_id
- created_at, updated_at
```

**users**
```sql
- id (UUID, PK, FK auth.users)
- organisation_id (FK organisations)
- email, full_name
- role (admin | manager | user)
- created_at
```

**teams**
```sql
- id (UUID, PK)
- organisation_id (FK)
- name
- site_id (FK sites)
- created_at
```

**sites**
```sql
- id (UUID, PK)
- organisation_id (FK)
- name, address
- created_at
```

**people**
```sql
- id (UUID, PK)
- organisation_id (FK)
- team_id (FK), site_id (FK)
- name, email, phone, job_title
- status (active | inactive)
- created_at
```

**vehicles**
```sql
- id (UUID, PK)
- organisation_id (FK)
- registration, make, model, year
- vehicle_type
- assigned_to (FK people)
- status (active | inactive)
- created_at
```

**assets**
```sql
- id (UUID, PK)
- organisation_id (FK)
- site_id (FK)
- name, asset_type, serial_number, location
- status (active | inactive)
- created_at
```

**document_types**
```sql
- id (UUID, PK)
- organisation_id (FK)
- name, category
- requires_expiry (boolean)
- default_validity_days
- created_at
```

**documents**
```sql
- id (UUID, PK)
- organisation_id (FK)
- entity_type (person | vehicle | asset)
- entity_id (UUID)
- document_type_id (FK)
- document_number, issue_date, expiry_date, issuer
- file_url, file_name, file_size, mime_type
- ai_extracted, ai_confidence
- expiry_status (valid | expiring_soon | expired | no_expiry)
- version_number
- parent_document_id (FK documents)
- created_at, created_by (FK users)
```

**notifications**
```sql
- id (UUID, PK)
- organisation_id (FK)
- user_id (FK), document_id (FK)
- type (expiry_30 | expiry_14 | expiry_7 | expired | digest)
- sent_at, status (pending | sent | failed)
- created_at
```

**audit_logs**
```sql
- id (UUID, PK)
- organisation_id (FK)
- user_id (FK)
- action, resource_type, resource_id
- metadata (JSONB)
- created_at
```

---

### Row-Level Security (RLS)

**Purpose:** Enforce multi-tenant isolation at DB level

**How it works:** Every query auto-filters by `organisation_id`

**Example Policy:**
```sql
CREATE POLICY "Users can only access their org's documents"
ON documents FOR SELECT
USING (
  organisation_id = (
    SELECT organisation_id FROM users WHERE id = auth.uid()
  )
);
```

**All tables have RLS enabled** - no cross-tenant leakage possible.

---

## Storage Architecture

### Supabase Storage
- **Backend:** AWS S3
- **Bucket:** `documents` (private)
- **Encryption:** AES-256 at rest

### File Organization
```
documents/
  {organisation_id}/
    people/{person_id}/{uuid}.pdf
    vehicles/{vehicle_id}/{uuid}.pdf
    assets/{asset_id}/{uuid}.pdf
```

### Access Control
- Private bucket (signed URLs, 1-hour expiry)
- RLS policies check `organisation_id`
- Soft delete (flag, don't remove from storage)

### File Lifecycle
- Uploaded files retained indefinitely
- Archived versions retained 7 years
- Soft delete only

---

## AI Processing

### OpenAI GPT-4o-mini Vision
- **Model:** `gpt-4o-mini` with vision
- **Cost:** ~$0.01 per extraction
- **Latency:** <2s average

### Prompt Engineering

**System Prompt:**
```
Extract structured data from compliance documents.
Return JSON with:
{
  "documentType": "CSCS Card | MOT | Insurance | etc.",
  "documentNumber": "Certificate/license number",
  "issueDate": "YYYY-MM-DD or null",
  "expiryDate": "YYYY-MM-DD or null",
  "issuer": "Issuing authority",
  "holderName": "Person/vehicle/asset name",
  "confidence": 0.0-1.0
}

Rules:
- Always return valid JSON
- Use ISO 8601 dates (YYYY-MM-DD)
- If unclear, return null
- Validate date logic (issue < expiry)
```

**User Prompt:**
```
Extract data from this compliance document.
```

### Response Processing
1. Receive JSON from OpenAI
2. Validate structure
3. Parse and normalize dates
4. Validate date logic
5. Calculate confidence
6. Return structured data

### Error Handling
- Invalid JSON → Low confidence, partial data
- API timeout → Retry once, fallback to manual
- Rate limit → Exponential backoff

### Accuracy Target
- >85% field accuracy
- >90% document type classification

---

## Email Architecture

### Provider
- **Primary:** SendGrid
- **Fallback:** Resend
- **Domain:** `notifications.hatsafe.com`
- **Auth:** DKIM/SPF configured

### Email Templates

**30-Day Notice:**
```
Subject: [HatSafe] CSCS Card expiring in 30 days - John Smith

Hi [User],

📄 Document: CSCS Card (#123456)
👤 Holder: John Smith
📅 Expires: 2027-05-15 (30 days)
⚠️ Action: Upload renewed certificate

[View Profile] [Upload Renewal]
```

**Daily Digest:**
```
Subject: [HatSafe] Daily Compliance Summary - 3 items

🔴 CRITICAL (2)
- CSCS Card expired - John Smith
- MOT overdue - Vehicle AB12 CDE

⚠️ WARNING (1)
- Insurance expiring in 12 days - FG34 HIJ

[View Dashboard]
```

### Delivery Monitoring
- Track open/click rates
- Handle bounces (mark invalid)
- Unsubscribe link (legally required)

---

## Security Model

### Authentication
- **Provider:** Supabase Auth (JWT-based)
- **Methods:** Magic link (passwordless), optional password
- **Session:** 7 days (sliding window)
- **Refresh:** 30 days

### Authorization
- Role-based access (Admin/Manager/User)
- Row-Level Security (RLS) for multi-tenancy
- API routes check `auth.uid()`

### Data Protection
- Encryption at rest (AES-256)
- Encryption in transit (TLS 1.3)
- PII not indexed
- File uploads (malware scanning in future)

### Compliance
- GDPR-ready (data export, deletion)
- SOC2 Type II (post-MVP)
- ISO 27001 (Year 2)

---

## Performance & Scalability

### Horizontal Scaling
- Serverless functions (0 to N auto-scale)
- Database connection pooling (Supavisor)
- CDN for static assets (Vercel Edge)

### Performance Targets
- Dashboard load: <100ms (p50)
- Document upload: <3s (including AI)
- AI extraction: <2s
- Email delivery: <10s

### Caching
- Static pages: CDN cache (1 hour)
- API responses: SWR (30s stale-while-revalidate)
- Database: Postgres query cache

### Rate Limiting
- API routes: 100 req/min per user
- File uploads: 10/min per user
- Email sends: 1000/day per org

---

## Monitoring & Observability

### Logging
- **Application:** Vercel Logs (stdout/stderr)
- **Database:** Supabase Logs
- **Email:** SendGrid Dashboard

### Metrics
- Error rates (Vercel Analytics)
- Response times (p50, p95, p99)
- AI extraction success rate
- Email delivery rate

### Alerting
- Critical errors → Slack webhook
- AI extraction failure >10% → Alert
- Email bounce rate >5% → Alert
- DB connection pool exhausted → Alert

---

## Deployment Pipeline

### Git Workflow
- **main** → Production (auto-deploy)
- **staging** → Staging (auto-deploy)
- **feature/** → Preview deploys (Vercel)

### CI/CD (GitHub Actions)
1. Push to branch
2. Run lint (ESLint)
3. Run type-check (TypeScript)
4. Run build (Next.js)
5. If main/staging → Deploy to Vercel
6. Run smoke tests (Playwright)

### Environments
- **Local:** `localhost:3000`
- **Preview:** `pr-{number}.vercel.app` (ephemeral)
- **Staging:** `staging.hatsafe.com`
- **Production:** `app.hatsafe.com`

---

## Operational Constraints (MVP)

### Limits
- File upload: 10MB max
- Documents per org: 500 (Starter), 2000 (Pro), Unlimited (Business)
- AI timeout: 10 seconds
- Concurrent uploads: 3 per user

### SLA Targets
- Uptime: 99.5% (MVP), 99.9% (post-launch)
- Support: <24h response (email)
- Bug fix: Critical <24h, High <3d, Medium <1w

---

## Technical Decisions

| Decision | Rationale | Alternatives |
|----------|-----------|-------------|
| Next.js 14 App Router | React 18 Server Components, streaming, best DX | Remix, SvelteKit |
| Supabase | Postgres + Auth + Storage in one, excellent RLS | Firebase, custom Postgres |
| OpenAI GPT-4o-mini | Best accuracy for docs, cost-effective | AWS Textract, Google Vision |
| Vercel | Zero-config deploys, edge network, tight Next.js integration | AWS Amplify, Railway |
| SendGrid | Industry standard, high deliverability, robust APIs | Resend, Postmark |
| TypeScript | Type safety, IDE support, catches bugs early | Plain JavaScript |
| Tailwind CSS | Utility-first, fast iteration, consistent design | CSS Modules, Styled Components |

---

## Future Enhancements

### Known Limitations (MVP)
- No real-time collaboration (polling only)
- No offline mode
- Single region (UK only)
- Basic reporting only

### Post-MVP Roadmap
- **Phase 2:** Native mobile apps (React Native)
- **Phase 3:** Third-party APIs (DVLA, CSCS)
- **Phase 4:** Advanced analytics (ML predictions)
- **Phase 5:** White-label platform

---

**Document Maintainer:** Doug (Tech Lead)  
**Last Reviewed:** 2026-04-08  
**Next Review:** Post-Beta (Week 12)  
**Status:** ✅ Implementation Ready
