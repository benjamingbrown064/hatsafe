/**
 * One-shot migration endpoint — returns the SQL needed to add is_demo columns.
 * Protected by service role key in Authorization header.
 * Call this after deploy, copy the SQL, run it in Supabase SQL Editor.
 * DELETE this file once migration is confirmed.
 */
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

const MIGRATION_SQL = `
-- HatSafe Demo Mode Migration (003_demo_mode)
-- Run in Supabase SQL Editor: https://supabase.com/dashboard/project/sgokwcybiaetiwonrwra/sql

ALTER TABLE organisations ADD COLUMN IF NOT EXISTS demo_seeded BOOLEAN DEFAULT false;
ALTER TABLE organisations ADD COLUMN IF NOT EXISTS demo_seeded_at TIMESTAMPTZ;
ALTER TABLE people          ADD COLUMN IF NOT EXISTS is_demo BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE vehicles        ADD COLUMN IF NOT EXISTS is_demo BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE assets          ADD COLUMN IF NOT EXISTS is_demo BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE sites           ADD COLUMN IF NOT EXISTS is_demo BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE suppliers       ADD COLUMN IF NOT EXISTS is_demo BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE documents       ADD COLUMN IF NOT EXISTS is_demo BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE document_types  ADD COLUMN IF NOT EXISTS is_demo BOOLEAN NOT NULL DEFAULT false;

CREATE INDEX IF NOT EXISTS idx_people_is_demo     ON people(organisation_id, is_demo)    WHERE is_demo = true;
CREATE INDEX IF NOT EXISTS idx_vehicles_is_demo   ON vehicles(organisation_id, is_demo)  WHERE is_demo = true;
CREATE INDEX IF NOT EXISTS idx_assets_is_demo     ON assets(organisation_id, is_demo)    WHERE is_demo = true;
CREATE INDEX IF NOT EXISTS idx_sites_is_demo      ON sites(organisation_id, is_demo)     WHERE is_demo = true;
CREATE INDEX IF NOT EXISTS idx_suppliers_is_demo  ON suppliers(organisation_id, is_demo) WHERE is_demo = true;
CREATE INDEX IF NOT EXISTS idx_documents_is_demo  ON documents(organisation_id, is_demo) WHERE is_demo = true;
`

export async function GET(request: Request) {
  const authHeader = request.headers.get('Authorization')
  if (authHeader !== `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  return NextResponse.json({ sql: MIGRATION_SQL })
}
