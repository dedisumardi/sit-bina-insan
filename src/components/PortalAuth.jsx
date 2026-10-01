import React, { useState } from 'react';
import { 
  Building2, 
  UserCheck, 
  ArrowRight, 
  ShieldCheck, 
  Lock, 
  Eye, 
  EyeOff, 
  AlertCircle, 
  CheckCircle2, 
  Key, 
  User, 
  Sparkles,
  Info
} from 'lucide-react';
import { authenticatePegawai, authenticateAdmin } from '../services/db';

export default function PortalAuth({ 
  employees, 
  onSelectPortal, 
  theme, 
  toggleTheme,
  dbStatus,
  onOpenDbModal 
}) {
  // Mobile tab state
  const [activePortalTab, setActivePortalTab] = useState('pegawai'); // 'pegawai' | 'admin'

  // Pegawai Login Form States
  const [pegawaiIdentifier, setPegawaiIdentifier] = useState('');
  const [pegawaiPassword, setPegawaiPassword] = useState('');
  const [showPegawaiPassword, setShowPegawaiPassword] = useState(false);
  const [pegawaiError, setPegawaiError] = useState('');
  const [isPegawaiLoading, setIsPegawaiLoading] = useState(false);

  // Admin Login Form States
  const [adminUsername, setAdminUsername] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [showAdminPassword, setShowAdminPassword] = useState(false);
  const [adminError, setAdminError] = useState('');
  const [isAdminLoading, setIsAdminLoading] = useState(false);

  // Quick fill demo employee
  const handleQuickFillPegawai = (emp) => {
    setPegawaiIdentifier(emp.nip);
    setPegawaiPassword(emp.password || 'bina123');
    setPegawaiError('');
  };

  // Quick fill demo admin
  const handleQuickFillAdmin = () => {
    setAdminUsername('admin');
    setAdminPassword('admin123');
    setAdminError('');
  };

  const handlePegawaiSubmit = async (e) => {
    e.preventDefault();
    setPegawaiError('');
    setIsPegawaiLoading(true);

    try {
      const res = await authenticatePegawai(pegawaiIdentifier, pegawaiPassword);
      if (res.success) {
        onSelectPortal('pegawai', res.employee);
      } else {
        setPegawaiError(res.message);
      }
    } catch (err) {
      setPegawaiError('Terjadi kesalahan saat memverifikasi akun pegawai.');
    } finally {
      setIsPegawaiLoading(false);
    }
  };

  const handleAdminSubmit = (e) => {
    e.preventDefault();
    setAdminError('');
    setIsAdminLoading(true);

    try {
      const res = authenticateAdmin(adminUsername, adminPassword);
      if (res.success) {
        onSelectPortal('admin', null);
      } else {
        setAdminError(res.message);
      }
    } catch (err) {
      setAdminError('Terjadi kesalahan saat memverifikasi akun administrator.');
    } finally {
      setIsAdminLoading(false);
    }
  };

  return (
    <div className="auth-portal-wrapper">
      {/* Background decoration */}
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

        {/* Mobile Tab Switcher */}
        <div className="portal-mobile-tabs" style={{ display: 'none', justifyContent: 'center', gap: 8, marginBottom: 20 }}>
          <button 
            type="button" 
            className={`btn btn-sm ${activePortalTab === 'pegawai' ? 'btn-success' : 'btn-secondary'}`}
            onClick={() => setActivePortalTab('pegawai')}
            style={{ fontWeight: 700 }}
          >
            <UserCheck size={16} />
            <span>Login Pegawai / Guru</span>
          </button>
          <button 
            type="button" 
            className={`btn btn-sm ${activePortalTab === 'admin' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActivePortalTab('admin')}
            style={{ fontWeight: 700 }}
          >
            <Building2 size={16} />
            <span>Login Administrator</span>
          </button>
        </div>

        {/* Portal Cards Grid */}
        <div className="portal-cards-grid">
          {/* ======================================================== */}
          {/* 1. KARTU LOGIN PEGAWAI & GURU                            */}
          {/* ======================================================== */}
          <div className="portal-card pegawai-card">
            <div className="portal-card-top">
              <div className="portal-icon-box pegawai-icon-box">
                <UserCheck size={32} />
              </div>
              <span className="badge badge-success" style={{ fontWeight: 800 }}>
                Portal Guru & Staf
              </span>
            </div>

            <h2 className="portal-card-title">Login Akun Pegawai</h2>
            <p className="portal-card-desc">
              Masukkan Nomor Induk Pegawai (NIP) atau email resmi sekolah beserta kata sandi akun Anda untuk mengakses portal mandiri.
            </p>

            {pegawaiError && (
              <div style={{ 
                background: 'rgba(239, 68, 68, 0.1)', 
                border: '1px solid rgba(239, 68, 68, 0.3)', 
                borderRadius: 10, 
                padding: '10px 14px', 
                marginBottom: 16,
                color: 'var(--color-danger)',
                fontSize: '0.82rem',
                display: 'flex',
                alignItems: 'flex-start',
                gap: 8
              }}>
                <AlertCircle size={16} style={{ flexShrink: 0, marginTop: 2 }} />
                <span>{pegawaiError}</span>
              </div>
            )}

            <form onSubmit={handlePegawaiSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {/* Field NIP / Email */}
              <div className="form-group" style={{ textAlign: 'left', marginBottom: 0 }}>
                <label className="form-label" style={{ fontSize: '0.82rem', fontWeight: 700 }}>
                  NIP atau Email Resmi Pegawai:
                </label>
                <div style={{ position: 'relative' }}>
                  <User size={17} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="Contoh: BI-2021001 atau ahmad.fauzi@binainsan.sch.id"
                    value={pegawaiIdentifier}
                    onChange={(e) => setPegawaiIdentifier(e.target.value)}
                    style={{ paddingLeft: 38, fontSize: '0.88rem' }}
                    required
                  />
                </div>
              </div>

              {/* Field Password */}
              <div className="form-group" style={{ textAlign: 'left', marginBottom: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <label className="form-label" style={{ fontSize: '0.82rem', fontWeight: 700 }}>
                    Kata Sandi Akun:
                  </label>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                    Default: <code style={{ color: 'var(--primary-600)', fontWeight: 700 }}>bina123</code>
                  </span>
                </div>
                <div style={{ position: 'relative' }}>
                  <Lock size={17} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input 
                    type={showPegawaiPassword ? 'text' : 'password'} 
                    className="form-input" 
                    placeholder="Masukkan kata sandi akun Anda"
                    value={pegawaiPassword}
                    onChange={(e) => setPegawaiPassword(e.target.value)}
                    style={{ paddingLeft: 38, paddingRight: 40, fontSize: '0.88rem' }}
                    required
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPegawaiPassword(!showPegawaiPassword)}
                    style={{ 
                      position: 'absolute', 
                      right: 12, 
                      top: '50%', 
                      transform: 'translateY(-50%)', 
                      background: 'none', 
                      border: 'none', 
                      cursor: 'pointer', 
                      color: 'var(--text-muted)',
                      display: 'flex',
                      alignItems: 'center'
                    }}
                    title={showPegawaiPassword ? 'Sembunyikan sandi' : 'Tampilkan sandi'}
                  >
                    {showPegawaiPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Tombol Submit Pegawai */}
              <button 
                type="submit" 
                className="btn btn-success btn-portal"
                disabled={isPegawaiLoading}
                style={{ marginTop: 6 }}
              >
                <span>{isPegawaiLoading ? 'Memverifikasi...' : 'Masuk ke Akun Pegawai'}</span>
                <ArrowRight size={18} />
              </button>
            </form>

            {/* Bantuan Akun Coba Cepat (Quick Demo Fill) */}
            <div style={{ 
              marginTop: 18, 
              padding: '12px 14px', 
              background: 'var(--bg-subtle)', 
              borderRadius: 12, 
              border: '1px dashed var(--border-color)',
              textAlign: 'left'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: 5 }}>
                  <Sparkles size={13} color="var(--primary-600)" />
                  Uji Coba Cepat (Pilih Akun Guru):
                </span>
                <span style={{ fontSize: '0.68rem', color: 'var(--primary-700)', fontWeight: 600 }}>
                  Password: bina123
                </span>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {employees.slice(0, 4).map(p => (
                  <button 
                    key={p.id}
                    type="button"
                    onClick={() => handleQuickFillPegawai(p)}
                    style={{
                      fontSize: '0.72rem',
                      padding: '4px 8px',
                      borderRadius: 8,
                      border: '1px solid var(--border-color)',
                      background: 'var(--bg-card)',
                      color: 'var(--text-main)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      transition: 'all 0.15s ease'
                    }}
                    title={`NIP: ${p.nip} | Sandi: ${p.password || 'bina123'}`}
                  >
                    <img 
                      src={p.foto_url || '/logo.jpg'} 
                      alt="" 
                      style={{ width: 18, height: 18, borderRadius: '50%', objectFit: 'cover' }} 
                    />
                    <span style={{ fontWeight: 600 }}>{p.nama.split(',')[0]}</span>
                    <span style={{ fontSize: '0.66rem', color: 'var(--text-muted)' }}>({p.nip})</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* ======================================================== */}
          {/* 2. KARTU LOGIN ADMINISTRATOR & HRD                       */}
          {/* ======================================================== */}
          <div className="portal-card admin-card">
            <div className="portal-card-top">
              <div className="portal-icon-box admin-icon-box">
                <Building2 size={32} />
              </div>
              <span className="badge badge-warning" style={{ fontWeight: 800 }}>
                Akses Pimpinan & HRD
              </span>
            </div>

            <h2 className="portal-card-title">Login Administrator</h2>
            <p className="portal-card-desc">
              Khusus Yayasan, Kepala Sekolah, dan Tim HRD untuk memantau absensi GPS seluruh staf, kelola data pegawai, persetujuan cuti, dan evaluasi gaji.
            </p>

            {adminError && (
              <div style={{ 
                background: 'rgba(239, 68, 68, 0.1)', 
                border: '1px solid rgba(239, 68, 68, 0.3)', 
                borderRadius: 10, 
                padding: '10px 14px', 
                marginBottom: 16,
                color: 'var(--color-danger)',
                fontSize: '0.82rem',
                display: 'flex',
                alignItems: 'flex-start',
                gap: 8
              }}>
                <AlertCircle size={16} style={{ flexShrink: 0, marginTop: 2 }} />
                <span>{adminError}</span>
              </div>
            )}

            <form onSubmit={handleAdminSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {/* Field Username Admin */}
              <div className="form-group" style={{ textAlign: 'left', marginBottom: 0 }}>
                <label className="form-label" style={{ fontSize: '0.82rem', fontWeight: 700 }}>
                  Username / Email Administrator:
                </label>
                <div style={{ position: 'relative' }}>
                  <User size={17} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="admin atau admin@binainsan.sch.id"
                    value={adminUsername}
                    onChange={(e) => setAdminUsername(e.target.value)}
                    style={{ paddingLeft: 38, fontSize: '0.88rem' }}
                    required
                  />
                </div>
              </div>

              {/* Field Password Admin */}
              <div className="form-group" style={{ textAlign: 'left', marginBottom: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <label className="form-label" style={{ fontSize: '0.82rem', fontWeight: 700 }}>
                    Kata Sandi Administrator:
                  </label>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                    Default: <code style={{ color: 'var(--accent-gold-700)', fontWeight: 700 }}>admin123</code>
                  </span>
                </div>
                <div style={{ position: 'relative' }}>
                  <Lock size={17} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input 
                    type={showAdminPassword ? 'text' : 'password'} 
                    className="form-input" 
                    placeholder="Masukkan kata sandi admin"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    style={{ paddingLeft: 38, paddingRight: 40, fontSize: '0.88rem' }}
                    required
                  />
                  <button 
                    type="button"
                    onClick={() => setShowAdminPassword(!showAdminPassword)}
                    style={{ 
                      position: 'absolute', 
                      right: 12, 
                      top: '50%', 
                      transform: 'translateY(-50%)', 
                      background: 'none', 
                      border: 'none', 
                      cursor: 'pointer', 
                      color: 'var(--text-muted)',
                      display: 'flex',
                      alignItems: 'center'
                    }}
                    title={showAdminPassword ? 'Sembunyikan sandi' : 'Tampilkan sandi'}
                  >
                    {showAdminPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Tombol Submit Admin */}
              <button 
                type="submit" 
                className="btn btn-primary btn-portal"
                disabled={isAdminLoading}
                style={{ marginTop: 6 }}
              >
                <span>{isAdminLoading ? 'Memverifikasi...' : 'Masuk Sebagai Administrator'}</span>
                <ArrowRight size={18} />
              </button>
            </form>

            {/* Bantuan Akun Cepat Admin */}
            <div style={{ 
              marginTop: 18, 
              padding: '12px 14px', 
              background: 'var(--bg-subtle)', 
              borderRadius: 12, 
              border: '1px dashed var(--border-color)',
              textAlign: 'left'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: 5 }}>
                  <Key size={13} color="var(--accent-gold-600)" />
                  Kredensial Admin Demo:
                </span>
                <span style={{ fontSize: '0.68rem', color: 'var(--accent-gold-700)', fontWeight: 600 }}>
                  admin / admin123
                </span>
              </div>
              <button 
                type="button"
                onClick={handleQuickFillAdmin}
                style={{
                  fontSize: '0.74rem',
                  padding: '5px 10px',
                  borderRadius: 8,
                  border: '1px solid rgba(217, 119, 6, 0.3)',
                  background: 'rgba(217, 119, 6, 0.08)',
                  color: 'var(--accent-gold-700)',
                  cursor: 'pointer',
                  fontWeight: 700,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  transition: 'all 0.15s ease'
                }}
              >
                <span>⚡ Isi Kredensial Admin Otomatis</span>
              </button>
            </div>
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
