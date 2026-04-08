# HatSafe - Product Scope & MVP Boundaries

**Version:** 2.0  
**Last Updated:** 2026-04-08  
**Product:** HatSafe - AI-Powered Compliance Document Management  
**Target Launch:** May 2026 (Week 10)

---

## Product Vision

HatSafe helps construction companies, facilities managers, and trades businesses proactively track expiring certificates, licenses, and inspections across people, vehicles, and equipment.

**Core Value:** Never miss a critical renewal. Replace spreadsheets with AI that reads your documents and alerts you before things expire.

**Primary Differentiator:** AI document extraction - upload a certificate, AI reads the expiry date automatically. No manual data entry.

---

## Target Users

### Primary Personas
- **Operations Managers** - Track compliance across teams and sites
- **Site Managers** - Monitor workers and equipment on-site
- **Fleet Managers** - Manage vehicle documentation and renewals

### User Needs
- Know what's expiring before it becomes critical
- Reduce time spent tracking renewals in spreadsheets
- Avoid compliance violations and penalties
- Automate expiry notifications

---

## MVP Feature Set

### 1. Entity Management

**Entities:**
- **People** - Workers, staff, subcontractors
- **Vehicles** - Fleet vehicles, vans, company cars
- **Assets** - Equipment, machinery, tools

**Capabilities:**
- Create, edit, delete entities
- Entity profiles showing documents, status, expiry timeline
- Search and filter
- Teams and sites grouping

**Out of scope:**
- Bulk import (manual only in MVP)
- Custom entity types
- Complex hierarchies
- Mobile apps (web-only)

---

### 2. AI Document Upload

**Supported Types:**
- CSCS Cards, Driving Licenses, MOT Certificates
- Insurance, LOLER, PAT, Gas Safe
- Scaffolding Tickets, other compliance docs

**Upload Flow:**
1. Drag/drop document (PDF, JPG, PNG)
2. AI extracts: type, number, issue date, **expiry date**, issuer, holder
3. User reviews pre-filled form
4. Confirm and save

**Capabilities:**
- Structured JSON extraction (OpenAI GPT-4o-mini Vision)
- Confidence scoring (High/Medium/Low)
- Automatic date normalization
- Entity matching

**Out of scope:**
- Batch upload
- Email forwarding
- Third-party APIs (DVLA, CSCS)

---

### 3. Expiry Tracking & Alerts

**Dashboard:**
- Compliance summary (total entities, critical alerts, warnings)
- Expiry alerts widget (expired, <7 days, 7-30 days, 30-60 days)
- Calendar view (30-day heatmap)

**Alert Categories:**
- **Critical (Red):** Expired or <7 days
- **Warning (Amber):** 7-30 days
- **Info (Blue):** 30-60 days

**Status Calculation:**
- `expired` - Past expiry
- `expiring_soon` - Within 30 days
- `valid` - More than 30 days
- `no_expiry` - Does not expire

**Out of scope:**
- Predictive analytics
- Custom alert thresholds
- SMS notifications (email only)
- Client portals

---

### 4. Email Notifications

**Triggers:**
- 30 / 14 / 7 days before expiry
- On expiry day
- Daily digest (upcoming)
- Weekly digest (next 7 days)

**Template Includes:**
- Document type, number, entity name
- Days until expiry
- Direct link to profile
- Action required

**Out of scope:**
- In-app notification center
- Slack/Teams integrations
- Custom workflows

---

### 5. Document Versioning

**Renewal Flow:**
1. User uploads renewed document
2. AI extracts new expiry
3. Old version archived, new becomes current
4. Notifications stop

**Audit Trail:**
- Full history retained
- Who uploaded, when
- Version comparison

**Out of scope:**
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

**Out of scope:**
- Custom report builder
- Advanced analytics
- Compliance benchmarking
- API access

---

### 7. User Management

**Roles:**
- **Admin** - Full access, manage users, settings
- **Manager** - View all, manage own team
- **User** - View own entities

**Features:**
- Multi-tenant isolation
- Team-based filtering
- Organization settings
- User invites
- Billing (Stripe)

**Out of scope:**
- SSO/SAML
- Fine-grained permissions
- Public audit log viewer

---

## Entity Model

### Person
```
- id, name, email, phone, job_title
- team_id, site_id, status
- documents[]
```

### Vehicle
```
- id, registration, make, model, year
- vehicle_type, assigned_to
- status, documents[]
```

### Asset
```
- id, name, asset_type, serial_number
- location, site_id, status
- documents[]
```

### Document
```
- id, entity_type, entity_id
- document_type, document_number
- issue_date, expiry_date, issuer
- file_url, ai_extracted, ai_confidence
- expiry_status, version_number
- parent_document_id (renewals)
- created_at, created_by
```

---

## User Flows

### Upload Flow
1. Navigate to entity page
2. Click "Upload Document"
3. Drag/drop file
4. AI extraction (2-3s)
5. Review pre-filled form
6. Save
7. Dashboard updates

### Fallback
- AI fails → Manual entry form
- Low confidence → Highlight fields needing review
- Unsupported file → Error with supported types

### Notification Flow
- Daily job runs 6am GMT
- Query documents expiring in 30/14/7 days
- Generate email per user
- Send via SendGrid/Resend
- Log delivery

### Weekly Digest
- Runs Monday 6am GMT
- Summary of this week's expiries
- Grouped by severity
- Action links included

---

## MVP Boundaries

### Included in MVP ✅
- Web app (desktop and mobile browser)
- AI document extraction
- Email notifications
- Basic reporting
- Stripe subscriptions
- UK deployment only

### Deferred to Post-MVP 🚫
- Native mobile apps (iOS/Android)
- Third-party API integrations
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

## Pricing (MVP)

| Plan | Price/mo | Limits |
|------|----------|--------|
| **Starter** | £49 | 50 people, 20 vehicles, 10 assets, 500 docs |
| **Professional** | £99 | 200 people, 100 vehicles, 50 assets, 2000 docs |
| **Business** | £199 | Unlimited entities and documents, priority support |

- 14-day free trial
- No credit card for trial
- Monthly or annual billing
- Cancel anytime

---

## Open Questions

1. **Document retention:** 7 years for archived versions? (Proposal: Yes, for compliance)
2. **AI fallback:** Force manual review when confidence <40%? (Proposal: Allow save with warning)
3. **Notification customization:** Allow custom thresholds? (Proposal: Not in MVP)
4. **Teams hierarchy:** Multi-level or flat? (Proposal: Flat in MVP)
5. **Custom document types:** Unlimited or cap at 50? (Proposal: Unlimited)

---

**Document Owner:** Harvey (Strategy) + Doug (Technical)  
**Approved By:** Benjamin Brown  
**Next Review:** Post-Beta (Week 12)  
**Status:** ✅ Ready for Implementation
