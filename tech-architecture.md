# HatSafe Technical Architecture

**Version:** 3.0  
**Last Updated:** 2026-04-08  
**Status:** ✅ Canonical Engineering Reference

---

## Architecture Overview

**Type:** Serverless, multi-tenant SaaS application

**Core Stack:**
- **Frontend:** Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Backend:** Next.js API Routes (serverless functions)
- **Database:** PostgreSQL (Supabase)
- **Storage:** Supabase Storage (S3-backed)
- **AI:** OpenAI GPT-4o-mini Vision
- **Email:** SendGrid (primary) / Resend (fallback)
- **Hosting:** Vercel

**Design Principles:**
1. **Simplicity** - Minimal moving parts, single stack
2. **Scalability** - Serverless auto-scaling
3. **Security** - Row-Level Security, encrypted storage
4. **Speed** - Edge functions, optimistic UI
5. **Cost Efficiency** - Pay-per-use model

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

### Technology
- **Framework:** Next.js 14 App Router
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS 3
- **Components:** Radix UI (headless)
- **Icons:** Lucide React

### Page Structure
```
/                    → Public homepage
/dashboard           → Compliance dashboard
/people              → People management
/vehicles            → Vehicle management
/assets              → Asset management
/documents           → Document list/upload
/settings            → Org settings, users, billing
```

### Data Fetching Pattern
- **Server Components:** Direct Supabase queries (async RSC)
- **Client Components:** SWR for real-time updates
- **Optimistic UI:** Immediate feedback on mutations

### State Management
- React Server Components for server data
- React hooks (useState, useContext) for client state
- No global state library (unnecessary for MVP scope)

### Design System
- **Primary:** Safety Yellow (#FFC107)
- **Neutral:** Deep Black (#1A1A1A)
- **Breakpoints:** sm(640) md(768) lg(1024) xl(1280)

---

## Backend Architecture

### Serverless Functions

**Runtime:** AWS Lambda via Vercel  
**Configuration:**
- Auto-scaling: 0 to N instances
- Timeout: 10 seconds
- Memory: 1GB
- Stateless (no persistent connections)

---

## Core API Endpoints

### POST `/api/documents/extract`

**Purpose:** AI-powered document extraction

**Request:**
```typescript
{
  fileBase64: string;
  fileName: string;
  mimeType: string;
}
```

**Response:**
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

**Processing Flow:**
1. Validate file (type, <10MB)
2. Send to OpenAI Vision API
3. Parse structured JSON response
4. Validate and normalize dates
5. Calculate confidence score
6. Return extraction data

**Error Codes:**
- `400` - Invalid file type
- `413` - File too large
- `503` - AI API failure (retry)
- `504` - Timeout

---

### POST `/api/documents/upload`

**Purpose:** Save file and create database record

**Request:**
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

**Processing Flow:**
1. Upload file to Supabase Storage
2. Generate path: `{orgId}/{entityType}/{entityId}/{uuid}.{ext}`
3. Create document record in database
4. Calculate `expiry_status`
5. Return document ID and signed URL

**Security:**
- Auth required (Supabase JWT)
- RLS policies enforce org isolation
- File type whitelist: PDF, JPG, PNG
- 10MB size limit

---

### POST `/api/notifications/send`

**Purpose:** Daily email notification job

**Trigger:** Vercel Cron (daily 6am GMT)

**Processing Flow:**
1. Query documents expiring in 30/14/7 days
2. Group alerts by user
3. Generate email template
4. Send via SendGrid/Resend
5. Log notification delivery

**Rate Limiting:**
- Max 100 emails per batch
- 1-second delay between sends
- Retry failed sends (max 3 attempts)

---

## Database Schema

### Technology
- **Provider:** Supabase (managed PostgreSQL)
- **Region:** EU West (London)
- **Version:** PostgreSQL 15+
- **Connection Pooling:** Supavisor

---

### Core Tables

#### `organisations`
```sql
id                    UUID PRIMARY KEY
name                  TEXT NOT NULL
plan                  TEXT (starter | professional | business)
stripe_customer_id    TEXT
stripe_subscription_id TEXT
created_at            TIMESTAMPTZ DEFAULT NOW()
updated_at            TIMESTAMPTZ DEFAULT NOW()
```

#### `users`
```sql
id                    UUID PRIMARY KEY REFERENCES auth.users
organisation_id       UUID REFERENCES organisations
email                 TEXT NOT NULL
full_name             TEXT
role                  TEXT (admin | manager | user)
created_at            TIMESTAMPTZ DEFAULT NOW()
```

#### `teams`
```sql
id                    UUID PRIMARY KEY
organisation_id       UUID REFERENCES organisations
name                  TEXT NOT NULL
site_id               UUID REFERENCES sites
created_at            TIMESTAMPTZ DEFAULT NOW()
```

#### `sites`
```sql
id                    UUID PRIMARY KEY
organisation_id       UUID REFERENCES organisations
name                  TEXT NOT NULL
address               TEXT
created_at            TIMESTAMPTZ DEFAULT NOW()
```

#### `people`
```sql
id                    UUID PRIMARY KEY
organisation_id       UUID REFERENCES organisations
team_id               UUID REFERENCES teams
site_id               UUID REFERENCES sites
name                  TEXT NOT NULL
email                 TEXT
phone                 TEXT
job_title             TEXT
status                TEXT (active | inactive)
created_at            TIMESTAMPTZ DEFAULT NOW()
```

#### `vehicles`
```sql
id                    UUID PRIMARY KEY
organisation_id       UUID REFERENCES organisations
registration          TEXT NOT NULL
make                  TEXT
model                 TEXT
year                  INTEGER
vehicle_type          TEXT
assigned_to           UUID REFERENCES people
status                TEXT (active | inactive)
created_at            TIMESTAMPTZ DEFAULT NOW()
```

#### `assets`
```sql
id                    UUID PRIMARY KEY
organisation_id       UUID REFERENCES organisations
site_id               UUID REFERENCES sites
name                  TEXT NOT NULL
asset_type            TEXT
serial_number         TEXT
location              TEXT
status                TEXT (active | inactive)
created_at            TIMESTAMPTZ DEFAULT NOW()
```

#### `document_types`
```sql
id                    UUID PRIMARY KEY
organisation_id       UUID REFERENCES organisations
name                  TEXT NOT NULL
category              TEXT
requires_expiry       BOOLEAN DEFAULT TRUE
default_validity_days INTEGER
created_at            TIMESTAMPTZ DEFAULT NOW()
```

#### `documents`
```sql
id                    UUID PRIMARY KEY
organisation_id       UUID REFERENCES organisations
entity_type           TEXT (person | vehicle | asset)
entity_id             UUID NOT NULL
document_type_id      UUID REFERENCES document_types
document_number       TEXT
issue_date            DATE
expiry_date           DATE
issuer                TEXT
file_url              TEXT NOT NULL
file_name             TEXT
file_size             INTEGER
mime_type             TEXT
ai_extracted          BOOLEAN DEFAULT FALSE
ai_confidence         DECIMAL(3,2)
expiry_status         TEXT (valid | expiring_soon | expired | no_expiry)
version_number        INTEGER DEFAULT 1
parent_document_id    UUID REFERENCES documents
created_at            TIMESTAMPTZ DEFAULT NOW()
created_by            UUID REFERENCES users
```

#### `notifications`
```sql
id                    UUID PRIMARY KEY
organisation_id       UUID REFERENCES organisations
user_id               UUID REFERENCES users
document_id           UUID REFERENCES documents
type                  TEXT (expiry_30 | expiry_14 | expiry_7 | expired | digest)
sent_at               TIMESTAMPTZ
status                TEXT (pending | sent | failed)
created_at            TIMESTAMPTZ DEFAULT NOW()
```

#### `audit_logs`
```sql
id                    UUID PRIMARY KEY
organisation_id       UUID REFERENCES organisations
user_id               UUID REFERENCES users
action                TEXT NOT NULL
resource_type         TEXT
resource_id           UUID
metadata              JSONB
created_at            TIMESTAMPTZ DEFAULT NOW()
```

---

### Row-Level Security (RLS)

**Purpose:** Multi-tenant isolation at database level

**How it Works:**  
Every query auto-filters by `organisation_id` based on authenticated user.

**Example Policy:**
```sql
CREATE POLICY "org_isolation_documents"
ON documents FOR SELECT
USING (
  organisation_id = (
    SELECT organisation_id FROM users WHERE id = auth.uid()
  )
);
```

**All tables have RLS enabled** - ensures zero cross-tenant data leakage.

---

## Storage Architecture

### Supabase Storage
- **Backend:** AWS S3
- **Bucket:** `documents` (private)
- **Encryption:** AES-256 at rest
- **Region:** EU West (London)

### File Organization
```
documents/
  {organisation_id}/
    people/{person_id}/{uuid}.pdf
    vehicles/{vehicle_id}/{uuid}.pdf
    assets/{asset_id}/{uuid}.pdf
```

### Access Control
- Private bucket (signed URLs only)
- 1-hour URL expiry
- RLS policies check `organisation_id`
- Soft delete only (flag, don't remove)

### File Lifecycle
- Uploaded files retained indefinitely
- Archived versions retained 7 years
- Soft delete only (compliance requirement)

---

## AI Processing

### OpenAI GPT-4o-mini Vision

**Model:** `gpt-4o-mini` with vision capabilities  
**Cost:** ~$0.01 per extraction  
**Latency:** <2s average

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
4. Validate date logic (issue < expiry)
5. Calculate confidence score
6. Return structured extraction

### Error Handling
- Invalid JSON → Low confidence, partial data
- API timeout → Retry once, fallback to manual entry
- Rate limit → Exponential backoff

### Accuracy Targets
- **>85%** field accuracy
- **>90%** document type classification

---

## Email Architecture

### Provider Configuration
- **Primary:** SendGrid
- **Fallback:** Resend
- **Domain:** `notifications.hatsafe.com`
- **Authentication:** DKIM/SPF configured

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
- Track open/click rates (SendGrid Analytics)
- Handle bounces (mark email invalid)
- Unsubscribe support (legally required)

---

## Security Model

### Authentication
- **Provider:** Supabase Auth (JWT-based)
- **Methods:** Magic link (passwordless), optional password
- **Session Duration:** 7 days (sliding window)
- **Refresh Token:** 30 days

### Authorization
- **Role-Based Access:** Admin / Manager / User
- **Row-Level Security:** Multi-tenant isolation
- **API Auth:** Check `auth.uid()` on all routes

### Data Protection
- **At Rest:** AES-256 encryption
- **In Transit:** TLS 1.3
- **PII:** Not indexed, anonymized in logs
- **File Upload:** Malware scanning (future enhancement)

### Compliance Readiness
- GDPR (data export, deletion)
- SOC2 Type II (post-MVP)
- ISO 27001 (Year 2 target)

---

## Performance & Scalability

### Horizontal Scaling
- Serverless functions (0 to N auto-scale)
- Database connection pooling (Supavisor)
- CDN for static assets (Vercel Edge)

### Performance Targets
| Metric | Target |
|--------|--------|
| Dashboard load (p50) | <100ms |
| Document upload (incl. AI) | <3s |
| AI extraction | <2s |
| Email delivery | <10s |

### Caching Strategy
- **Static Pages:** CDN cache (1 hour)
- **API Responses:** SWR (30s stale-while-revalidate)
- **Database:** Postgres query cache

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

### Key Metrics
- Error rates (Vercel Analytics)
- Response times (p50, p95, p99)
- AI extraction success rate
- Email delivery rate
- Database connection pool usage

### Alerting Rules
- Critical errors → Slack webhook
- AI extraction failure >10% → Alert
- Email bounce rate >5% → Alert
- DB connection pool exhausted → Alert

---

## Deployment Pipeline

### Git Workflow
- **`main`** → Production (auto-deploy)
- **`staging`** → Staging (auto-deploy)
- **`feature/*`** → Preview deploys (Vercel)

### CI/CD Pipeline (GitHub Actions)
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

### System Limits
- File upload: 10MB max
- Documents per org: 500 (Starter), 2000 (Pro), Unlimited (Business)
- AI timeout: 10 seconds
- Concurrent uploads: 3 per user

### SLA Targets
- **Uptime:** 99.5% (MVP), 99.9% (post-launch)
- **Support Response:** <24h (email)
- **Bug Fix SLA:**
  - Critical: <24h
  - High: <3 days
  - Medium: <1 week

---

## Technical Decisions

| Decision | Rationale | Alternatives Considered |
|----------|-----------|------------------------|
| Next.js 14 App Router | React 18 Server Components, streaming, best DX | Remix, SvelteKit |
| Supabase | Postgres + Auth + Storage unified, excellent RLS | Firebase, custom Postgres |
| OpenAI GPT-4o-mini | Best doc accuracy, cost-effective | AWS Textract, Google Vision |
| Vercel | Zero-config deploys, edge network, tight Next.js integration | AWS Amplify, Railway |
| SendGrid | Industry standard, high deliverability, robust APIs | Resend, Postmark |
| TypeScript | Type safety, IDE support, catches bugs early | Plain JavaScript |
| Tailwind CSS | Utility-first, fast iteration, consistent design | CSS Modules, Styled Components |

---

## Known Limitations (MVP)

- No real-time collaboration (polling only)
- No offline mode
- Single region deployment (UK only)
- Basic reporting only (no custom queries)
- Email notifications only (no SMS/push)

---

## Post-MVP Roadmap

- **Phase 2:** Native mobile apps (React Native)
- **Phase 3:** Third-party APIs (DVLA, CSCS)
- **Phase 4:** Advanced analytics (ML predictions)
- **Phase 5:** White-label platform

---

**Maintained By:** Doug (Tech Lead)  
**Approved By:** Benjamin Brown  
**Next Review:** Post-Beta (Week 12)
