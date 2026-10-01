import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  MapPin, 
  CalendarCheck, 
  TrendingUp, 
  Building2, 
  UserCheck, 
  Database, 
  Settings, 
  Moon, 
  Sun, 
  LogOut,
  X,
  ShieldCheck,
  CheckCircle2,
  Key
} from 'lucide-react';

const GithubIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
  </svg>
);

export default function Sidebar({
  activeTab,
  setActiveTab,
  currentRole,
  currentEmployee,
  setCurrentEmployee,
  employees,
  leaveList,
  salaryList,
  dbStatus,
  onOpenDbModal,
  onOpenDeployModal,
  onOpenSettingsModal,
  onOpenGantiPasswordModal,
  theme,
  toggleTheme,
  isMobileOpen,
  setIsMobileOpen,
  onLogoutPortal
}) {
  const pendingLeaves = leaveList.filter(l => l.status === 'Menunggu Persetujuan').length;
  const pendingSalaries = salaryList.filter(s => s.status === 'Menunggu Persetujuan').length;

  const handleNavClick = (tab) => {
    setActiveTab(tab);
    if (setIsMobileOpen) setIsMobileOpen(false);
  };

  const isAdmin = currentRole === 'admin';

  return (
    <>
      {/* Backdrop for mobile */}
      {isMobileOpen && (
        <div 
          className="sidebar-backdrop" 
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      <aside className={`app-sidebar ${isMobileOpen ? 'mobile-open' : ''} ${isAdmin ? 'sidebar-admin' : 'sidebar-pegawai'}`}>
        {/* Brand Header */}
        <div className="sidebar-brand">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <img src="/logo.jpg" alt="Logo SIT Bina Insan" className="sidebar-logo-img" />
            <div>
              <h2 className="sidebar-brand-title">
                {isAdmin ? 'SIMPEG ADMIN' : 'PORTAL GURU'}
              </h2>
              <p className="sidebar-brand-sub">
                {isAdmin ? 'Panel Pimpinan Yayasan' : 'SIT Bina Insan'}
              </p>
            </div>
          </div>
          {isMobileOpen && (
            <button 
              type="button" 
              className="modal-close-btn" 
              onClick={() => setIsMobileOpen(false)}
              style={{ display: 'flex' }}
            >
              <X size={20} />
            </button>
          )}
        </div>

        {/* Real-time Indicator Pill */}
        <div style={{ padding: '0 16px 10px' }}>
          <button 
            type="button" 
            className="sidebar-realtime-pill" 
            onClick={isAdmin ? onOpenDbModal : undefined}
            title="Klik untuk konfigurasi Supabase Real-Time"
          >
            <span className="pulse-dot"></span>
            <span style={{ flex: 1, textAlign: 'left' }}>
              {dbStatus.isSupabase ? 'Cloud Supabase' : 'Real-Time Sync'}
            </span>
            <Database size={13} style={{ opacity: 0.7 }} />
          </button>
        </div>

        {/* Portal Info Badge / Active Pegawai Card */}
        <div style={{ padding: '0 16px 14px' }}>
          {isAdmin ? (
            <div style={{ padding: '8px 12px', background: 'rgba(217, 119, 6, 0.1)', border: '1px solid rgba(217, 119, 6, 0.25)', borderRadius: 10, display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.8rem', color: 'var(--accent-gold-700)' }}>
              <ShieldCheck size={16} />
              <strong style={{ fontWeight: 700 }}>Akses Administrator & HRD</strong>
            </div>
          ) : (
            <div style={{ background: 'var(--bg-subtle)', border: '1px solid var(--border-color)', borderRadius: 10, padding: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <img 
                  src={currentEmployee?.foto_url || '/logo.jpg'} 
                  alt={currentEmployee?.nama} 
                  className="avatar" 
                  style={{ width: 36, height: 36 }}
                />
                <div style={{ overflow: 'hidden', flex: 1 }}>
                  <strong style={{ display: 'block', fontSize: '0.82rem', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                    {currentEmployee?.nama}
                  </strong>
                  <span style={{ fontSize: '0.72rem', color: 'var(--primary-600)', fontWeight: 600 }}>
                    {currentEmployee?.nip}
                  </span>
                </div>
              </div>

              {/* Status Akun Terverifikasi & Tombol Ganti Sandi */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border-color)', paddingTop: 8, marginTop: 4 }}>
                <span className="badge badge-success" style={{ fontSize: '0.68rem', padding: '2px 8px' }}>
                  ✓ Login Aktif
                </span>
                <button
                  type="button"
                  onClick={onOpenGantiPasswordModal}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: '0.72rem',
                    color: 'var(--primary-600)',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 4,
                    fontWeight: 600,
                    padding: '2px 4px'
                  }}
                  title="Ganti kata sandi akun Anda"
                >
                  <Key size={12} />
                  <span>Ganti Sandi</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ================= NAVIGATION MENU ================= */}
        <nav className="sidebar-nav">
          <div className="sidebar-nav-label">
            {isAdmin ? 'Menu Manajemen' : 'Menu Pegawai'}
          </div>

          <button 
            type="button"
            className={`sidebar-nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => handleNavClick('dashboard')}
          >
            <LayoutDashboard size={18} className="nav-icon" />
            <span className="nav-text">
              {isAdmin ? 'Dashboard Rekap' : 'Beranda Saya'}
            </span>
          </button>

          {/* Menu Khusus Admin: Kelola Data Pegawai */}
          {isAdmin && (
            <button 
              type="button"
              className={`sidebar-nav-item ${activeTab === 'pegawai' ? 'active' : ''}`}
              onClick={() => handleNavClick('pegawai')}
            >
              <Users size={18} className="nav-icon" />
              <span className="nav-text">Data Pegawai</span>
              <span className="sidebar-counter" style={{ background: 'var(--primary-600)' }}>
                {employees.length}
              </span>
            </button>
          )}

          {/* Menu Absensi Radius */}
          <button 
            type="button"
            className={`sidebar-nav-item ${activeTab === 'absensi' ? 'active' : ''}`}
            onClick={() => handleNavClick('absensi')}
          >
            <MapPin size={18} className="nav-icon" />
            <span className="nav-text">
              {isAdmin ? 'Monitoring Absensi' : 'Presensi Radius GPS'}
            </span>
            <span className="badge badge-success" style={{ fontSize: '0.68rem', padding: '1px 6px' }}>
              GPS
            </span>
          </button>

          {/* Menu Cuti & Izin */}
          <button 
            type="button"
            className={`sidebar-nav-item ${activeTab === 'cuti' ? 'active' : ''}`}
            onClick={() => handleNavClick('cuti')}
          >
            <CalendarCheck size={18} className="nav-icon" />
            <span className="nav-text">
              {isAdmin ? 'Verifikasi Cuti & Izin' : 'Pengajuan Cuti & Izin'}
            </span>
            {pendingLeaves > 0 && (
              <span className="sidebar-counter" style={{ background: 'var(--accent-gold-500)' }}>
                {pendingLeaves}
              </span>
            )}
          </button>

          {/* Menu Kenaikan Gaji */}
          <button 
            type="button"
            className={`sidebar-nav-item ${activeTab === 'gaji' ? 'active' : ''}`}
            onClick={() => handleNavClick('gaji')}
          >
            <TrendingUp size={18} className="nav-icon" />
            <span className="nav-text">
              {isAdmin ? 'Evaluasi Kenaikan Gaji' : 'Kenaikan Gaji Saya'}
            </span>
            {pendingSalaries > 0 && (
              <span className="sidebar-counter" style={{ background: '#8b5cf6' }}>
                {pendingSalaries}
              </span>
            )}
          </button>

          {/* Menu Khusus Admin: Pengaturan Radius */}
          {isAdmin && (
            <>
              <div className="sidebar-nav-label" style={{ marginTop: 16 }}>Pengaturan Sistem</div>
              <button 
                type="button"
                className="sidebar-nav-item"
                onClick={onOpenSettingsModal}
              >
                <Settings size={18} className="nav-icon" />
                <span className="nav-text">Radius & Jam Kerja</span>
              </button>
            </>
          )}

          {isAdmin && <>
          <button 
            type="button"
            className="sidebar-nav-item"
            onClick={onOpenDbModal}
          >
            <Database size={18} className="nav-icon" />
            <span className="nav-text">Database Real-Time</span>
          </button>

          <button 
            type="button"
            className="sidebar-nav-item"
            onClick={onOpenDeployModal}
          >
            <GithubIcon size={18} />
            <span className="nav-text">GitHub & Vercel</span>
          </button>
          </>}
        </nav>

        {/* Sidebar Footer */}
        <div className="sidebar-footer">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Mode Tampilan:
            </span>
            <button 
              type="button" 
              className="theme-toggle-btn"
              onClick={toggleTheme}
              style={{ width: 30, height: 30 }}
              title={theme === 'dark' ? 'Mode Terang' : 'Mode Gelap'}
            >
              {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
            </button>
          </div>

          {/* Tombol Logout / Keluar Portal */}
          <button 
            type="button" 
            className="btn btn-sm btn-secondary"
            onClick={onLogoutPortal}
            style={{ width: '100%', justifyContent: 'center', gap: 6, fontWeight: 700, color: 'var(--color-danger)', borderColor: 'rgba(239, 68, 68, 0.25)' }}
          >
            <LogOut size={14} />
            <span>Keluar</span>
          </button>
        </div>
      </aside>
    </>
  );
}
