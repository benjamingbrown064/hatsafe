-- HatSafe Row Level Security Policies
-- Version: 1.0
-- Created: 2026-03-08
-- Description: Multi-tenant isolation + role-based access control

-- ============================================================================
-- ENABLE RLS ON ALL TABLES
-- ============================================================================

ALTER TABLE organisations ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE sites ENABLE ROW LEVEL SECURITY;
ALTER TABLE people ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_extractions ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- HELPER FUNCTIONS
-- ============================================================================

-- Get current user's organisation_id
CREATE OR REPLACE FUNCTION auth.user_organisation_id()
RETURNS UUID AS $$
    SELECT organisation_id FROM users WHERE id = auth.uid();
$$ LANGUAGE SQL SECURITY DEFINER;

-- Get current user's role
CREATE OR REPLACE FUNCTION auth.user_role()
RETURNS TEXT AS $$
    SELECT role FROM users WHERE id = auth.uid();
$$ LANGUAGE SQL SECURITY DEFINER;

-- Check if current user is admin
CREATE OR REPLACE FUNCTION auth.is_admin()
RETURNS BOOLEAN AS $$
    SELECT role = 'admin' FROM users WHERE id = auth.uid();
$$ LANGUAGE SQL SECURITY DEFINER;

-- Check if current user is manager or admin
CREATE OR REPLACE FUNCTION auth.is_manager_or_admin()
RETURNS BOOLEAN AS $$
    SELECT role IN ('admin', 'manager') FROM users WHERE id = auth.uid();
$$ LANGUAGE SQL SECURITY DEFINER;

-- ============================================================================
-- ORGANISATIONS POLICIES
-- ============================================================================

-- Users can only see their own organisation
CREATE POLICY "Users can view their own organisation"
    ON organisations FOR SELECT
    USING (id = auth.user_organisation_id());

-- Only admins can update their organisation
CREATE POLICY "Admins can update their organisation"
    ON organisations FOR UPDATE
    USING (id = auth.user_organisation_id() AND auth.is_admin());

-- New organisations can be created during signup (handled by auth flow)
-- No INSERT policy here - creation handled by server-side code

-- ============================================================================
-- USERS POLICIES
-- ============================================================================

-- Users can view other users in their organisation
CREATE POLICY "Users can view users in their organisation"
    ON users FOR SELECT
    USING (organisation_id = auth.user_organisation_id());

-- Users can update their own profile
CREATE POLICY "Users can update their own profile"
    ON users FOR UPDATE
    USING (id = auth.uid());

-- Admins can manage all users in their organisation
CREATE POLICY "Admins can insert users in their organisation"
    ON users FOR INSERT
    WITH CHECK (organisation_id = auth.user_organisation_id() AND auth.is_admin());

CREATE POLICY "Admins can update users in their organisation"
    ON users FOR UPDATE
    USING (organisation_id = auth.user_organisation_id() AND auth.is_admin());

CREATE POLICY "Admins can delete users in their organisation"
    ON users FOR DELETE
    USING (organisation_id = auth.user_organisation_id() AND auth.is_admin());

-- ============================================================================
-- TEAMS POLICIES
-- ============================================================================

CREATE POLICY "Users can view teams in their organisation"
    ON teams FOR SELECT
    USING (organisation_id = auth.user_organisation_id());

CREATE POLICY "Managers and admins can manage teams"
    ON teams FOR ALL
    USING (organisation_id = auth.user_organisation_id() AND auth.is_manager_or_admin());

-- ============================================================================
-- SITES POLICIES
-- ============================================================================

CREATE POLICY "Users can view sites in their organisation"
    ON sites FOR SELECT
    USING (organisation_id = auth.user_organisation_id());

CREATE POLICY "Managers and admins can manage sites"
    ON sites FOR ALL
    USING (organisation_id = auth.user_organisation_id() AND auth.is_manager_or_admin());

-- ============================================================================
-- PEOPLE POLICIES
-- ============================================================================

CREATE POLICY "Users can view people in their organisation"
    ON people FOR SELECT
    USING (organisation_id = auth.user_organisation_id());

CREATE POLICY "Contributors can insert people"
    ON people FOR INSERT
    WITH CHECK (organisation_id = auth.user_organisation_id() AND auth.user_role() IN ('admin', 'manager', 'contributor'));

CREATE POLICY "Managers and admins can update people"
    ON people FOR UPDATE
    USING (organisation_id = auth.user_organisation_id() AND auth.is_manager_or_admin());

CREATE POLICY "Admins can delete people"
    ON people FOR DELETE
    USING (organisation_id = auth.user_organisation_id() AND auth.is_admin());

-- ============================================================================
-- VEHICLES POLICIES
-- ============================================================================

CREATE POLICY "Users can view vehicles in their organisation"
    ON vehicles FOR SELECT
    USING (organisation_id = auth.user_organisation_id());

CREATE POLICY "Contributors can insert vehicles"
    ON vehicles FOR INSERT
    WITH CHECK (organisation_id = auth.user_organisation_id() AND auth.user_role() IN ('admin', 'manager', 'contributor'));

CREATE POLICY "Managers and admins can update vehicles"
    ON vehicles FOR UPDATE
    USING (organisation_id = auth.user_organisation_id() AND auth.is_manager_or_admin());

CREATE POLICY "Admins can delete vehicles"
    ON vehicles FOR DELETE
    USING (organisation_id = auth.user_organisation_id() AND auth.is_admin());

-- ============================================================================
-- ASSETS POLICIES
-- ============================================================================

CREATE POLICY "Users can view assets in their organisation"
    ON assets FOR SELECT
    USING (organisation_id = auth.user_organisation_id());

CREATE POLICY "Contributors can insert assets"
    ON assets FOR INSERT
    WITH CHECK (organisation_id = auth.user_organisation_id() AND auth.user_role() IN ('admin', 'manager', 'contributor'));

CREATE POLICY "Managers and admins can update assets"
    ON assets FOR UPDATE
    USING (organisation_id = auth.user_organisation_id() AND auth.is_manager_or_admin());

CREATE POLICY "Admins can delete assets"
    ON assets FOR DELETE
    USING (organisation_id = auth.user_organisation_id() AND auth.is_admin());

-- ============================================================================
-- SUPPLIERS POLICIES
-- ============================================================================

CREATE POLICY "Users can view suppliers in their organisation"
    ON suppliers FOR SELECT
    USING (organisation_id = auth.user_organisation_id());

CREATE POLICY "Contributors can insert suppliers"
    ON suppliers FOR INSERT
    WITH CHECK (organisation_id = auth.user_organisation_id() AND auth.user_role() IN ('admin', 'manager', 'contributor'));

CREATE POLICY "Managers and admins can update suppliers"
    ON suppliers FOR UPDATE
    USING (organisation_id = auth.user_organisation_id() AND auth.is_manager_or_admin());

CREATE POLICY "Admins can delete suppliers"
    ON suppliers FOR DELETE
    USING (organisation_id = auth.user_organisation_id() AND auth.is_admin());

-- ============================================================================
-- DOCUMENT TYPES POLICIES
-- ============================================================================

CREATE POLICY "Users can view document types in their organisation"
    ON document_types FOR SELECT
    USING (organisation_id = auth.user_organisation_id() OR organisation_id IS NULL);

CREATE POLICY "Admins can manage document types"
    ON document_types FOR ALL
    USING (organisation_id = auth.user_organisation_id() AND auth.is_admin());

-- ============================================================================
-- DOCUMENTS POLICIES
-- ============================================================================

CREATE POLICY "Users can view documents in their organisation"
    ON documents FOR SELECT
    USING (organisation_id = auth.user_organisation_id());

CREATE POLICY "Contributors can insert documents"
    ON documents FOR INSERT
    WITH CHECK (organisation_id = auth.user_organisation_id() AND auth.user_role() IN ('admin', 'manager', 'contributor'));

CREATE POLICY "Contributors can update documents"
    ON documents FOR UPDATE
    USING (organisation_id = auth.user_organisation_id() AND auth.user_role() IN ('admin', 'manager', 'contributor'));

CREATE POLICY "Admins can delete documents"
    ON documents FOR DELETE
    USING (organisation_id = auth.user_organisation_id() AND auth.is_admin());

-- ============================================================================
-- DOCUMENT VERSIONS POLICIES
-- ============================================================================

CREATE POLICY "Users can view document versions in their organisation"
    ON document_versions FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM documents 
            WHERE documents.id = document_versions.document_id 
            AND documents.organisation_id = auth.user_organisation_id()
        )
    );

CREATE POLICY "Contributors can insert document versions"
    ON document_versions FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM documents 
            WHERE documents.id = document_versions.document_id 
            AND documents.organisation_id = auth.user_organisation_id()
        )
        AND auth.user_role() IN ('admin', 'manager', 'contributor')
    );

-- ============================================================================
-- DOCUMENT EXTRACTIONS POLICIES
-- ============================================================================

CREATE POLICY "Managers and admins can view document extractions"
    ON document_extractions FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM document_versions
            JOIN documents ON documents.id = document_versions.document_id
            WHERE document_versions.id = document_extractions.document_version_id
            AND documents.organisation_id = auth.user_organisation_id()
        )
        AND auth.is_manager_or_admin()
    );

-- Server-side code can insert extractions (no user-facing INSERT policy)

-- ============================================================================
-- NOTIFICATIONS POLICIES
-- ============================================================================

-- Users can only see their own notifications
CREATE POLICY "Users can view their own notifications"
    ON notifications FOR SELECT
    USING (recipient_id = auth.uid());

-- Users can mark their own notifications as read
CREATE POLICY "Users can update their own notifications"
    ON notifications FOR UPDATE
    USING (recipient_id = auth.uid());

-- Server-side code creates notifications (no user INSERT policy)

-- ============================================================================
-- NOTIFICATION LOGS POLICIES
-- ============================================================================

-- Admins can view notification logs for their organisation
CREATE POLICY "Admins can view notification logs"
    ON notification_logs FOR SELECT
    USING (organisation_id = auth.user_organisation_id() AND auth.is_admin());

-- ============================================================================
-- AUDIT LOGS POLICIES
-- ============================================================================

-- Admins can view audit logs for their organisation (read-only)
CREATE POLICY "Admins can view audit logs"
    ON audit_logs FOR SELECT
    USING (organisation_id = auth.user_organisation_id() AND auth.is_admin());

-- Audit logs are append-only (INSERT handled by triggers, no UPDATE/DELETE)

-- ============================================================================
-- STORAGE POLICIES (Supabase Storage)
-- ============================================================================

-- Note: Storage policies are configured in Supabase dashboard or via SQL
-- Example storage policy for documents bucket:

-- CREATE POLICY "Users can upload documents to their org folder"
--     ON storage.objects FOR INSERT
--     WITH CHECK (
--         bucket_id = 'documents' AND
--         auth.uid() IS NOT NULL AND
--         (storage.foldername(name))[1] = auth.user_organisation_id()::text
--     );

-- CREATE POLICY "Users can view documents in their org folder"
--     ON storage.objects FOR SELECT
--     USING (
--         bucket_id = 'documents' AND
--         auth.uid() IS NOT NULL AND
--         (storage.foldername(name))[1] = auth.user_organisation_id()::text
--     );

-- ============================================================================
-- SECURITY NOTES
-- ============================================================================

-- 1. All tables scoped by organisation_id (multi-tenant isolation)
-- 2. Role hierarchy: viewer < contributor < manager < admin
-- 3. Soft delete used (archived_at) instead of hard delete
-- 4. Audit logs are append-only (no updates/deletes)
-- 5. Document files stored in Supabase Storage with signed URLs
-- 6. RLS policies enforce at database level (defense in depth)
-- 7. Service role key bypasses RLS (use carefully in server-side code)

-- End of RLS policies
