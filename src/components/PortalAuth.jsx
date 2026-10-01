import React, { useState } from 'react';
import { 
  Building2, 
  UserCheck, 
  ArrowRight, 
  ShieldCheck, 
  Sparkles, 
  Users, 
  MapPin, 
  CalendarCheck, 
  TrendingUp,
  Lock,
  ChevronRight
} from 'lucide-react';

export default function PortalAuth({ 
  employees, 
  onSelectPortal, 
  theme, 
  toggleTheme,
  dbStatus,
  onOpenDbModal 
}) {
  const [selectedPegawaiId, setSelectedPegawaiId] = useState(employees[0]?.id || '');
  const [adminPin, setAdminPin] = useState('');
  const [showAdminPinInput, setShowAdminPinInput] = useState(false);

  const handleAdminEnter = () => {
    onSelectPortal('admin', null);
  };

  const handlePegawaiEnter = (e) => {
    e.preventDefault();
    const targetEmp = employees.find(p => p.id === selectedPegawaiId) || employees[0];
    onSelectPortal('pegawai', targetEmp);
  };

  return (
    <div className="auth-portal-wrapper">
      {/* Background Islamic architectural decoration */}
      <div className="auth-bg-overlay" />

      <div className="auth-portal-container">
        {/* Brand Header */}
        <div className="auth-header">
          <img src="/logo.jpg" alt="Logo SIT Bina Insan" className="auth-logo-img" />
          <h1 className="auth-title">SIMPEG SIT BINA INSAN</h1>
          <p className="auth-subtitle">
            Sistem Informasi Manajemen Kepegawaian & Presensi Radius Geofencing Terpadu
          </p>
          <div style={{ marginTop: 10, display: 'flex', justifyContent: 'center', gap: 10 }}>
            <span className="badge badge-success" style={{ fontSize: '0.75rem', padding: '4px 12px' }}>
              <span className="pulse-dot" style={{ display: 'inline-block', marginRight: 6 }}></span>
              {dbStatus.isSupabase ? 'Cloud Supabase Real-Time' : 'Local Real-Time Engine Aktif'}
            </span>
          </div>
        </div>

        {/* Portal Selection Cards Grid */}
        <div className="portal-cards-grid">
          {/* 1. KARTU PORTAL ADMINISTRATOR & HRD */}
          <div className="portal-card admin-card">
            <div className="portal-card-top">
              <div className="portal-icon-box admin-icon-box">
                <Building2 size={32} />
              </div>
              <span className="badge badge-warning" style={{ fontWeight: 800 }}>
                Akses Pimpinan & HRD
              </span>
            </div>

            <h2 className="portal-card-title">Portal Administrator</h2>
            <p className="portal-card-desc">
              Khusus Yayasan, Kepala Sekolah, dan Tim HRD untuk mengelola data seluruh pegawai, memantau absensi GPS real-time, menyetujui cuti & izin, serta evaluasi kenaikan gaji.
            </p>

            <ul className="portal-features-list">
              <li>✓ Kelola Direktori Pegawai (Tambah, Edit, Hapus, Ekspor CSV)</li>
              <li>✓ Monitoring Presensi Radius Geofence Seluruh Staf</li>
              <li>✓ Verifikasi & Persetujuan Pengajuan Cuti & Izin</li>
              <li>✓ Keputusan Kenaikan Gaji & Cetak SK Resmi Yayasan</li>
              <li>✓ Pengaturan Titik Koordinat Kantor & Radius Izin</li>
            </ul>

            <button 
              type="button" 
              className="btn btn-primary btn-portal"
              onClick={handleAdminEnter}
            >
              <span>Masuk Sebagai Administrator / HRD</span>
              <ArrowRight size={18} />
            </button>
          </div>

          {/* 2. KARTU PORTAL PEGAWAI & GURU */}
          <div className="portal-card pegawai-card">
            <div className="portal-card-top">
              <div className="portal-icon-box pegawai-icon-box">
                <UserCheck size={32} />
              </div>
              <span className="badge badge-success" style={{ fontWeight: 800 }}>
                Akses Guru & Karyawan
              </span>
            </div>

            <h2 className="portal-card-title">Portal Guru & Pegawai</h2>
            <p className="portal-card-desc">
              Portal mandiri untuk guru dan tenaga pendidik SIT Bina Insan untuk melakukan presensi harian berbasis GPS sekolah, permohonan izin/cuti, dan pengajuan penyesuaian gaji.
            </p>

            <form onSubmit={handlePegawaiEnter} style={{ marginTop: 'auto' }}>
              <div className="form-group" style={{ textAlign: 'left', marginBottom: 14 }}>
                <label className="form-label" style={{ fontSize: '0.82rem' }}>
                  Pilih Akun Guru / Pegawai Anda:
                </label>
                <select 
                  className="form-select"
                  value={selectedPegawaiId}
                  onChange={(e) => setSelectedPegawaiId(e.target.value)}
                  style={{ fontWeight: 600 }}
                  required
                >
                  {employees.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.nama} ({p.jabatan} - {p.divisi})
                    </option>
                  ))}
                </select>
              </div>

              <ul className="portal-features-list" style={{ marginBottom: 16 }}>
                <li>✓ Presensi Mandiri Masuk & Pulang Berbasis Radius GPS</li>
                <li>✓ Verifikasi Selfie Kamera Saat Presensi</li>
                <li>✓ Pengajuan Cuti Tahunan, Cuti Sakit & Izin Kerja</li>
                <li>✓ Usulan Kenaikan Gaji Berkala & Cetak SK Keputusan</li>
              </ul>

              <button 
                type="submit" 
                className="btn btn-success btn-portal"
              >
                <span>Masuk ke Akun Pegawai</span>
                <ArrowRight size={18} />
              </button>
            </form>
          </div>
        </div>

        {/* Footer info */}
        <div className="auth-footer">
          <p>© {new Date().getFullYear()} Sekolah Islam Terpadu (SIT) Bina Insan. Hak cipta dilindungi.</p>
        </div>
      </div>
    </div>
  );
}
