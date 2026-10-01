import React, { useState } from 'react';
import { 
  Database, 
  CheckCircle2, 
  AlertCircle, 
  Copy, 
  ExternalLink, 
  RotateCcw, 
  X, 
  Sparkles,
  Server,
  Cloud,
  Check
} from 'lucide-react';
import { getSupabaseCredentials, testAndSaveSupabaseConfig, resetToSampleData } from '../services/db';

export default function DatabaseSettingsModal({ 
  dbStatus, 
  onClose, 
  onRefreshData 
}) {
  const currentCreds = getSupabaseCredentials();
  const [url, setUrl] = useState(currentCreds.url || '');
  const [key, setKey] = useState(currentCreds.key || '');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);
  const [copiedSql, setCopiedSql] = useState(false);

  const handleTestAndSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg(null);

    const result = await testAndSaveSupabaseConfig(url.trim(), key.trim());
    setLoading(false);
    setMsg(result);

    if (result.success) {
      setTimeout(() => {
        onRefreshData();
      }, 500);
    }
  };

  const handleDisconnect = async () => {
    await testAndSaveSupabaseConfig('', '');
    setUrl('');
    setKey('');
    setMsg({ success: true, message: 'Kembali menggunakan Local Real-Time BroadcastChannel Storage.' });
    onRefreshData();
  };

  const handleResetSample = () => {
    if (confirm('Kembalikan seluruh data pegawai, absensi, cuti, dan gaji ke data contoh awal SIT Bina Insan?')) {
      resetToSampleData();
      onRefreshData();
      alert('Data berhasil di-reset ke kondisi awal!');
    }
  };

  const handleCopySql = () => {
    const sqlText = `-- Jalankan skrip ini di SQL Editor dashboard.supabase.com
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
ALTER PUBLICATION supabase_realtime ADD TABLE public.pegawai, public.absensi, public.cuti_izin, public.kenaikan_gaji, public.konfigurasi_kantor;`;

    navigator.clipboard.writeText(sqlText);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 3000);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: 640 }}>
        <div className="modal-header">
          <h3 className="modal-title">
            <Database size={20} style={{ color: 'var(--primary-600)' }} />
            Konfigurasi Database Real-Time
          </h3>
          <button type="button" className="modal-close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          {/* Status Box */}
          <div style={{ padding: 16, borderRadius: 12, background: 'var(--bg-subtle)', border: '1px solid var(--border-color)', marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span className="pulse-dot"></span>
                <strong>Status Real-Time Saat Ini:</strong>
              </div>
              <span className={`badge ${dbStatus.isSupabase ? 'badge-success' : 'badge-info'}`}>
                {dbStatus.mode}
              </span>
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
              {dbStatus.isSupabase 
                ? `Terhubung ke Cloud Supabase (${dbStatus.url}). Perubahan data disinkronkan ke seluruh user secara instan melalui websocket.` 
                : 'Aplikasi berjalan mandiri dengan Local Realtime Engine & BroadcastChannel. Jika Anda membuka 2 tab browser sekaligus, seluruh perubahan data langsung ter-update otomatis tanpa refresh!'}
            </p>
          </div>

          {/* Form Koneksi Supabase */}
          <form onSubmit={handleTestAndSave}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
              <Cloud size={16} style={{ color: 'var(--primary-600)' }} />
              Hubungkan ke Cloud Supabase (Opsional)
            </h4>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 14 }}>
              Ingin data tersimpan di Cloud dan dapat diakses multi-device di Vercel? Masukkan URL & Anon Key dari project gratis Anda di <a href="https://supabase.com" target="_blank" rel="noreferrer" style={{ textDecoration: 'underline' }}>supabase.com</a>.
            </p>

            <div className="form-group">
              <label className="form-label">Project URL Supabase</label>
              <input 
                type="url" 
                className="form-input" 
                placeholder="https://xyzcompany.supabase.co"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Anon / Public API Key Supabase</label>
              <input 
                type="password" 
                className="form-input" 
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6..."
                value={key}
                onChange={(e) => setKey(e.target.value)}
              />
            </div>

            {msg && (
              <div style={{ padding: 10, borderRadius: 8, marginBottom: 14, fontSize: '0.84rem', display: 'flex', alignItems: 'center', gap: 8, background: msg.success ? 'rgba(16, 185, 129, 0.12)' : 'rgba(239, 68, 68, 0.12)', color: msg.success ? '#059669' : '#dc2626' }}>
                {msg.success ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                <span>{msg.message}</span>
              </div>
            )}

            <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={loading}
                style={{ flex: 1 }}
              >
                {loading ? 'Menguji Koneksi...' : 'Simpan & Aktifkan Supabase'}
              </button>

              {dbStatus.isSupabase && (
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={handleDisconnect}
                >
                  Putuskan
                </button>
              )}
            </div>
          </form>

          {/* Quick Copy Schema SQL */}
          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: 16, marginTop: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontSize: '0.84rem', fontWeight: 700 }}>
                Skrip SQL Tabel & Realtime Supabase:
              </span>
              <button 
                type="button" 
                className="btn btn-sm btn-secondary"
                onClick={handleCopySql}
                style={{ gap: 6 }}
              >
                {copiedSql ? <Check size={14} style={{ color: '#10b981' }} /> : <Copy size={14} />}
                <span>{copiedSql ? 'Tersalin!' : 'Salin SQL Skema'}</span>
              </button>
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Skrip SQL juga telah disimpan di dalam file <code>supabase_schema.sql</code> di root proyek Anda.
            </p>
          </div>

          {/* Reset Demo Data */}
          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: 16, marginTop: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <strong style={{ fontSize: '0.84rem', display: 'block' }}>Reset Data Awal</strong>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Kembalikan data guru, absensi, dan cuti contoh</span>
            </div>
            <button 
              type="button" 
              className="btn btn-sm btn-danger"
              onClick={handleResetSample}
            >
              <RotateCcw size={14} /> Reset Demo Data
            </button>
          </div>
        </div>

        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Selesai
          </button>
        </div>
      </div>
    </div>
  );
}
