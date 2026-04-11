-- HatSafe Demo Mode Migration
-- Version: 1.0
-- Created: 2026-04-11
-- Description: Adds is_demo flag to all entity/document tables and demo_seeded to organisations

-- Add demo_seeded flag to organisations
ALTER TABLE organisations ADD COLUMN IF NOT EXISTS demo_seeded BOOLEAN DEFAULT false;
ALTER TABLE organisations ADD COLUMN IF NOT EXISTS demo_seeded_at TIMESTAMPTZ;

-- Add is_demo flag to all entity tables
ALTER TABLE people     ADD COLUMN IF NOT EXISTS is_demo BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE vehicles   ADD COLUMN IF NOT EXISTS is_demo BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE assets     ADD COLUMN IF NOT EXISTS is_demo BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE sites      ADD COLUMN IF NOT EXISTS is_demo BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE suppliers  ADD COLUMN IF NOT EXISTS is_demo BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE documents  ADD COLUMN IF NOT EXISTS is_demo BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE document_types ADD COLUMN IF NOT EXISTS is_demo BOOLEAN NOT NULL DEFAULT false;

-- Indexes for fast bulk-delete of demo data
CREATE INDEX IF NOT EXISTS idx_people_is_demo     ON people(organisation_id, is_demo)    WHERE is_demo = true;
CREATE INDEX IF NOT EXISTS idx_vehicles_is_demo   ON vehicles(organisation_id, is_demo)  WHERE is_demo = true;
CREATE INDEX IF NOT EXISTS idx_assets_is_demo     ON assets(organisation_id, is_demo)    WHERE is_demo = true;
CREATE INDEX IF NOT EXISTS idx_sites_is_demo      ON sites(organisation_id, is_demo)     WHERE is_demo = true;
CREATE INDEX IF NOT EXISTS idx_suppliers_is_demo  ON suppliers(organisation_id, is_demo) WHERE is_demo = true;
CREATE INDEX IF NOT EXISTS idx_documents_is_demo  ON documents(organisation_id, is_demo) WHERE is_demo = true;
