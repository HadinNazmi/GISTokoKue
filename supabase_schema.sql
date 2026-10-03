-- =====================================================================
-- SKEMA DATABASE SUPABASE UNTUK WEBGIS TOKO KUE PEKANBARU
-- =====================================================================
-- Jalankan seluruh script SQL ini di: Supabase Dashboard -> SQL Editor -> New Query -> Run
-- =====================================================================

-- 1. TABEL USERS (Custom Table untuk Autentikasi Admin & Owner)
CREATE TABLE IF NOT EXISTS public.users (
  user_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  nama_lengkap TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'owner' CHECK (role IN ('admin', 'owner')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Akun Default (Opsional untuk testing)
INSERT INTO public.users (nama_lengkap, email, password, role)
VALUES 
  ('Admin WebGIS', 'admin@gmail.com', 'admin123', 'admin'),
  ('Owner Toko', 'owner@gmail.com', 'owner123', 'owner')
ON CONFLICT (email) DO NOTHING;

-- 2. TABEL TOKO_KUE (Data Utama Titik Toko Kue & Info GIS)
CREATE TABLE IF NOT EXISTS public.toko_kue (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id BIGINT REFERENCES public.users(user_id) ON DELETE SET NULL,
  nama TEXT NOT NULL,
  lat DOUBLE PRECISION NOT NULL,
  lng DOUBLE PRECISION NOT NULL,
  kecamatan TEXT,
  kelurahan TEXT,
  jalan TEXT,
  produk TEXT DEFAULT 'Kue',
  jam_buka TEXT,
  tahun_berdiri INTEGER,
  rating NUMERIC(3, 1) DEFAULT 4.5,
  telp TEXT,
  menu_favorit TEXT,
  deskripsi TEXT,
  gambar TEXT,
  gambarmenu TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index spasial/koordinat untuk performa query peta
CREATE INDEX IF NOT EXISTS idx_toko_kue_lat_lng ON public.toko_kue (lat, lng);
CREATE INDEX IF NOT EXISTS idx_toko_kue_kecamatan ON public.toko_kue (kecamatan);

-- 3. TABEL TOKO_REQUESTS (Permintaan Tambah Toko dari Owner yang Menunggu Verifikasi Admin)
CREATE TABLE IF NOT EXISTS public.toko_requests (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id BIGINT REFERENCES public.users(user_id) ON DELETE CASCADE,
  nama TEXT NOT NULL,
  lat DOUBLE PRECISION NOT NULL,
  lng DOUBLE PRECISION NOT NULL,
  kecamatan TEXT,
  kelurahan TEXT,
  jalan TEXT,
  produk TEXT DEFAULT 'Kue',
  jam_buka TEXT,
  tahun_berdiri INTEGER,
  telp TEXT,
  menu_favorit TEXT,
  deskripsi TEXT,
  gambar TEXT,
  gambarmenu TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  admin_note TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. TABEL LOG_HISTORY (Pencatatan Aktivitas User & Admin)
CREATE TABLE IF NOT EXISTS public.log_history (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_email TEXT NOT NULL,
  user_role TEXT,
  action TEXT NOT NULL,
  toko_id BIGINT,
  toko_name TEXT,
  description TEXT,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- 5. PENGATURAN ROW LEVEL SECURITY (RLS)
-- Untuk kemudahan di awal, kita izinkan akses anonim/public read-write jika belum menggunakan Supabase Auth bawaan:
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.toko_kue ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.toko_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.log_history ENABLE ROW LEVEL SECURITY;

-- Policy agar aplikasi frontend dapat membaca dan memodifikasi data:
CREATE POLICY "Public Read Users" ON public.users FOR SELECT USING (true);
CREATE POLICY "Public Insert Users" ON public.users FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Update Users" ON public.users FOR UPDATE USING (true);

CREATE POLICY "Public Read Toko" ON public.toko_kue FOR SELECT USING (true);
CREATE POLICY "Public Insert Toko" ON public.toko_kue FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Update Toko" ON public.toko_kue FOR UPDATE USING (true);
CREATE POLICY "Public Delete Toko" ON public.toko_kue FOR DELETE USING (true);

CREATE POLICY "Public Read Requests" ON public.toko_requests FOR SELECT USING (true);
CREATE POLICY "Public Insert Requests" ON public.toko_requests FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Update Requests" ON public.toko_requests FOR UPDATE USING (true);
CREATE POLICY "Public Delete Requests" ON public.toko_requests FOR DELETE USING (true);

CREATE POLICY "Public Read Log" ON public.log_history FOR SELECT USING (true);
CREATE POLICY "Public Insert Log" ON public.log_history FOR INSERT WITH CHECK (true);

-- 6. STORAGE BUCKET (Untuk Gambar Toko)
-- Di Supabase Dashboard -> Storage -> Create new bucket:
-- Beri nama: "images" dan centang opsi "Public bucket".
