-- Fix: infinite recursion in RLS policies
-- Create a security definer function to look up the current user's org_id and role
-- bypassing RLS (runs as the function owner, not the calling user)

CREATE OR REPLACE FUNCTION get_my_organisation_id()
RETURNS UUID
LANGUAGE SQL
SECURITY DEFINER
STABLE
AS $$
  SELECT organisation_id FROM users WHERE id = auth.uid() LIMIT 1
$$;

CREATE OR REPLACE FUNCTION get_my_role()
RETURNS TEXT
LANGUAGE SQL
SECURITY DEFINER
STABLE
AS $$
  SELECT role FROM users WHERE id = auth.uid() LIMIT 1
$$;

-- Fix the users table policy (was self-referential)
DROP POLICY IF EXISTS "Users can view users in their organisation" ON users;
CREATE POLICY "Users can view users in their organisation"
    ON users FOR SELECT
    USING (organisation_id = get_my_organisation_id());

DROP POLICY IF EXISTS "Users can update their own profile" ON users;
CREATE POLICY "Users can update their own profile"
    ON users FOR UPDATE
    USING (id = auth.uid());

-- Fix organisations policies
DROP POLICY IF EXISTS "Users can view their own organisation" ON organisations;
CREATE POLICY "Users can view their own organisation"
    ON organisations FOR SELECT
    USING (id = get_my_organisation_id());

DROP POLICY IF EXISTS "Admins can update their organisation" ON organisations;
CREATE POLICY "Admins can update their organisation"
    ON organisations FOR UPDATE
    USING (id = get_my_organisation_id() AND get_my_role() = 'admin');

-- Fix teams policies
DROP POLICY IF EXISTS "Users can view teams in their organisation" ON teams;
CREATE POLICY "Users can view teams in their organisation"
    ON teams FOR SELECT
    USING (organisation_id = get_my_organisation_id());

DROP POLICY IF EXISTS "Managers can manage teams" ON teams;
CREATE POLICY "Managers can manage teams"
    ON teams FOR ALL
    USING (organisation_id = get_my_organisation_id() AND get_my_role() IN ('admin', 'manager'));

-- Fix sites policies
DROP POLICY IF EXISTS "Users can view sites in their organisation" ON sites;
CREATE POLICY "Users can view sites in their organisation"
    ON sites FOR SELECT
    USING (organisation_id = get_my_organisation_id());

DROP POLICY IF EXISTS "Managers can manage sites" ON sites;
CREATE POLICY "Managers can manage sites"
    ON sites FOR ALL
    USING (organisation_id = get_my_organisation_id() AND get_my_role() IN ('admin', 'manager'));

-- Fix people policies
DROP POLICY IF EXISTS "Users can view people in their organisation" ON people;
CREATE POLICY "Users can view people in their organisation"
    ON people FOR SELECT
    USING (organisation_id = get_my_organisation_id());

DROP POLICY IF EXISTS "Managers can manage people" ON people;
DROP POLICY IF EXISTS "Contributors can manage people" ON people;
CREATE POLICY "Contributors can manage people"
    ON people FOR ALL
    USING (organisation_id = get_my_organisation_id() AND get_my_role() IN ('admin', 'manager', 'contributor'));

-- Fix vehicles policies
DROP POLICY IF EXISTS "Users can view vehicles in their organisation" ON vehicles;
CREATE POLICY "Users can view vehicles in their organisation"
    ON vehicles FOR SELECT
    USING (organisation_id = get_my_organisation_id());

DROP POLICY IF EXISTS "Contributors can manage vehicles" ON vehicles;
CREATE POLICY "Contributors can manage vehicles"
    ON vehicles FOR ALL
    USING (organisation_id = get_my_organisation_id() AND get_my_role() IN ('admin', 'manager', 'contributor'));

-- Fix assets policies
DROP POLICY IF EXISTS "Users can view assets in their organisation" ON assets;
CREATE POLICY "Users can view assets in their organisation"
    ON assets FOR SELECT
    USING (organisation_id = get_my_organisation_id());

DROP POLICY IF EXISTS "Contributors can manage assets" ON assets;
CREATE POLICY "Contributors can manage assets"
    ON assets FOR ALL
    USING (organisation_id = get_my_organisation_id() AND get_my_role() IN ('admin', 'manager', 'contributor'));

-- Fix suppliers policies
DROP POLICY IF EXISTS "Users can view suppliers in their organisation" ON suppliers;
CREATE POLICY "Users can view suppliers in their organisation"
    ON suppliers FOR SELECT
    USING (organisation_id = get_my_organisation_id());

DROP POLICY IF EXISTS "Contributors can manage suppliers" ON suppliers;
CREATE POLICY "Contributors can manage suppliers"
    ON suppliers FOR ALL
    USING (organisation_id = get_my_organisation_id() AND get_my_role() IN ('admin', 'manager', 'contributor'));

-- Fix document_types policies
DROP POLICY IF EXISTS "Users can view document types in their organisation" ON document_types;
CREATE POLICY "Users can view document types in their organisation"
    ON document_types FOR SELECT
    USING (organisation_id IS NULL OR organisation_id = get_my_organisation_id());

DROP POLICY IF EXISTS "Managers can manage document types" ON document_types;
CREATE POLICY "Managers can manage document types"
    ON document_types FOR ALL
    USING (organisation_id = get_my_organisation_id() AND get_my_role() IN ('admin', 'manager'));

-- Fix documents policies
DROP POLICY IF EXISTS "Users can view documents in their organisation" ON documents;
CREATE POLICY "Users can view documents in their organisation"
    ON documents FOR SELECT
    USING (organisation_id = get_my_organisation_id());

DROP POLICY IF EXISTS "Contributors can insert documents" ON documents;
CREATE POLICY "Contributors can insert documents"
    ON documents FOR INSERT
    WITH CHECK (organisation_id = get_my_organisation_id() AND get_my_role() IN ('admin', 'manager', 'contributor'));

DROP POLICY IF EXISTS "Contributors can update documents" ON documents;
CREATE POLICY "Contributors can update documents"
    ON documents FOR UPDATE
    USING (organisation_id = get_my_organisation_id() AND get_my_role() IN ('admin', 'manager', 'contributor'));

DROP POLICY IF EXISTS "Admins can delete documents" ON documents;
CREATE POLICY "Admins can delete documents"
    ON documents FOR DELETE
    USING (organisation_id = get_my_organisation_id() AND get_my_role() = 'admin');

-- Fix notifications policies
DROP POLICY IF EXISTS "Users can view their own notifications" ON notifications;
CREATE POLICY "Users can view their own notifications"
    ON notifications FOR SELECT
    USING (organisation_id = get_my_organisation_id());

-- Fix audit_logs policies
DROP POLICY IF EXISTS "Admins and managers can view audit logs" ON audit_logs;
CREATE POLICY "Admins and managers can view audit logs"
    ON audit_logs FOR SELECT
    USING (organisation_id = get_my_organisation_id() AND get_my_role() IN ('admin', 'manager'));
