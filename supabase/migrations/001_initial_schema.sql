-- HatSafe Initial Database Schema
-- Version: 1.0
-- Created: 2026-03-08
-- Description: Core tables for compliance document management

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- CORE TABLES
-- ============================================================================

-- Organizations (multi-tenant isolation)
CREATE TABLE organisations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    subdomain TEXT UNIQUE,
    settings JSONB DEFAULT '{}',
    stripe_customer_id TEXT,
    subscription_status TEXT DEFAULT 'trial', -- trial, active, past_due, canceled
    subscription_tier TEXT DEFAULT 'starter', -- starter, professional, business
    trial_ends_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Users (authentication and role management)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organisation_id UUID NOT NULL REFERENCES organisations(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'viewer', -- admin, manager, contributor, viewer
    team_id UUID, -- References teams(id), added after teams table created
    avatar_url TEXT,
    settings JSONB DEFAULT '{}',
    last_login_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Teams (organizational structure)
CREATE TABLE teams (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organisation_id UUID NOT NULL REFERENCES organisations(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    manager_id UUID REFERENCES users(id) ON DELETE SET NULL,
    site_id UUID, -- References sites(id), added after sites table created
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add team_id foreign key to users (now that teams exists)
ALTER TABLE users ADD CONSTRAINT fk_users_team 
    FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE SET NULL;

-- Sites (job sites, locations)
CREATE TABLE sites (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organisation_id UUID NOT NULL REFERENCES organisations(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    client TEXT,
    address TEXT,
    postcode TEXT,
    site_manager_id UUID REFERENCES users(id) ON DELETE SET NULL,
    metadata JSONB DEFAULT '{}',
    archived_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add site_id foreign key to teams (now that sites exists)
ALTER TABLE teams ADD CONSTRAINT fk_teams_site 
    FOREIGN KEY (site_id) REFERENCES sites(id) ON DELETE SET NULL;

-- ============================================================================
-- ENTITY TABLES (People, Vehicles, Assets, Suppliers)
-- ============================================================================

-- People (workers, staff, subcontractors)
CREATE TABLE people (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organisation_id UUID NOT NULL REFERENCES organisations(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    role TEXT, -- Job role (e.g., Carpenter, Electrician)
    team_id UUID REFERENCES teams(id) ON DELETE SET NULL,
    site_id UUID REFERENCES sites(id) ON DELETE SET NULL,
    manager_id UUID REFERENCES users(id) ON DELETE SET NULL,
    employment_status TEXT DEFAULT 'active', -- active, inactive, contractor
    contact_email TEXT,
    contact_phone TEXT,
    photo_url TEXT,
    metadata JSONB DEFAULT '{}',
    archived_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Vehicles (fleet management)
CREATE TABLE vehicles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organisation_id UUID NOT NULL REFERENCES organisations(id) ON DELETE CASCADE,
    registration TEXT NOT NULL,
    make TEXT,
    model TEXT,
    vehicle_type TEXT, -- van, truck, car, plant
    owner TEXT,
    depot_site_id UUID REFERENCES sites(id) ON DELETE SET NULL,
    metadata JSONB DEFAULT '{}',
    archived_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Assets (equipment, machinery, tools)
CREATE TABLE assets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organisation_id UUID NOT NULL REFERENCES organisations(id) ON DELETE CASCADE,
    asset_id TEXT NOT NULL, -- Internal asset number (e.g., "TOOL-001")
    name TEXT NOT NULL,
    type TEXT, -- ladder, scaffold, compressor, etc.
    location TEXT,
    site_id UUID REFERENCES sites(id) ON DELETE SET NULL,
    owner_id UUID REFERENCES users(id) ON DELETE SET NULL,
    metadata JSONB DEFAULT '{}',
    archived_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Suppliers (third-party vendors, subcontractors)
CREATE TABLE suppliers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organisation_id UUID NOT NULL REFERENCES organisations(id) ON DELETE CASCADE,
    company_name TEXT NOT NULL,
    contact_name TEXT,
    contact_email TEXT,
    contact_phone TEXT,
    category TEXT, -- subcontractor, equipment_hire, materials, etc.
    owner_id UUID REFERENCES users(id) ON DELETE SET NULL,
    metadata JSONB DEFAULT '{}',
    archived_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- DOCUMENT MANAGEMENT
-- ============================================================================

-- Document Types (configurable certificate/license types)
CREATE TABLE document_types (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organisation_id UUID REFERENCES organisations(id) ON DELETE CASCADE,
    name TEXT NOT NULL, -- CSCS, MOT, LOLER, Insurance, etc.
    category TEXT, -- certification, inspection, insurance, license
    entity_types TEXT[] DEFAULT '{}', -- ["people", "vehicles", "assets"]
    is_renewable BOOLEAN DEFAULT true,
    default_lead_times INTEGER[] DEFAULT '{30, 14, 7}', -- Days before expiry to alert
    required_fields TEXT[] DEFAULT '{}', -- ["certificate_number", "issue_date", "expiry_date"]
    settings JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(organisation_id, name)
);

-- Documents (main document records)
CREATE TABLE documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organisation_id UUID NOT NULL REFERENCES organisations(id) ON DELETE CASCADE,
    entity_type TEXT NOT NULL, -- person, vehicle, asset, site, supplier
    entity_id UUID NOT NULL, -- Polymorphic reference to entity
    document_type_id UUID REFERENCES document_types(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    issuer TEXT,
    certificate_number TEXT,
    issue_date DATE,
    expiry_date DATE,
    status TEXT NOT NULL DEFAULT 'pending_review', -- pending_review, valid, expiring_soon, expired, superseded, rejected
    current_version_id UUID, -- Points to latest document_versions record
    review_status TEXT DEFAULT 'pending', -- pending, approved, rejected
    confidence_score NUMERIC(3,2), -- 0.00 to 1.00
    metadata JSONB DEFAULT '{}',
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Document Versions (full history of file uploads)
CREATE TABLE document_versions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    document_id UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
    version_number INTEGER NOT NULL DEFAULT 1,
    file_path TEXT NOT NULL, -- Supabase storage path
    file_name TEXT NOT NULL,
    file_size INTEGER,
    mime_type TEXT,
    extraction_data JSONB DEFAULT '{}', -- Stores AI extraction results
    uploaded_by UUID REFERENCES users(id) ON DELETE SET NULL,
    uploaded_at TIMESTAMPTZ DEFAULT NOW(),
    superseded_at TIMESTAMPTZ, -- When this version was replaced
    UNIQUE(document_id, version_number)
);

-- Document Extractions (AI processing audit log)
CREATE TABLE document_extractions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    document_version_id UUID NOT NULL REFERENCES document_versions(id) ON DELETE CASCADE,
    raw_text TEXT, -- OCR output
    extracted_fields JSONB DEFAULT '{}', -- Structured field extraction
    confidence_scores JSONB DEFAULT '{}', -- Per-field confidence
    suggested_entity_id UUID,
    suggested_entity_type TEXT,
    processing_status TEXT DEFAULT 'processing', -- processing, completed, failed
    processing_time_ms INTEGER,
    model_used TEXT, -- e.g., "claude-3-sonnet-20240229"
    error_message TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- NOTIFICATIONS
-- ============================================================================

-- Notifications (individual notification records)
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organisation_id UUID NOT NULL REFERENCES organisations(id) ON DELETE CASCADE,
    document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
    recipient_id UUID REFERENCES users(id) ON DELETE CASCADE,
    notification_type TEXT NOT NULL, -- expiry_30d, expiry_14d, expiry_7d, expired, overdue_7d
    channel TEXT DEFAULT 'email', -- email, in_app
    status TEXT DEFAULT 'pending', -- pending, sent, failed
    sent_at TIMESTAMPTZ,
    read_at TIMESTAMPTZ,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Notification Logs (digest email tracking)
CREATE TABLE notification_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organisation_id UUID NOT NULL REFERENCES organisations(id) ON DELETE CASCADE,
    digest_type TEXT NOT NULL, -- daily_urgent, weekly_upcoming
    recipient_id UUID REFERENCES users(id) ON DELETE CASCADE,
    documents_included JSONB DEFAULT '[]', -- Array of document IDs
    sent_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- AUDIT TRAIL
-- ============================================================================

-- Audit Logs (immutable audit trail)
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organisation_id UUID NOT NULL REFERENCES organisations(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    entity_type TEXT NOT NULL, -- document, person, vehicle, etc.
    entity_id UUID,
    action TEXT NOT NULL, -- created, updated, deleted, approved, rejected, downloaded
    changes JSONB DEFAULT '{}', -- Before/after values
    ip_address TEXT,
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- INDEXES (Performance optimization)
-- ============================================================================

-- Organisations
CREATE INDEX idx_organisations_subdomain ON organisations(subdomain);
CREATE INDEX idx_organisations_stripe_customer ON organisations(stripe_customer_id);

-- Users
CREATE INDEX idx_users_organisation ON users(organisation_id);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_team ON users(team_id);

-- Teams
CREATE INDEX idx_teams_organisation ON teams(organisation_id);
CREATE INDEX idx_teams_manager ON teams(manager_id);

-- Sites
CREATE INDEX idx_sites_organisation ON sites(organisation_id);
CREATE INDEX idx_sites_archived ON sites(archived_at) WHERE archived_at IS NULL;

-- People
CREATE INDEX idx_people_organisation ON people(organisation_id);
CREATE INDEX idx_people_team ON people(team_id);
CREATE INDEX idx_people_site ON people(site_id);
CREATE INDEX idx_people_archived ON people(archived_at) WHERE archived_at IS NULL;
CREATE INDEX idx_people_name ON people(name);

-- Vehicles
CREATE INDEX idx_vehicles_organisation ON vehicles(organisation_id);
CREATE INDEX idx_vehicles_registration ON vehicles(registration);
CREATE INDEX idx_vehicles_archived ON vehicles(archived_at) WHERE archived_at IS NULL;

-- Assets
CREATE INDEX idx_assets_organisation ON assets(organisation_id);
CREATE INDEX idx_assets_asset_id ON assets(asset_id);
CREATE INDEX idx_assets_site ON assets(site_id);
CREATE INDEX idx_assets_archived ON assets(archived_at) WHERE archived_at IS NULL;

-- Suppliers
CREATE INDEX idx_suppliers_organisation ON suppliers(organisation_id);
CREATE INDEX idx_suppliers_archived ON suppliers(archived_at) WHERE archived_at IS NULL;

-- Document Types
CREATE INDEX idx_document_types_organisation ON document_types(organisation_id);

-- Documents (Critical for performance)
CREATE INDEX idx_documents_organisation ON documents(organisation_id);
CREATE INDEX idx_documents_entity ON documents(entity_type, entity_id);
CREATE INDEX idx_documents_expiry ON documents(expiry_date) WHERE expiry_date IS NOT NULL;
CREATE INDEX idx_documents_status ON documents(status);
CREATE INDEX idx_documents_review ON documents(review_status);
-- Composite index for dashboard queries
CREATE INDEX idx_documents_org_status_expiry ON documents(organisation_id, status, expiry_date);

-- Document Versions
CREATE INDEX idx_document_versions_document ON document_versions(document_id);
CREATE INDEX idx_document_versions_uploaded ON document_versions(uploaded_at);

-- Document Extractions
CREATE INDEX idx_document_extractions_version ON document_extractions(document_version_id);
CREATE INDEX idx_document_extractions_status ON document_extractions(processing_status);

-- Notifications
CREATE INDEX idx_notifications_organisation ON notifications(organisation_id);
CREATE INDEX idx_notifications_recipient ON notifications(recipient_id);
CREATE INDEX idx_notifications_status ON notifications(status);
CREATE INDEX idx_notifications_document ON notifications(document_id);
-- For notification queue processing
CREATE INDEX idx_notifications_pending ON notifications(status, created_at) WHERE status = 'pending';

-- Notification Logs
CREATE INDEX idx_notification_logs_organisation ON notification_logs(organisation_id);
CREATE INDEX idx_notification_logs_recipient ON notification_logs(recipient_id);

-- Audit Logs
CREATE INDEX idx_audit_logs_organisation ON audit_logs(organisation_id);
CREATE INDEX idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX idx_audit_logs_created ON audit_logs(created_at);

-- ============================================================================
-- TRIGGERS (Automated timestamp updates)
-- ============================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to all tables with updated_at
CREATE TRIGGER update_organisations_updated_at BEFORE UPDATE ON organisations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_teams_updated_at BEFORE UPDATE ON teams
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_sites_updated_at BEFORE UPDATE ON sites
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_people_updated_at BEFORE UPDATE ON people
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_vehicles_updated_at BEFORE UPDATE ON vehicles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_assets_updated_at BEFORE UPDATE ON assets
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_suppliers_updated_at BEFORE UPDATE ON suppliers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_document_types_updated_at BEFORE UPDATE ON document_types
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_documents_updated_at BEFORE UPDATE ON documents
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- SEED DATA (Default document types)
-- ============================================================================

-- Insert common UK construction document types (no org_id, will be created per org)
-- Note: These are templates. Each org will get their own copies with org_id set

-- Template document types (to be copied for each org on creation)
COMMENT ON TABLE document_types IS 'Document types can be global (organisation_id IS NULL) or org-specific';

-- End of migration
