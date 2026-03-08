# HatSafe 🦺

**AI-powered compliance document management for construction, facilities, and trades.**

Track expiring certificates, licenses, and inspections across people, vehicles, and equipment. Never miss a renewal again.

---

## What It Does

HatSafe replaces spreadsheets and folders with:

- ✅ **AI document extraction** - Upload a cert, AI reads the expiry date
- ✅ **Proactive alerts** - Email reminders 30/14/7 days before expiry
- ✅ **Live compliance dashboard** - Always know what's expiring soon
- ✅ **Document versioning** - Full history when you upload renewals
- ✅ **Role-based access** - Teams only see their own entities

**Built for non-technical teams:** Simple, fast, reliable.

---

## Tech Stack

- **Frontend:** Next.js 14, TypeScript, Tailwind CSS
- **Backend:** Supabase (Postgres + Auth + Storage)
- **AI:** AWS Bedrock (Claude for document extraction)
- **Payments:** Stripe (subscription billing)
- **Email:** SendGrid/Resend (transactional emails)
- **Hosting:** Vercel (serverless, auto-scaling)

---

## Brand Colors

- **Primary:** Safety Yellow (#FFC107) - High visibility, construction/safety association
- **Secondary:** Deep Black (#1A1A1A) - Professional, trustworthy
- **Status:** Green (valid) · Amber (expiring) · Red (expired) · Grey (missing)

See `DESIGN_SYSTEM.md` for full design guidelines.

---

## Project Structure

```
/app                    - Next.js pages (App Router)
  /dashboard            - Main dashboard
  /people               - People management
  /vehicles             - Vehicles management
  /assets               - Assets/equipment management
  /documents            - Document management
  /calendar             - Calendar view
  /reports              - Reporting and exports
  /settings             - Org settings, users, doc types
  /api                  - API routes
/components             - React components
  /ui                   - Reusable UI components
  /forms                - Form components
  /layout               - Layout components (sidebar, header, nav)
/lib                    - Utilities and helpers
  /api                  - API client functions
  /supabase             - Supabase client
  /ai                   - AI extraction logic
  /utils                - Utility functions
  /types                - TypeScript types
/public                 - Static assets
```

---

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Supabase account (free tier works)
- AWS Bedrock access (Claude model)
- Stripe account (test mode)

### 1. Clone and Install

```bash
git clone https://github.com/yourusername/hatsafe.git
cd hatsafe
npm install
```

### 2. Environment Setup

Copy `.env.example` to `.env.local` and fill in your values:

```bash
cp .env.example .env.local
```

Required variables:
- `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY` (Bedrock access)
- `STRIPE_SECRET_KEY` and `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- Email provider API key (SendGrid or Resend)

### 3. Supabase Setup

1. Create a new Supabase project at https://supabase.com
2. Run database migrations (coming in Week 2):
   ```bash
   npm run db:migrate
   ```
3. Enable Storage bucket for documents
4. Configure RLS policies (see `supabase/policies.sql`)

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Build Phases (10 Weeks)

### ✅ Week 1: Foundation (Current)
- [x] Next.js project scaffolded
- [x] Design system defined (black/yellow branding)
- [x] Tailwind config with brand colors
- [ ] Supabase project setup
- [ ] Database schema created
- [ ] Auth flow (signup/login)
- [ ] GitHub repo initialized
- [ ] Vercel deployment

### 📅 Week 2: Entity Management
- [ ] People CRUD (list, profile, create, edit)
- [ ] Vehicles CRUD
- [ ] Assets CRUD
- [ ] Teams and sites management
- [ ] Search and filters

### 📅 Week 3: Document Upload
- [ ] File upload UI (drag-drop)
- [ ] Supabase Storage integration
- [ ] Document list view
- [ ] Manual metadata entry
- [ ] Link documents to entities

### 📅 Week 4: AI Extraction
- [ ] AWS Bedrock integration
- [ ] Text extraction (OCR)
- [ ] Classification prompt
- [ ] Field extraction prompt
- [ ] Entity matching logic
- [ ] Background job processor

### 📅 Week 5: Review Queue
- [ ] Review queue UI (split view)
- [ ] Confidence score display
- [ ] Edit/approve/reject actions
- [ ] Entity search/create flow

### 📅 Week 6: Expiry Tracking
- [ ] Status calculation logic
- [ ] Dashboard with widgets
- [ ] Calendar view (month/week)
- [ ] Compliance summary
- [ ] Document type config (settings)

### 📅 Week 7: Notifications
- [ ] Email templates
- [ ] Notification scheduling (Vercel Cron)
- [ ] Lead time logic (30/14/7 days)
- [ ] Digest reports (daily/weekly)
- [ ] In-app notification center

### 📅 Week 8: Renewals & Versioning
- [ ] Renewal upload flow
- [ ] Version history UI
- [ ] Version comparison
- [ ] Auto-stop notifications on renewal

### 📅 Week 9: Reporting
- [ ] Reports page (expiring, expired, missing, coverage)
- [ ] CSV export
- [ ] PDF summary reports
- [ ] Audit log viewer

### 📅 Week 10: Polish & Launch
- [ ] Stripe subscription UI
- [ ] Usage limits
- [ ] Full QA pass
- [ ] Performance optimization
- [ ] User documentation
- [ ] Beta launch

---

## Database Schema

**Core tables:**
- `organisations` - Multi-tenant isolation
- `users` - Auth and roles
- `teams` - Team management
- `people` - Workers/staff
- `vehicles` - Fleet management
- `assets` - Equipment tracking
- `sites` - Job sites
- `suppliers` - Third-party vendors
- `document_types` - Certificate types (CSCS, MOT, etc.)
- `documents` - Document records
- `document_versions` - Version history
- `document_extractions` - AI processing log
- `notifications` - Email alerts
- `audit_logs` - Full audit trail

See `hatsafe-build-plan.md` for detailed schema.

---

## AI Extraction Pipeline

**Flow:**
1. **Upload** → File stored in Supabase Storage
2. **OCR** → Text extraction (AWS Textract or Claude Vision)
3. **Classify** → Document type identification (Claude)
4. **Extract** → Field extraction (dates, names, cert numbers)
5. **Match** → Link to existing entity (fuzzy matching + AI)
6. **Review** → Low-confidence extractions go to human approval
7. **Store** → Document record created, status calculated

**Confidence thresholds:**
- High (>0.7): Auto-approve
- Medium (0.4-0.7): Review queue
- Low (<0.4): Manual entry

---

## Pricing (Planned)

| Plan | Price/month | Features |
|------|-------------|----------|
| **Starter** | £49 | 50 people, 20 vehicles, 10 assets, 500 documents |
| **Professional** | £99 | 200 people, 100 vehicles, 50 assets, 2000 documents |
| **Business** | £199 | Unlimited entities and documents, API access |

14-day free trial, no credit card required.

---

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project in Vercel dashboard
3. Add environment variables
4. Deploy

Vercel auto-deploys on push to main.

### Manual Deployment

```bash
npm run build
npm start
```

---

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - TypeScript type checking

---

## Contributing

This is a private project during MVP build. Post-launch, contributions welcome.

---

## License

Proprietary. © 2026 HatSafe. All rights reserved.

---

## Support

- **Email:** support@hatsafe.com
- **Docs:** (coming soon)
- **Status:** (coming soon)

---

## Roadmap (Post-MVP)

- Native mobile apps (iOS/Android)
- Training booking workflows
- Third-party integrations (CITB, CSCS APIs)
- Client portals (branded subcontractor access)
- Advanced analytics (benchmarking, predictive expiry)
- White-label/reseller program

---

**Built by:** Ben Brown + Doug (AI assistant)  
**Started:** 2026-03-08  
**Target launch:** Week 10 (May 2026)  
**Domain:** https://hatsafe.com

🚧 **Status:** Week 1 - Foundation in progress
