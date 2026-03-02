-- ============================================================
-- Schema: Sistema de Vencimiento de Documentos Vehiculares
-- Execute this in Supabase SQL Editor
-- ============================================================

-- Enable UUID extension (usually already enabled)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- TABLE: document_types
-- ============================================================
CREATE TABLE IF NOT EXISTS document_types (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name           text NOT NULL,
  slug           text NOT NULL UNIQUE,
  duration_months int  NOT NULL CHECK (duration_months > 0),
  icon           text NOT NULL DEFAULT '📄',
  color          text NOT NULL DEFAULT '#6B7280',
  created_at     timestamptz DEFAULT now()
);

-- ============================================================
-- TABLE: vehicles
-- ============================================================
CREATE TABLE IF NOT EXISTS vehicles (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  plate      text NOT NULL UNIQUE,
  brand      text NOT NULL,
  model      text NOT NULL,
  year       int  NOT NULL CHECK (year > 1900 AND year <= 2100),
  owner      text,
  notes      text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER vehicles_updated_at
  BEFORE UPDATE ON vehicles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- TABLE: documents
-- ============================================================
CREATE TABLE IF NOT EXISTS documents (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id       uuid NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
  document_type_id uuid NOT NULL REFERENCES document_types(id),
  issue_date       date NOT NULL,
  expiry_date      date NOT NULL,
  file_url         text,
  notes            text,
  created_at       timestamptz DEFAULT now(),
  updated_at       timestamptz DEFAULT now()
);

CREATE TRIGGER documents_updated_at
  BEFORE UPDATE ON documents
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Useful indexes
CREATE INDEX IF NOT EXISTS idx_documents_vehicle_id       ON documents(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_documents_document_type_id ON documents(document_type_id);
CREATE INDEX IF NOT EXISTS idx_documents_expiry_date      ON documents(expiry_date);

-- ============================================================
-- SEED: Document types
-- ============================================================
INSERT INTO document_types (name, slug, duration_months, icon, color) VALUES
  ('SOAT',                     'soat',                  12, '🛡️', '#3B82F6'),
  ('Tarjeta de Operación',     'tarjeta-operacion',     24, '📋', '#8B5CF6'),
  ('Revisión Técnico-Mecánica','tecnico-mecanica',      12, '🔧', '#F59E0B'),
  ('Póliza RCC',               'poliza-rcc',            12, '📄', '#10B981'),
  ('Póliza RCE',               'poliza-rce',            12, '📜', '#06B6D4'),
  ('Bimestral',                'bimestral',              2, '📅', '#F97316'),
  ('Convenio Empresarial',     'convenio-empresarial',   2, '🤝', '#EC4899')
ON CONFLICT (slug) DO NOTHING;

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- Currently public (no auth). Enable and restrict when adding auth.
-- ============================================================
ALTER TABLE document_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicles       ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents      ENABLE ROW LEVEL SECURITY;

-- Allow all operations for anonymous users (adapt for auth later)
CREATE POLICY "allow_all_document_types" ON document_types FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "allow_all_vehicles"       ON vehicles       FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "allow_all_documents"      ON documents      FOR ALL USING (true) WITH CHECK (true);
