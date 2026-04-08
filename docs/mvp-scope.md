# HatSafe MVP Scope

**Version:** 3.0  
**Last Updated:** 2026-04-08  
**Status:** ✅ Canonical Product Reference

---

## Product Vision

HatSafe helps construction companies, facilities managers, and trades businesses **proactively track expiring certificates, licenses, and inspections** across people, vehicles, and equipment.

**Core Value Proposition:**  
Never miss a critical renewal. Replace spreadsheets with AI that reads your documents and alerts you before things expire.

**Primary Differentiator:**  
AI document extraction - upload a certificate, AI reads the expiry date automatically. Zero manual data entry.

---

## Target Market

### Primary Users
- **Operations Managers** - Track compliance across teams and sites
- **Site Managers** - Monitor workers and equipment on-site
- **Fleet Managers** - Manage vehicle documentation and renewals

### Industry Focus
- Construction (primary)
- Facilities management
- Events, security, cleaning
- Scaffolding, plant hire

### Geography
- UK (MVP launch)
- EU expansion (Year 1)
- US/Canada (Year 2)

---

## MVP Features

### 1. Entity Management

**Entity Types:**
- **People** - Workers, staff, subcontractors
- **Vehicles** - Fleet vehicles, vans, company cars
- **Assets** - Equipment, machinery, tools

**Capabilities:**
- Create, edit, delete entities
- Entity profiles with documents and expiry timeline
- Search and filter
- Team and site grouping

**Out of Scope (Post-MVP):**
- Bulk import/export
- Custom entity types
- Complex hierarchies
- Mobile native apps

---

### 2. AI Document Upload

**Supported Document Types:**
- CSCS Cards, Driving Licenses, MOT Certificates
- Insurance, LOLER, PAT, Gas Safe
- Scaffolding Tickets, First Aid Certificates

**Upload Flow:**
1. Drag/drop document (PDF, JPG, PNG)
2. AI extracts: type, number, issue date, **expiry date**, issuer, holder
3. User reviews pre-filled form
4. Confirm and save

**AI Capabilities:**
- Structured JSON extraction (OpenAI GPT-4o-mini Vision)
- Confidence scoring (High/Medium/Low)
- Automatic date normalization
- Entity matching

**Out of Scope (Post-MVP):**
- Batch upload
- Email forwarding
- Third-party integrations (DVLA, CSCS APIs)

---

### 3. Expiry Tracking & Alerts

**Dashboard:**
- Compliance summary (total entities, critical alerts, warnings)
- Expiry alerts widget (expired, <7 days, 7-30 days, 30-60 days)
- Calendar view (30-day expiry heatmap)

**Alert Categories:**
- 🔴 **Critical:** Expired or <7 days remaining
- 🟠 **Warning:** 7-30 days remaining
- 🔵 **Info:** 30-60 days remaining

**Status Logic:**
- `expired` - Past expiry date
- `expiring_soon` - Within 30 days
- `valid` - More than 30 days
- `no_expiry` - Does not expire

**Out of Scope (Post-MVP):**
- Predictive analytics
- Custom alert thresholds per document type
- SMS notifications
- Client portals

---

### 4. Email Notifications

**Notification Schedule:**
- 30 days before expiry
- 14 days before expiry
- 7 days before expiry
- On expiry day
- Daily digest (upcoming)
- Weekly digest (next 7 days)

**Email Content:**
- Document type and number
- Entity name
- Days until expiry
- Direct link to profile
- Action required

**Out of Scope (Post-MVP):**
- In-app notification center
- Slack/Teams integrations
- Custom workflow automation

---

### 5. Document Versioning

**Renewal Flow:**
1. User uploads renewed document
2. AI extracts new expiry date
3. Old version archived
4. New version becomes current
5. Notifications stop automatically

**Audit Trail:**
- Full version history retained
- Timestamp and user tracking
- Version comparison

**Out of Scope (Post-MVP):**
- Automatic renewal reminders to suppliers
- Training booking workflows
- Third-party renewal integrations

---

### 6. Reporting & Export

**Reports:**
- Expiring soon (next 30 days)
- Expired documents
- Missing documents
- Coverage per team/site

**Formats:**
- CSV export
- PDF summary reports

**Out of Scope (Post-MVP):**
- Custom report builder
- Advanced analytics dashboard
- Compliance benchmarking
- API access for third-party tools

---

### 7. User Management

**Roles:**
- **Admin** - Full access, manage users, settings, billing
- **Manager** - View all, manage own team
- **User** - View own entities only

**Features:**
- Multi-tenant isolation
- Team-based filtering
- Organization settings
- User invites (email)
- Stripe billing integration

**Out of Scope (Post-MVP):**
- SSO/SAML
- Fine-grained custom permissions
- Public audit log viewer
- LDAP integration

---

## Data Model

### Core Entities

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

## User Workflows

### Upload Workflow
1. Navigate to entity page
2. Click "Upload Document"
3. Drag/drop file
4. AI extraction (2-3s)
5. Review pre-filled form
6. Save document
7. Dashboard updates in real-time

### AI Fallback Scenarios
- **AI fails** → Show manual entry form
- **Low confidence** → Highlight fields needing review
- **Unsupported file** → Show error with supported types

### Notification Workflow
- Daily cron job runs at 6am GMT
- Query documents expiring in 30/14/7 days
- Generate personalized email per user
- Send via SendGrid/Resend
- Log delivery status

### Weekly Digest
- Runs Monday 6am GMT
- Summary of this week's expiries
- Grouped by severity
- Action links included

---

## MVP Boundaries

### ✅ Included in MVP
- Web app (desktop and mobile browser)
- AI document extraction
- Email notifications
- Basic reporting
- Stripe subscriptions
- UK deployment only

### 🚫 Post-MVP
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
- [ ] Upload flow fully tested end-to-end
- [ ] Email notifications reliable
- [ ] Real-time dashboard alerts
- [ ] Stripe subscriptions (test mode)
- [ ] Full QA pass
- [ ] User documentation written
- [ ] 3-5 beta users recruited

### Month 1 Post-Launch
- [ ] 10 paying customers
- [ ] <5% churn rate
- [ ] 500+ documents processed
- [ ] AI accuracy >85%
- [ ] Zero critical bugs
- [ ] <100ms dashboard load time (p50)

### Month 3 Post-Launch
- [ ] 50 paying customers
- [ ] £5k MRR (Monthly Recurring Revenue)
- [ ] 5,000+ documents processed
- [ ] Net Promoter Score >40
- [ ] Feature requests prioritized for Phase 2

---

## Pricing

| Plan | Price/month | Limits |
|------|-------------|--------|
| **Starter** | £49 | 50 people, 20 vehicles, 10 assets, 500 docs |
| **Professional** | £99 | 200 people, 100 vehicles, 50 assets, 2000 docs |
| **Business** | £199 | Unlimited entities and documents, priority support |

**Trial:** 14 days free, no credit card required  
**Billing:** Monthly or annual (annual = 2 months free)  
**Cancellation:** Cancel anytime, no penalties

---

## Open Questions

1. **Document retention:** 7 years for archived versions?  
   → Proposal: Yes, for compliance requirements

2. **AI fallback:** Force manual review when confidence <40%?  
   → Proposal: Allow save with warning banner

3. **Notification customization:** Allow custom thresholds per org?  
   → Proposal: Not in MVP, add in Phase 2

4. **Team hierarchy:** Multi-level or flat structure?  
   → Proposal: Flat in MVP, nested in Phase 2

5. **Custom document types:** Unlimited or cap at 50 per org?  
   → Proposal: Unlimited (no technical reason to cap)

---

**Document Owner:** Harvey (Product Strategy)  
**Technical Owner:** Doug (Engineering)  
**Approved By:** Benjamin Brown  
**Next Review:** Post-Beta (Week 12)
