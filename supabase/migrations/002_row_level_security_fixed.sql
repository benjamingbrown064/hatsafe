-- HatSafe Row Level Security Policies
-- Version: 1.1 (Fixed for Supabase permissions)
-- Created: 2026-03-08

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
-- ORGANISATIONS POLICIES
-- ============================================================================

-- Users can only see their own organisation
CREATE POLICY "Users can view their own organisation"
    ON organisations FOR SELECT
    USING (
        id IN (SELECT organisation_id FROM users WHERE id = auth.uid())
    );

-- Only admins can update their organisation
CREATE POLICY "Admins can update their organisation"
    ON organisations FOR UPDATE
    USING (
        id IN (SELECT organisation_id FROM users WHERE id = auth.uid() AND role = 'admin')
    );

-- ============================================================================
-- USERS POLICIES
-- ============================================================================

-- Users can view other users in their organisation
CREATE POLICY "Users can view users in their organisation"
    ON users FOR SELECT
    USING (
        organisation_id IN (SELECT organisation_id FROM users WHERE id = auth.uid())
    );

-- Users can update their own profile
CREATE POLICY "Users can update their own profile"
    ON users FOR UPDATE
    USING (id = auth.uid());

-- Admins can manage all users in their organisation
CREATE POLICY "Admins can insert users in their organisation"
    ON users FOR INSERT
    WITH CHECK (
        organisation_id IN (SELECT organisation_id FROM users WHERE id = auth.uid() AND role = 'admin')
    );

CREATE POLICY "Admins can update users in their organisation"
    ON users FOR UPDATE
    USING (
        organisation_id IN (SELECT organisation_id FROM users WHERE id = auth.uid() AND role = 'admin')
    );

CREATE POLICY "Admins can delete users in their organisation"
    ON users FOR DELETE
    USING (
        organisation_id IN (SELECT organisation_id FROM users WHERE id = auth.uid() AND role = 'admin')
    );

-- ============================================================================
-- TEAMS POLICIES
-- ============================================================================

CREATE POLICY "Users can view teams in their organisation"
    ON teams FOR SELECT
    USING (
        organisation_id IN (SELECT organisation_id FROM users WHERE id = auth.uid())
    );

CREATE POLICY "Managers and admins can manage teams"
    ON teams FOR ALL
    USING (
        organisation_id IN (
            SELECT organisation_id FROM users 
            WHERE id = auth.uid() AND role IN ('admin', 'manager')
        )
    );

-- ============================================================================
-- SITES POLICIES
-- ============================================================================

CREATE POLICY "Users can view sites in their organisation"
    ON sites FOR SELECT
    USING (
        organisation_id IN (SELECT organisation_id FROM users WHERE id = auth.uid())
    );

CREATE POLICY "Managers and admins can manage sites"
    ON sites FOR ALL
    USING (
        organisation_id IN (
            SELECT organisation_id FROM users 
            WHERE id = auth.uid() AND role IN ('admin', 'manager')
        )
    );

-- ============================================================================
-- PEOPLE POLICIES
-- ============================================================================

CREATE POLICY "Users can view people in their organisation"
    ON people FOR SELECT
    USING (
        organisation_id IN (SELECT organisation_id FROM users WHERE id = auth.uid())
    );

CREATE POLICY "Contributors can insert people"
    ON people FOR INSERT
    WITH CHECK (
        organisation_id IN (
            SELECT organisation_id FROM users 
            WHERE id = auth.uid() AND role IN ('admin', 'manager', 'contributor')
        )
    );

CREATE POLICY "Managers and admins can update people"
    ON people FOR UPDATE
    USING (
        organisation_id IN (
            SELECT organisation_id FROM users 
            WHERE id = auth.uid() AND role IN ('admin', 'manager')
        )
    );

CREATE POLICY "Admins can delete people"
    ON people FOR DELETE
    USING (
        organisation_id IN (SELECT organisation_id FROM users WHERE id = auth.uid() AND role = 'admin')
    );

-- ============================================================================
-- VEHICLES POLICIES
-- ============================================================================

CREATE POLICY "Users can view vehicles in their organisation"
    ON vehicles FOR SELECT
    USING (
        organisation_id IN (SELECT organisation_id FROM users WHERE id = auth.uid())
    );

CREATE POLICY "Contributors can insert vehicles"
    ON vehicles FOR INSERT
    WITH CHECK (
        organisation_id IN (
            SELECT organisation_id FROM users 
            WHERE id = auth.uid() AND role IN ('admin', 'manager', 'contributor')
        )
    );

CREATE POLICY "Managers and admins can update vehicles"
    ON vehicles FOR UPDATE
    USING (
        organisation_id IN (
            SELECT organisation_id FROM users 
            WHERE id = auth.uid() AND role IN ('admin', 'manager')
        )
    );

CREATE POLICY "Admins can delete vehicles"
    ON vehicles FOR DELETE
    USING (
        organisation_id IN (SELECT organisation_id FROM users WHERE id = auth.uid() AND role = 'admin')
    );

-- ============================================================================
-- ASSETS POLICIES
-- ============================================================================

CREATE POLICY "Users can view assets in their organisation"
    ON assets FOR SELECT
    USING (
        organisation_id IN (SELECT organisation_id FROM users WHERE id = auth.uid())
    );

CREATE POLICY "Contributors can insert assets"
    ON assets FOR INSERT
    WITH CHECK (
        organisation_id IN (
            SELECT organisation_id FROM users 
            WHERE id = auth.uid() AND role IN ('admin', 'manager', 'contributor')
        )
    );

CREATE POLICY "Managers and admins can update assets"
    ON assets FOR UPDATE
    USING (
        organisation_id IN (
            SELECT organisation_id FROM users 
            WHERE id = auth.uid() AND role IN ('admin', 'manager')
        )
    );

CREATE POLICY "Admins can delete assets"
    ON assets FOR DELETE
    USING (
        organisation_id IN (SELECT organisation_id FROM users WHERE id = auth.uid() AND role = 'admin')
    );

-- ============================================================================
-- SUPPLIERS POLICIES
-- ============================================================================

CREATE POLICY "Users can view suppliers in their organisation"
    ON suppliers FOR SELECT
    USING (
        organisation_id IN (SELECT organisation_id FROM users WHERE id = auth.uid())
    );

CREATE POLICY "Contributors can insert suppliers"
    ON suppliers FOR INSERT
    WITH CHECK (
        organisation_id IN (
            SELECT organisation_id FROM users 
            WHERE id = auth.uid() AND role IN ('admin', 'manager', 'contributor')
        )
    );

CREATE POLICY "Managers and admins can update suppliers"
    ON suppliers FOR UPDATE
    USING (
        organisation_id IN (
            SELECT organisation_id FROM users 
            WHERE id = auth.uid() AND role IN ('admin', 'manager')
        )
    );

CREATE POLICY "Admins can delete suppliers"
    ON suppliers FOR DELETE
    USING (
        organisation_id IN (SELECT organisation_id FROM users WHERE id = auth.uid() AND role = 'admin')
    );

-- ============================================================================
-- DOCUMENT TYPES POLICIES
-- ============================================================================

CREATE POLICY "Users can view document types in their organisation"
    ON document_types FOR SELECT
    USING (
        organisation_id IN (SELECT organisation_id FROM users WHERE id = auth.uid())
        OR organisation_id IS NULL
    );

CREATE POLICY "Admins can manage document types"
    ON document_types FOR ALL
    USING (
        organisation_id IN (SELECT organisation_id FROM users WHERE id = auth.uid() AND role = 'admin')
    );

-- ============================================================================
-- DOCUMENTS POLICIES
-- ============================================================================

CREATE POLICY "Users can view documents in their organisation"
    ON documents FOR SELECT
    USING (
        organisation_id IN (SELECT organisation_id FROM users WHERE id = auth.uid())
    );

CREATE POLICY "Contributors can insert documents"
    ON documents FOR INSERT
    WITH CHECK (
        organisation_id IN (
            SELECT organisation_id FROM users 
            WHERE id = auth.uid() AND role IN ('admin', 'manager', 'contributor')
        )
    );

CREATE POLICY "Contributors can update documents"
    ON documents FOR UPDATE
    USING (
        organisation_id IN (
            SELECT organisation_id FROM users 
            WHERE id = auth.uid() AND role IN ('admin', 'manager', 'contributor')
        )
    );

CREATE POLICY "Admins can delete documents"
    ON documents FOR DELETE
    USING (
        organisation_id IN (SELECT organisation_id FROM users WHERE id = auth.uid() AND role = 'admin')
    );

-- ============================================================================
-- DOCUMENT VERSIONS POLICIES
-- ============================================================================

CREATE POLICY "Users can view document versions in their organisation"
    ON document_versions FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM documents 
            WHERE documents.id = document_versions.document_id 
            AND documents.organisation_id IN (SELECT organisation_id FROM users WHERE id = auth.uid())
        )
    );

CREATE POLICY "Contributors can insert document versions"
    ON document_versions FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM documents 
            JOIN users ON users.id = auth.uid()
            WHERE documents.id = document_versions.document_id 
            AND documents.organisation_id = users.organisation_id
            AND users.role IN ('admin', 'manager', 'contributor')
        )
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
            JOIN users ON users.id = auth.uid()
            WHERE document_versions.id = document_extractions.document_version_id
            AND documents.organisation_id = users.organisation_id
            AND users.role IN ('admin', 'manager')
        )
    );

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

-- ============================================================================
-- NOTIFICATION LOGS POLICIES
-- ============================================================================

-- Admins can view notification logs for their organisation
CREATE POLICY "Admins can view notification logs"
    ON notification_logs FOR SELECT
    USING (
        organisation_id IN (SELECT organisation_id FROM users WHERE id = auth.uid() AND role = 'admin')
    );

-- ============================================================================
-- AUDIT LOGS POLICIES
-- ============================================================================

-- Admins can view audit logs for their organisation (read-only)
CREATE POLICY "Admins can view audit logs"
    ON audit_logs FOR SELECT
    USING (
        organisation_id IN (SELECT organisation_id FROM users WHERE id = auth.uid() AND role = 'admin')
    );

-- End of RLS policies
