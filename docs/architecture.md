# HatSafe Architecture

**Version:** 3.0  
**Last Updated:** 2026-04-08  
**Status:** ✅ Canonical Engineering Reference

---

## Architecture Overview

**System Type:** Serverless, multi-tenant SaaS application

**Core Technology Stack:**
- **Frontend:** Next.js 14 (App Router), TypeScript, Tailwind CSS, Radix UI
- **Backend:** Next.js API Routes (serverless functions on AWS Lambda via Vercel)
- **Database:** PostgreSQL 15+ (Supabase with Row-Level Security)
- **Storage:** Supabase Storage (S3-backed, encrypted)
- **AI Processing:** OpenAI GPT-4o-mini Vision
- **Email:** SendGrid (primary), Resend (fallback)
- **Hosting:** Vercel (edge network, auto-scaling)

**Design Principles:**
1. **Simplicity** - Single stack, minimal moving parts
2. **Scalability** - Serverless auto-scaling (0 to N)
3. **Security** - Multi-tenant isolation via RLS, encrypted storage
4. **Performance** - Edge functions, optimistic UI updates
5. **Cost Efficiency** - Pay-per-use model

---

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                      USER BROWSER                            │
│  (Next.js React + Tailwind CSS + TypeScript)                │
└──────────────────────┬───────────────────────────────────────┘
                       │ HTTPS (TLS 1.3)
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                 VERCEL EDGE NETWORK                          │
│  Global CDN + Edge Middleware (auth, geo-routing)           │
└──────────────────────┬───────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│              NEXT.JS API ROUTES (AWS Lambda)                 │
│  /api/documents/extract  → AI extraction                    │
│  /api/documents/upload   → File upload + DB insert          │
│  /api/notifications/send → Email dispatch (cron)            │
│  /api/people, /api/vehicles, /api/assets → CRUD             │
└────┬────────────┬────────────┬─────────────┬────────────────┘
     │            │            │             │
     ▼            ▼            ▼             ▼
┌─────────┐  ┌──────────┐ ┌───────────┐ ┌──────────────┐
│ OpenAI  │  │ Supabase │ │ Supabase  │ │ SendGrid/    │
│ GPT-4o  │  │ Postgres │ │ Storage   │ │ Resend       │
│ mini    │  │  (RLS)   │ │   (S3)    │ │              │
│ Vision  │  │          │ │           │ │              │
└─────────┘  └──────────┘ └───────────┘ └──────────────┘
```

---

## Frontend Architecture

### Technology Stack
- **Framework:** Next.js 14 App Router
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS 3
- **Components:** Radix UI (headless primitives)
- **Icons:** Lucide React
- **Forms:** React Hook Form + Zod validation

### Page Structure
```
/                    → Public homepage
/login               → Authentication
/signup              → Organization registration
/dashboard           → Compliance overview
/people              → People management (list + detail)
/vehicles            → Vehicle management (list + detail)
/assets              → Asset management (list + detail)
/documents           → Document library + upload
/calendar            → Expiry calendar view
/reports             → Compliance reports
/settings            → Org settings, users, billing
```

### Data Fetching Strategy

**Server Components (RSC):**
- Direct Supabase queries via async functions
- Server-side auth check (`createClient()`)
- Automatic caching via React Server Components

**Client Components:**
- SWR for real-time data updates
- Optimistic UI updates for mutations
- Client-side filtering and sorting

### State Management
- **Server State:** React Server Components
- **Client State:** React hooks (`useState`, `useContext`)
- **Form State:** React Hook Form
- **No global state library** (unnecessary for MVP)

### Design System
- **Primary Color:** Safety Yellow (`#FFC107`)
- **Neutral:** Deep Black (`#1A1A1A`)
- **Typography:** Inter (system fallback)
- **Spacing:** 8px grid system
- **Border Radius:** 6px / 10px / 14px (small / medium / large)
- **Status Colors:**
  - 🔴 Red (`#DC2626`) - Expired / Critical
  - 🟠 Amber (`#F59E0B`) - Expiring Soon / Warning
  - 🟢 Green (`#16A34A`) - Valid / Success
  - 🔵 Blue (`#3B82F6`) - Info

---

## Backend Architecture

### Serverless Functions

**Runtime Environment:** AWS Lambda (via Vercel)

**Configuration:**
- **Auto-scaling:** 0 to N instances
- **Timeout:** 10 seconds
- **Memory:** 1GB
- **Concurrency:** Up to 1000 concurrent executions
- **Cold Start:** <200ms (optimized)

**Stateless Design:**
- No persistent connections
- Database connection pooling (Supavisor)
- JWT-based auth (no session storage)

---

## Core API Endpoints

### POST `/api/documents/extract`

**Purpose:** AI-powered document data extraction

**Request Body:**
```typescript
{
  fileBase64: string;     // Base64-encoded file
  fileName: string;
  mimeType: string;       // application/pdf | image/jpeg | image/png
}
```

**Response:**
```typescript
{
  success: boolean;
  extraction: {
    documentType: string;       // "CSCS Card", "MOT Certificate", etc.
    documentNumber: string;
    issueDate: string;          // YYYY-MM-DD
    expiryDate: string;         // YYYY-MM-DD
    issuer: string;
    holderName: string;
    confidence: number;         // 0.0 - 1.0
  };
  error?: string;
}
```

**Processing Flow:**
1. Validate file type and size (<10MB)
2. Send to OpenAI Vision API with structured prompt
3. Parse JSON response
4. Validate and normalize dates (ISO 8601)
5. Calculate confidence score
6. Return extraction data

**Error Handling:**
- `400` Bad Request - Invalid file type
- `413` Payload Too Large - File >10MB
- `503` Service Unavailable - AI API failure (retry once)
- `504` Gateway Timeout - Extraction timeout

---

### POST `/api/documents/upload`

**Purpose:** Upload file to storage and create database record

**Request (multipart/form-data):**
```typescript
{
  file: File;
  entityType: 'person' | 'vehicle' | 'asset';
  entityId: string;                    // UUID
  documentType: string;
  documentNumber?: string;
  issueDate?: string;                  // YYYY-MM-DD
  expiryDate?: string;                 // YYYY-MM-DD
  issuer?: string;
  aiExtracted: boolean;
  aiConfidence?: number;               // 0.0 - 1.0
}
```

**Processing Flow:**
1. Authenticate user (Supabase JWT)
2. Upload file to Supabase Storage
   - Path: `{orgId}/{entityType}/{entityId}/{uuid}.{ext}`
3. Create `documents` table record
4. Calculate `expiry_status` based on expiry date
5. Return document ID and signed URL

**Security:**
- Auth required (Supabase JWT validation)
- RLS policies enforce org isolation
- File type whitelist: PDF, JPG, PNG
- Max file size: 10MB
- Malware scanning: Future enhancement

**Response:**
```typescript
{
  success: boolean;
  documentId: string;      // UUID
  fileUrl: string;         // Signed URL (1-hour expiry)
}
```

---

### POST `/api/notifications/send`

**Purpose:** Daily email notification job (scheduled via Vercel Cron)

**Trigger:** Vercel Cron - Daily at 6:00 AM GMT

**Processing Flow:**
1. Query documents expiring in 30 / 14 / 7 days
2. Group alerts by user and organization
3. Generate personalized email template
4. Send via SendGrid (primary) or Resend (fallback)
5. Log notification delivery in `notifications` table

**Email Triggers:**
- 30 days before expiry
- 14 days before expiry
- 7 days before expiry
- On expiry day
- Weekly digest (Monday 6am GMT)

**Rate Limiting:**
- Max 100 emails per batch
- 1-second delay between sends
- Retry failed sends (max 3 attempts)
- Exponential backoff on provider errors

---

## Database Schema

### Technology
- **Provider:** Supabase (managed PostgreSQL)
- **Region:** EU West (London)
- **Version:** PostgreSQL 15+
- **Connection Pooling:** Supavisor (PgBouncer-based)
- **Replication:** Multi-AZ (high availability)

---

### Core Tables

#### `organisations`
```sql
id                    UUID PRIMARY KEY DEFAULT gen_random_uuid()
name                  TEXT NOT NULL
plan                  TEXT CHECK (plan IN ('starter', 'professional', 'business'))
stripe_customer_id    TEXT
stripe_subscription_id TEXT
created_at            TIMESTAMPTZ DEFAULT NOW()
updated_at            TIMESTAMPTZ DEFAULT NOW()
```

#### `users`
```sql
id                    UUID PRIMARY KEY REFERENCES auth.users(id)
organisation_id       UUID NOT NULL REFERENCES organisations(id)
email                 TEXT NOT NULL UNIQUE
full_name             TEXT
role                  TEXT CHECK (role IN ('admin', 'manager', 'user'))
created_at            TIMESTAMPTZ DEFAULT NOW()
```

#### `teams`
```sql
id                    UUID PRIMARY KEY DEFAULT gen_random_uuid()
organisation_id       UUID NOT NULL REFERENCES organisations(id)
name                  TEXT NOT NULL
site_id               UUID REFERENCES sites(id)
created_at            TIMESTAMPTZ DEFAULT NOW()
```

#### `sites`
```sql
id                    UUID PRIMARY KEY DEFAULT gen_random_uuid()
organisation_id       UUID NOT NULL REFERENCES organisations(id)
name                  TEXT NOT NULL
address               TEXT
created_at            TIMESTAMPTZ DEFAULT NOW()
```

#### `people`
```sql
id                    UUID PRIMARY KEY DEFAULT gen_random_uuid()
organisation_id       UUID NOT NULL REFERENCES organisations(id)
team_id               UUID REFERENCES teams(id)
site_id               UUID REFERENCES sites(id)
name                  TEXT NOT NULL
email                 TEXT
phone                 TEXT
job_title             TEXT
status                TEXT CHECK (status IN ('active', 'inactive'))
created_at            TIMESTAMPTZ DEFAULT NOW()
```

#### `vehicles`
```sql
id                    UUID PRIMARY KEY DEFAULT gen_random_uuid()
organisation_id       UUID NOT NULL REFERENCES organisations(id)
registration          TEXT NOT NULL
make                  TEXT
model                 TEXT
year                  INTEGER
vehicle_type          TEXT
assigned_to           UUID REFERENCES people(id)
status                TEXT CHECK (status IN ('active', 'inactive'))
created_at            TIMESTAMPTZ DEFAULT NOW()
```

#### `assets`
```sql
id                    UUID PRIMARY KEY DEFAULT gen_random_uuid()
organisation_id       UUID NOT NULL REFERENCES organisations(id)
site_id               UUID REFERENCES sites(id)
name                  TEXT NOT NULL
asset_type            TEXT
serial_number         TEXT
location              TEXT
status                TEXT CHECK (status IN ('active', 'inactive'))
created_at            TIMESTAMPTZ DEFAULT NOW()
```

#### `document_types`
```sql
id                    UUID PRIMARY KEY DEFAULT gen_random_uuid()
organisation_id       UUID REFERENCES organisations(id)
name                  TEXT NOT NULL
category              TEXT
requires_expiry       BOOLEAN DEFAULT TRUE
default_validity_days INTEGER
created_at            TIMESTAMPTZ DEFAULT NOW()
```

#### `documents`
```sql
id                    UUID PRIMARY KEY DEFAULT gen_random_uuid()
organisation_id       UUID NOT NULL REFERENCES organisations(id)
entity_type           TEXT CHECK (entity_type IN ('person', 'vehicle', 'asset'))
entity_id             UUID NOT NULL
document_type_id      UUID REFERENCES document_types(id)
document_number       TEXT
issue_date            DATE
expiry_date           DATE
issuer                TEXT
file_url              TEXT NOT NULL
file_name             TEXT NOT NULL
file_size             INTEGER
mime_type             TEXT
ai_extracted          BOOLEAN DEFAULT FALSE
ai_confidence         DECIMAL(3,2) CHECK (ai_confidence BETWEEN 0 AND 1)
expiry_status         TEXT CHECK (expiry_status IN ('valid', 'expiring_soon', 'expired', 'no_expiry'))
version_number        INTEGER DEFAULT 1
parent_document_id    UUID REFERENCES documents(id)
created_at            TIMESTAMPTZ DEFAULT NOW()
created_by            UUID REFERENCES users(id)
archived_at           TIMESTAMPTZ
```

#### `notifications`
```sql
id                    UUID PRIMARY KEY DEFAULT gen_random_uuid()
organisation_id       UUID NOT NULL REFERENCES organisations(id)
user_id               UUID REFERENCES users(id)
document_id           UUID REFERENCES documents(id)
type                  TEXT CHECK (type IN ('expiry_30', 'expiry_14', 'expiry_7', 'expired', 'digest'))
sent_at               TIMESTAMPTZ
status                TEXT CHECK (status IN ('pending', 'sent', 'failed'))
created_at            TIMESTAMPTZ DEFAULT NOW()
```

#### `audit_logs`
```sql
id                    UUID PRIMARY KEY DEFAULT gen_random_uuid()
organisation_id       UUID NOT NULL REFERENCES organisations(id)
user_id               UUID REFERENCES users(id)
action                TEXT NOT NULL
resource_type         TEXT
resource_id           UUID
metadata              JSONB
created_at            TIMESTAMPTZ DEFAULT NOW()
```

---

### Row-Level Security (RLS)

**Purpose:** Multi-tenant data isolation at the database level

**How It Works:**
Every query is automatically filtered by `organisation_id` based on the authenticated user's JWT token.

**Example Policy:**
```sql
-- Users can only access their own organization's documents
CREATE POLICY "org_isolation_documents"
ON documents FOR SELECT
USING (
  organisation_id = (
    SELECT organisation_id FROM users WHERE id = auth.uid()
  )
);
```

**All tables have RLS enabled**, ensuring:
- Zero cross-tenant data leakage
- No application-level filtering needed
- Defense-in-depth security

---

### Indexes

**Performance-critical indexes:**
```sql
-- Document queries by entity
CREATE INDEX idx_documents_entity ON documents(entity_type, entity_id);

-- Expiry status filtering
CREATE INDEX idx_documents_expiry_status ON documents(expiry_status, expiry_date);

-- Organization isolation
CREATE INDEX idx_documents_org ON documents(organisation_id);

-- Notification queries
CREATE INDEX idx_notifications_user_status ON notifications(user_id, status, created_at);
```

---

## Storage Architecture

### Supabase Storage

**Backend:** AWS S3 (managed by Supabase)  
**Bucket:** `documents` (private)  
**Encryption:** AES-256 at rest  
**Region:** EU West (London)

### File Organization
```
documents/
  {organisation_id}/
    people/
      {person_id}/
        {uuid}.pdf
        {uuid}.jpg
    vehicles/
      {vehicle_id}/
        {uuid}.pdf
    assets/
      {asset_id}/
        {uuid}.pdf
```

### Access Control
- **Private bucket** - Signed URLs only
- **URL Expiry:** 1 hour
- **RLS policies** check `organisation_id`
- **Soft delete only** (compliance requirement)

### File Lifecycle
- **Active files:** Indefinite retention
- **Archived versions:** 7 years retention
- **Soft delete:** Flag only, never physically delete
- **Future:** Tiered storage (move old versions to Glacier)

---

## AI Processing

### OpenAI GPT-4o-mini Vision

**Model:** `gpt-4o-mini` (multimodal - text + vision)  
**Cost:** ~$0.01 per document extraction  
**Average Latency:** <2 seconds

### Prompt Engineering

**System Prompt:**
```
You are a document extraction specialist for compliance certificates.
Extract structured data from the provided document image.

Return JSON with this exact structure:
{
  "documentType": "CSCS Card | Driving License | MOT Certificate | Insurance | LOLER | PAT | Gas Safe | First Aid | etc.",
  "documentNumber": "Certificate or license number",
  "issueDate": "YYYY-MM-DD or null",
  "expiryDate": "YYYY-MM-DD or null",
  "issuer": "Issuing authority or organization",
  "holderName": "Person name / Vehicle registration / Asset name",
  "confidence": 0.0 to 1.0
}

Rules:
- Always return valid JSON
- Use ISO 8601 date format (YYYY-MM-DD)
- If a field is unclear or missing, return null
- Validate that issue_date < expiry_date
- Confidence score based on field clarity
```

**User Prompt:**
```
Extract compliance document data from this image.
```

### Response Processing
1. Receive JSON from OpenAI
2. Validate JSON structure
3. Parse and normalize dates
4. Validate date logic (issue < expiry)
5. Calculate overall confidence score
6. Return structured extraction data

### Error Handling
- **Invalid JSON** → Parse partial data, set low confidence
- **API timeout** → Retry once, then fallback to manual entry
- **Rate limit** → Exponential backoff (1s, 2s, 4s)
- **Missing critical fields** → Flag for manual review

### Accuracy Targets
- **>85%** field-level accuracy
- **>90%** document type classification accuracy
- **>80%** expiry date accuracy

---

## Email Architecture

### Provider Configuration
- **Primary:** SendGrid
- **Fallback:** Resend
- **Sending Domain:** `notifications.hatsafe.com`
- **Authentication:** DKIM, SPF, DMARC configured

### Email Templates

**30-Day Expiry Notice:**
```
Subject: [HatSafe] CSCS Card expiring in 30 days - John Smith

Hi [User Name],

⚠️ A compliance document is expiring soon:

📄 Document: CSCS Card (#CSCS-2024-789456)
👤 Holder: John Smith
📅 Expiry Date: 15 May 2027 (30 days remaining)

Action Required: Upload the renewed certificate to avoid compliance gaps.

[View Profile] [Upload Renewal]

--
HatSafe | Compliance Made Simple
Unsubscribe | Notification Settings
```

**Daily Compliance Digest:**
```
Subject: [HatSafe] Daily Compliance Summary - 3 items requiring attention

Good morning [User Name],

🔴 CRITICAL (2)
- CSCS Card expired - John Smith (View)
- MOT Certificate overdue - Vehicle AB12 CDE (View)

⚠️ WARNING (1)
- Insurance expiring in 12 days - Vehicle FG34 HIJ (View)

[View Dashboard] [Manage Notifications]

--
HatSafe | Compliance Made Simple
```

### Delivery Monitoring
- **Open rate tracking** (SendGrid Analytics)
- **Click-through tracking** (UTM parameters)
- **Bounce handling** (mark email invalid)
- **Unsubscribe support** (legally required)
- **Spam complaint monitoring**

---

## Security Architecture

### Authentication
- **Provider:** Supabase Auth (JWT-based)
- **Methods:**
  - Magic link (passwordless, primary)
  - Email + password (optional)
- **Session Duration:** 7 days (sliding window)
- **Refresh Token:** 30 days

### Authorization
- **Role-Based Access Control (RBAC):**
  - **Admin:** Full access, billing, user management
  - **Manager:** View all, manage own team
  - **User:** View own entities only
- **Row-Level Security (RLS):** Multi-tenant isolation
- **API Auth:** JWT validation on all routes

### Data Protection
- **At Rest:** AES-256 encryption (Supabase)
- **In Transit:** TLS 1.3
- **PII Handling:**
  - Not indexed for search
  - Anonymized in logs
  - GDPR-compliant export/deletion
- **File Upload:** Future malware scanning (ClamAV)

### Compliance Readiness
- **GDPR:** Data export, right to be forgotten
- **SOC2 Type II:** Post-MVP target
- **ISO 27001:** Year 2 target

---

## Performance & Scalability

### Horizontal Scaling
- **Serverless functions:** 0 to N auto-scaling (Vercel)
- **Database:** Connection pooling (Supavisor)
- **CDN:** Global edge network (Vercel Edge)

### Performance Targets

| Metric | Target (p50) | Target (p95) |
|--------|--------------|--------------|
| Dashboard load | <100ms | <300ms |
| Document upload (with AI) | <3s | <5s |
| AI extraction | <2s | <4s |
| Email delivery | <10s | <30s |
| API response time | <200ms | <500ms |

### Caching Strategy
- **Static pages:** CDN cache (1 hour TTL)
- **API responses:** SWR (30s stale-while-revalidate)
- **Database queries:** Postgres query cache
- **Images:** CDN cache (7 days TTL)

### Rate Limiting
- **API routes:** 100 requests/minute per user
- **File uploads:** 10/minute per user
- **Email sends:** 1000/day per organization
- **AI extractions:** 50/hour per organization

---

## Monitoring & Observability

### Logging
- **Application Logs:** Vercel Logs (stdout/stderr)
- **Database Logs:** Supabase Dashboard
- **Email Logs:** SendGrid Dashboard
- **Error Tracking:** Sentry (post-MVP)

### Key Metrics
- **Error rates** (Vercel Analytics)
- **Response times** (p50, p95, p99)
- **AI extraction success rate**
- **Email delivery rate**
- **Database connection pool usage**
- **Active users (DAU/MAU)**

### Alerting Rules
| Condition | Action |
|-----------|--------|
| Critical errors >10/min | Slack webhook alert |
| AI extraction failure >10% | Email alert |
| Email bounce rate >5% | Email alert |
| DB connection pool >80% | Slack webhook alert |
| API p95 latency >1s | Email alert |

---

## Deployment Pipeline

### Git Workflow
- **`main`** → Production (auto-deploy)
- **`staging`** → Staging environment (auto-deploy)
- **`feature/*`** → Preview deployments (ephemeral)

### CI/CD Pipeline (GitHub Actions)

**On Push:**
1. Run ESLint (code quality)
2. Run TypeScript type-check
3. Run Next.js build
4. **If `main` or `staging`:** Deploy to Vercel
5. Run Playwright smoke tests

### Environments

| Environment | URL | Purpose |
|-------------|-----|---------|
| **Local** | `localhost:3000` | Development |
| **Preview** | `pr-{number}.vercel.app` | Pull request previews (ephemeral) |
| **Staging** | `staging.hatsafe.com` | Pre-production testing |
| **Production** | `app.hatsafe.com` | Live application |

---

## Operational Constraints (MVP)

### System Limits
- **File upload:** 10MB max per file
- **Documents per org:**
  - Starter: 500 documents
  - Professional: 2,000 documents
  - Business: Unlimited
- **AI timeout:** 10 seconds
- **Concurrent uploads:** 3 per user

### SLA Targets
- **Uptime:** 99.5% (MVP), 99.9% (post-launch)
- **Support Response Time:** <24 hours (email)
- **Bug Fix SLA:**
  - Critical: <24 hours
  - High: <3 days
  - Medium: <1 week
  - Low: <1 month

---

## Technical Decisions

| Decision | Rationale | Alternatives Considered |
|----------|-----------|------------------------|
| **Next.js 14 App Router** | React Server Components, streaming, best DX | Remix, SvelteKit, Astro |
| **Supabase** | Unified platform: Postgres + Auth + Storage + RLS | Firebase, AWS Amplify, custom Postgres |
| **OpenAI GPT-4o-mini** | Best document accuracy, cost-effective | AWS Textract, Google Vision, Azure Form Recognizer |
| **Vercel** | Zero-config deploys, edge network, Next.js integration | AWS Amplify, Railway, Fly.io |
| **SendGrid** | Industry standard, high deliverability | Resend, Postmark, AWS SES |
| **TypeScript** | Type safety, IDE support, early bug detection | Plain JavaScript |
| **Tailwind CSS** | Utility-first, fast iteration, consistent design | CSS Modules, Styled Components, Emotion |

---

## Known Limitations (MVP)

- ❌ No real-time collaboration (polling only)
- ❌ No offline mode
- ❌ Single region (UK only)
- ❌ Basic reporting only
- ❌ Email notifications only (no SMS/push)
- ❌ No native mobile apps
- ❌ No bulk import/export
- ❌ No third-party integrations

---

## Post-MVP Roadmap

- **Phase 2:** Native mobile apps (React Native)
- **Phase 3:** Third-party APIs (DVLA, CSCS)
- **Phase 4:** Advanced analytics (ML predictions)
- **Phase 5:** White-label platform
- **Phase 6:** Integration marketplace

---

**Maintained By:** Doug (Tech Lead)  
**Reviewed By:** Benjamin Brown  
**Next Review:** Post-Beta (Week 12)
