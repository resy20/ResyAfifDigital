-- ================================================
-- SUPABASE DATABASE SETUP
-- Undangan Digital Resy & Afif
-- ================================================
-- Jalankan query ini di Supabase SQL Editor
-- https://supabase.com/dashboard/project/YOUR_PROJECT/sql

-- 1. TABLE: RSVP (Konfirmasi Kehadiran)
CREATE TABLE IF NOT EXISTS rsvp (
  id          BIGSERIAL PRIMARY KEY,
  name        TEXT NOT NULL,
  count       INTEGER DEFAULT 1,
  status      TEXT CHECK (status IN ('hadir','tidak','ragu')) DEFAULT 'hadir',
  message     TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- 2. TABLE: WISHES (Ucapan & Doa)
CREATE TABLE IF NOT EXISTS wishes (
  id          BIGSERIAL PRIMARY KEY,
  name        TEXT NOT NULL,
  text        TEXT NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Enable Row Level Security
ALTER TABLE rsvp   ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishes ENABLE ROW LEVEL SECURITY;

-- 4. Public READ (semua orang bisa baca)
CREATE POLICY "Public read rsvp"   ON rsvp   FOR SELECT USING (true);
CREATE POLICY "Public read wishes" ON wishes FOR SELECT USING (true);

-- 5. Public INSERT (semua orang bisa kirim)
CREATE POLICY "Public insert rsvp"   ON rsvp   FOR INSERT WITH CHECK (true);
CREATE POLICY "Public insert wishes" ON wishes FOR INSERT WITH CHECK (true);

-- Cek isi tabel
-- SELECT * FROM rsvp   ORDER BY created_at DESC;
-- SELECT * FROM wishes ORDER BY created_at DESC;
