# HatSafe MVP Scope

**Version:** 3.0  
**Last Updated:** 2026-04-08  
**Status:** ✅ Canonical Reference

---

## Product Overview

**What:** AI-powered compliance document management for construction and facilities

**Core Value:** Never miss a critical renewal. Replace spreadsheets with AI that reads your documents and alerts you before things expire.

**Primary Differentiator:** AI document extraction - upload a certificate, AI reads the expiry date automatically. No manual data entry.

**Target Launch:** May 2026 (Week 10)

---

## Target Users

### Primary Personas
- **Operations Managers** - Track compliance across teams and sites
- **Site Managers** - Monitor workers and equipment on-site
- **Fleet Managers** - Manage vehicle documentation and renewals

### Core Needs
1. Know what's expiring before it becomes critical
2. Reduce time spent tracking renewals in spreadsheets
3. Avoid compliance violations and penalties
4. Automate expiry notifications

---

## Entities

**Three entity types:**

### People
Workers, staff, subcontractors
- Profiles, teams, sites
- Contact info, job titles
- Document attachments

### Vehicles
Fleet vehicles, vans, company cars
- Registration, make, model
- Assignment tracking
- Document attachments

### Assets
Equipment, machinery, tools
- Serial numbers, locations
- Site assignments
- Document attachments

**All entities support:**
- Create, read, update, delete
- Search and filter
- Status tracking (active/inactive)
- Document management

**Out of scope (MVP):**
- Bulk import
- Custom entity types
- Complex hierarchies
- Mobile apps (web-only)

---

## AI Document Upload

### Supported Types
- CSCS Cards, Driving Licenses, MOT Certificates
- Insurance, LOLER, PAT, Gas Safe
- Scaffolding Tickets, compliance certificates

### Upload Flow
1. Drag/drop document (PDF, JPG, PNG)
2. AI extracts: type, number, issue date, **expiry date**, issuer, holder
3. User reviews pre-filled form
4. Confirm and save

### AI Capabilities
- Structured JSON extraction (OpenAI GPT-4o-mini Vision)
- Confidence scoring (High/Medium/Low)
- Automatic date normalization
- Entity matching suggestions

### Fallback
- AI fails → Manual entry form
- Low confidence → Highlight fields needing review
- Unsupported file → Error with supported types

**Out of scope (MVP):**
- Batch upload
- Email forwarding
- Third-party APIs (DVLA, CSCS)
- OCR for scanned images (relies on Vision model)

---

## Expiry Tracking

### Dashboard Widgets
- **Compliance Summary** - Total entities, critical alerts, warnings
- **Expiry Alerts** - Expired, <7 days, 7-30 days, 30-60 days
- **Calendar View** - 30-day heatmap

### Alert Categories
| Status | Threshold | Color |
|--------|-----------|-------|
| **Critical** | Expired or <7 days | Red |
| **Warning** | 7-30 days | Amber |
| **Info** | 30-60 days | Blue |

### Status Calculation
- `expired` - Past expiry date
- `expiring_soon` - Within 30 days
- `valid` - More than 30 days
- `no_expiry` - Does not expire

**Out of scope (MVP):**
- Predictive analytics
- Custom alert thresholds
- SMS notifications (email only)
- Client portals

---

## Email Notifications

### Triggers
- **30 days** before expiry
- **14 days** before expiry
- **7 days** before expiry
- **On expiry day**
- **Daily digest** (upcoming)
- **Weekly digest** (next 7 days)

### Email Content
- Document type, number, entity name
- Days until expiry
- Direct link to profile
- Action required

**Out of scope (MVP):**
- In-app notification center
- Slack/Teams integrations
- Custom workflows
- Push notifications

---

## Document Versioning

### Renewal Flow
1. User uploads renewed document
2. AI extracts new expiry
3. Old version archived, new becomes current
4. Notifications stop for renewed item

### Audit Trail
- Full history retained (7 years)
- Who uploaded, when
- Version comparison view

**Out of scope (MVP):**
- Automatic renewal reminders to suppliers
- Training booking workflows
- Third-party renewal integrations

---

## Reporting

### Built-in Reports
- Expiring soon (next 30 days)
- Expired documents
- Missing documents
- Coverage per team/site

### Export Formats
- CSV export
- PDF summary reports

**Out of scope (MVP):**
- Custom report builder
- Advanced analytics
- Compliance benchmarking
- API access

---

## User Management

### Roles
| Role | Permissions |
|------|-------------|
| **Admin** | Full access, manage users, settings, billing |
| **Manager** | View all, manage own team |
| **User** | View own entities only |

### Features
- Multi-tenant isolation (organization-based)
- Team-based filtering
- Organization settings
- User invites
- Billing (Stripe)

**Out of scope (MVP):**
- SSO/SAML
- Fine-grained permissions
- Public audit log viewer
- Custom roles

---

## Data Model

### Core Schema

**Person**
```
id, name, email, phone, job_title
team_id, site_id, status
documents[]
```

**Vehicle**
```
id, registration, make, model, year
vehicle_type, assigned_to
status, documents[]
```

**Asset**
```
id, name, asset_type, serial_number
location, site_id, status
documents[]
```

**Document**
```
id, entity_type, entity_id
document_type, document_number
issue_date, expiry_date, issuer
file_url, ai_extracted, ai_confidence
expiry_status, version_number
parent_document_id (for renewals)
created_at, created_by
```

---

## User Flows

### 1. Upload Flow
```
1. Navigate to entity page
2. Click "Upload Document"
3. Drag/drop file
4. AI extraction (2-3s loading state)
5. Review pre-filled form
6. Save
7. Dashboard updates in real-time
```

### 2. Notification Flow
```
1. Daily cron job runs at 6am GMT
2. Query documents expiring in 30/14/7 days
3. Generate email per user
4. Send via SendGrid/Resend
5. Log delivery status
```

### 3. Weekly Digest
```
1. Runs Monday 6am GMT
2. Summary of this week's expiries
3. Grouped by severity (Critical > Warning > Info)
4. Action links included
```

---

## MVP Boundaries

### ✅ Included in MVP
- Web app (desktop and mobile browser)
- AI document extraction
- Email notifications (daily, weekly)
- Basic reporting (CSV, PDF)
- Stripe subscriptions
- UK deployment only
- Single organization model

### 🚫 Deferred to Post-MVP
- Native mobile apps (iOS/Android)
- Third-party API integrations (DVLA, CSCS)
- Client portals (white-label)
- Advanced analytics (ML predictions)
- Bulk import/export
- SSO/SAML
- Custom workflow automation
- Integration marketplace
- AI chat assistant
- E-signature support
- Automatic renewal purchasing
- Offline mode
- Real-time collaboration

---

## Success Criteria

### Launch Readiness (Week 10)
- [ ] All CRUD working for People/Vehicles/Assets
- [ ] AI extraction >80% accuracy
- [ ] Upload flow end-to-end tested
- [ ] Email notifications reliable
- [ ] Real-time dashboard alerts
- [ ] Stripe subscriptions (test mode)
- [ ] Full QA pass
- [ ] User docs written
- [ ] 3-5 beta users recruited

### Month 1 Post-Launch
- [ ] 10 paying customers
- [ ] <5% churn
- [ ] 500+ documents processed
- [ ] AI accuracy >85%
- [ ] Zero critical bugs
- [ ] <100ms dashboard load time

### Month 3 Post-Launch
- [ ] 50 paying customers
- [ ] £5k MRR
- [ ] 5,000+ documents processed
- [ ] Net Promoter Score >40
- [ ] Feature requests prioritized

---

## Pricing

| Plan | Price/mo | Limits |
|------|----------|--------|
| **Starter** | £49 | 50 people, 20 vehicles, 10 assets, 500 docs |
| **Professional** | £99 | 200 people, 100 vehicles, 50 assets, 2000 docs |
| **Business** | £199 | Unlimited entities and documents, priority support |

**Trial:** 14-day free trial, no credit card required  
**Billing:** Monthly or annual, cancel anytime

---

## Open Questions

1. **Document retention:** 7 years for archived versions? *(Proposal: Yes, for compliance)*
2. **AI fallback:** Force manual review when confidence <40%? *(Proposal: Allow save with warning)*
3. **Notification customization:** Allow custom thresholds? *(Proposal: Not in MVP)*
4. **Teams hierarchy:** Multi-level or flat? *(Proposal: Flat in MVP)*
5. **Custom document types:** Unlimited or cap at 50? *(Proposal: Unlimited)*

---

**Maintained By:** Harvey (Strategy) + Doug (Technical)  
**Approved By:** Benjamin Brown  
**Next Review:** Post-Beta (Week 12)
