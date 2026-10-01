-- =========================================================
-- SKEMA DATABASE REAL-TIME SUPABASE - SIMPEG SIT BINA INSAN
-- Salin dan jalankan script ini di SQL Editor Supabase Anda
-- =========================================================

-- 1. TABEL PEGAWAI
CREATE TABLE IF NOT EXISTS public.pegawai (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    nip TEXT UNIQUE NOT NULL,
    nama TEXT NOT NULL,
    email TEXT,
    no_hp TEXT,
    jabatan TEXT NOT NULL,
    divisi TEXT NOT NULL,
    status TEXT DEFAULT 'Tetap',
    tanggal_masuk DATE DEFAULT CURRENT_DATE,
    gaji_pokok NUMERIC NOT NULL DEFAULT 5000000,
    sisa_cuti INT DEFAULT 12,
    foto_url TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. TABEL ABSENSI HARIAN
CREATE TABLE IF NOT EXISTS public.absensi (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    pegawai_id TEXT NOT NULL,
    nama_pegawai TEXT NOT NULL,
    tanggal DATE NOT NULL,
    waktu_masuk TEXT,
    waktu_pulang TEXT,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    jarak_meter DOUBLE PRECISION,
    status_kehadiran TEXT DEFAULT 'Hadir Tepat Waktu',
    foto_absen TEXT,
    catatan TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. TABEL PENGAJUAN CUTI & IZIN
CREATE TABLE IF NOT EXISTS public.cuti_izin (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    pegawai_id TEXT NOT NULL,
    nama_pegawai TEXT NOT NULL,
    jenis TEXT NOT NULL,
    tanggal_mulai DATE NOT NULL,
    tanggal_selesai DATE NOT NULL,
    jumlah_hari INT NOT NULL,
    alasan TEXT NOT NULL,
    dokumen_url TEXT,
    status TEXT DEFAULT 'Menunggu Persetujuan',
    catatan_admin TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. TABEL PENGAJUAN KENAIKAN GAJI
CREATE TABLE IF NOT EXISTS public.kenaikan_gaji (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    pegawai_id TEXT NOT NULL,
    nama_pegawai TEXT NOT NULL,
    jabatan TEXT NOT NULL,
    gaji_lama NUMERIC NOT NULL,
    gaji_baru NUMERIC NOT NULL,
    persentase NUMERIC NOT NULL,
    alasan TEXT NOT NULL,
    status TEXT DEFAULT 'Diajukan',
    catatan_pimpinan TEXT,
    tanggal_efektif DATE,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. TABEL KONFIGURASI KANTOR & RADIUS
CREATE TABLE IF NOT EXISTS public.konfigurasi_kantor (
    id TEXT PRIMARY KEY DEFAULT 'default_kantor',
    nama_lokasi TEXT DEFAULT 'Kampus SIT Bina Insan',
    latitude DOUBLE PRECISION DEFAULT -6.208800,
    longitude DOUBLE PRECISION DEFAULT 106.845600,
    radius_meter INT DEFAULT 100,
    jam_masuk TEXT DEFAULT '07:15',
    jam_pulang TEXT DEFAULT '15:30',
    toleransi_menit INT DEFAULT 15,
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- DATA AWAL KONFIGURASI KANTOR
INSERT INTO public.konfigurasi_kantor (id, nama_lokasi, latitude, longitude, radius_meter, jam_masuk, jam_pulang, toleransi_menit)
VALUES ('default_kantor', 'Kampus SIT Bina Insan', -6.208800, 106.845600, 100, '07:15', '15:30', 15)
ON CONFLICT (id) DO NOTHING;

-- DATA AWAL PEGAWAI CONTOH
INSERT INTO public.pegawai (nip, nama, email, no_hp, jabatan, divisi, status, tanggal_masuk, gaji_pokok, sisa_cuti, foto_url)
VALUES 
('BI-2021001', 'Ustadz Ahmad Fauzi, M.Pd.', 'ahmad.fauzi@binainsan.sch.id', '081234567801', 'Kepala Sekolah', 'SD Islam Terpadu', 'Tetap', '2021-07-01', 8500000, 10, 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'),
('BI-2022015', 'Ustadzah Siti Nurhaliza, S.Pd.I', 'siti.nurhaliza@binainsan.sch.id', '081234567802', 'Guru Tahfidz & PAI', 'SMP Islam Terpadu', 'Tetap', '2022-01-10', 5200000, 12, 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80'),
('BI-2022042', 'Muhammad Rizky Pratama, S.Kom.', 'rizky.pratama@binainsan.sch.id', '081234567803', 'Staff IT & Kurikulum Digital', 'Manajemen Yayasan', 'Tetap', '2022-08-15', 5500000, 8, 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'),
('BI-2023008', 'Fatimah Az-Zahra, S.Si.', 'fatimah.zahra@binainsan.sch.id', '081234567804', 'Guru Sains & Matematika', 'SMA Islam Terpadu', 'Kontrak', '2023-01-05', 4800000, 11, 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'),
('BI-2023019', 'Ustadz Hendra Gunawan, Lc.', 'hendra.gunawan@binainsan.sch.id', '081234567805', 'Guru Bahasa Arab', 'SMA Islam Terpadu', 'Tetap', '2023-07-10', 5000000, 12, 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80')
ON CONFLICT (nip) DO NOTHING;

-- AKTIFKAN ROW LEVEL SECURITY (RLS) & IZIN AKSES PUBLIK
ALTER TABLE public.pegawai ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.absensi ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cuti_izin ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kenaikan_gaji ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.konfigurasi_kantor ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public Read Pegawai" ON public.pegawai FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public Read Absensi" ON public.absensi FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public Read Cuti Izin" ON public.cuti_izin FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public Read Kenaikan Gaji" ON public.kenaikan_gaji FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public Read Konfigurasi" ON public.konfigurasi_kantor FOR ALL USING (true) WITH CHECK (true);

-- AKTIFKAN FITUR SUPABASE REALTIME
ALTER PUBLICATION supabase_realtime ADD TABLE public.pegawai;
ALTER PUBLICATION supabase_realtime ADD TABLE public.absensi;
ALTER PUBLICATION supabase_realtime ADD TABLE public.cuti_izin;
ALTER PUBLICATION supabase_realtime ADD TABLE public.kenaikan_gaji;
ALTER PUBLICATION supabase_realtime ADD TABLE public.konfigurasi_kantor;
