# HatSafe — Disaster Recovery Procedures

## Overview

| Metric | Target |
|--------|--------|
| Recovery Time Objective (RTO) | < 4 hours |
| Recovery Point Objective (RPO) | < 24 hours |
| Backup frequency | Daily (Supabase automated) |
| Backup retention | 30 days |

---

## Backup Strategy

### Database (Supabase)
- Enable automated daily backups in Supabase Dashboard → Settings → Database → Backups
- **Requires Supabase Pro plan or higher**
- Backups are stored in Supabase's secure infrastructure
- Point-in-time recovery available on Pro plans

### File Storage (Supabase Storage)
- Documents uploaded by users are stored in Supabase Storage buckets
- Storage is replicated within the Supabase project
- For critical files, configure external backup via rclone to S3 or similar

---

## Restore Procedures

### Database Restore
1. Log in to Supabase Dashboard
2. Navigate to Settings → Database → Backups
3. Select the desired backup point
4. Click "Restore" — this will overwrite the current database
5. After restore, run `npx prisma migrate deploy` if any migrations need re-applying
6. Verify application connectivity and run a smoke test

### Full Environment Rebuild (worst case)
1. Create new Supabase project
2. Apply all migrations: `psql $DATABASE_URL < supabase/migrations/*.sql`
3. Update environment variables in Vercel
4. Deploy from main branch
5. Restore database from backup
6. Re-upload any files that were lost (from storage backup)

---

## Incident Runbooks

### Database Down
1. Check Supabase Status: https://status.supabase.com
2. If Supabase outage: wait for recovery, no action needed
3. If project-specific issue: check Supabase Dashboard logs
4. Enable read-only mode if needed by setting a `MAINTENANCE_MODE=true` env var
5. ETA: typically resolves within 30 minutes; if > 1 hour, consider failover

### Auth Outage (Supabase Auth)
1. All logins will fail
2. Check Supabase status page
3. Users with active sessions will not be affected until token expiry
4. If extended: consider temporary bypass with service role (emergency only)

### OpenAI Outage
1. AI extraction will fail with 500 errors
2. Document upload and manual data entry will continue to work
3. Check OpenAI status: https://status.openai.com
4. No data loss — documents are uploaded separately from extraction
5. Users can retry extraction once service is restored

### Stripe Failure
1. New subscriptions and payments will fail
2. Existing subscribers will retain access during outage
3. Check Stripe status: https://status.stripe.com
4. No refunds needed for outage periods

### Full Application Down (Vercel)
1. Check Vercel status: https://vercel-status.com
2. Check recent deployment logs for errors
3. Roll back deployment: `vercel rollback` in CLI
4. If DNS issue: check domain configuration in Vercel dashboard

---

## Emergency Contacts

| Role | Contact |
|------|---------|
| Technical Lead | Benjamin Brown — via Telegram |
| Supabase Support | support.supabase.com (Pro plan ticket) |
| Vercel Support | vercel.com/support |

---

## Testing

The restore procedure should be tested at least once before each major release and quarterly thereafter. Testing should be done on the staging environment, not production.

Last tested: *(not yet tested — complete before first production launch)*
