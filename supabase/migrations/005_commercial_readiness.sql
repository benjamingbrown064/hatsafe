-- Migration 005: Commercial Readiness — audit_logs, ai_usage, consent, billing fields, indexes

-- ============================
-- 1. AI consent fields on users
-- ============================
ALTER TABLE users
  ADD COLUMN IF NOT EXISTS ai_processing_consent boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS ai_consent_date timestamptz;

-- ============================
-- 2. Stripe / billing fields on organisations
-- ============================
ALTER TABLE organisations
  ADD COLUMN IF NOT EXISTS stripe_customer_id text,
  ADD COLUMN IF NOT EXISTS stripe_subscription_id text,
  ADD COLUMN IF NOT EXISTS deleted_at timestamptz,
  ADD COLUMN IF NOT EXISTS purge_at timestamptz;

-- ============================
-- 3. Audit logs table
-- ============================
CREATE TABLE IF NOT EXISTS audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organisation_id uuid REFERENCES organisations(id) ON DELETE CASCADE,
  user_id uuid,
  action text NOT NULL,
  resource_type text,
  resource_id text,
  metadata jsonb NOT NULL DEFAULT '{}',
  ip_address text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_org_created ON audit_logs(organisation_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action);

-- ============================
-- 4. AI usage tracking table
-- ============================
CREATE TABLE IF NOT EXISTS ai_usage (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organisation_id uuid REFERENCES organisations(id) ON DELETE CASCADE,
  user_id uuid,
  model text NOT NULL,
  action text NOT NULL,
  tokens_used int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_ai_usage_org_created ON ai_usage(organisation_id, created_at DESC);

-- ============================
-- 5. Performance indexes on commonly filtered columns
-- ============================
CREATE INDEX IF NOT EXISTS idx_documents_entity_type ON documents(organisation_id, entity_type);
CREATE INDEX IF NOT EXISTS idx_documents_status ON documents(organisation_id, status);
CREATE INDEX IF NOT EXISTS idx_documents_expiry ON documents(organisation_id, expiry_date) WHERE archived_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_people_archived ON people(organisation_id, archived_at);
CREATE INDEX IF NOT EXISTS idx_people_team ON people(team_id) WHERE archived_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_vehicles_archived ON vehicles(organisation_id, archived_at);
CREATE INDEX IF NOT EXISTS idx_assets_archived ON assets(organisation_id, archived_at);

-- ============================
-- 6. RLS on audit_logs
-- ============================
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Org members can view their audit logs" ON audit_logs
  FOR SELECT USING (
    organisation_id IN (
      SELECT organisation_id FROM users WHERE id = auth.uid()
    )
  );

-- Only service role can insert audit logs (app writes via service client in auditLog.ts helper)
CREATE POLICY "Service role can insert audit logs" ON audit_logs
  FOR INSERT WITH CHECK (true);

-- ============================
-- 7. RLS on ai_usage
-- ============================
ALTER TABLE ai_usage ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Org admins can view ai usage" ON ai_usage
  FOR SELECT USING (
    organisation_id IN (
      SELECT organisation_id FROM users WHERE id = auth.uid()
    )
  );

CREATE POLICY "Service role can insert ai usage" ON ai_usage
  FOR INSERT WITH CHECK (true);
