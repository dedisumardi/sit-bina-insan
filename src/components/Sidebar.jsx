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
  Sparkles,
  ChevronRight,
  ShieldCheck,
  X
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
  setCurrentRole,
  currentEmployee,
  setCurrentEmployee,
  employees,
  leaveList,
  salaryList,
  dbStatus,
  onOpenDbModal,
  onOpenDeployModal,
  onOpenSettingsModal,
  theme,
  toggleTheme,
  isMobileOpen,
  setIsMobileOpen
}) {
  const pendingLeaves = leaveList.filter(l => l.status === 'Menunggu Persetujuan').length;
  const pendingSalaries = salaryList.filter(s => s.status === 'Menunggu Persetujuan').length;

  const handleNavClick = (tab) => {
    setActiveTab(tab);
    if (setIsMobileOpen) setIsMobileOpen(false);
  };

  return (
    <>
      {/* Backdrop for mobile */}
      {isMobileOpen && (
        <div 
          className="sidebar-backdrop" 
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      <aside className={`app-sidebar ${isMobileOpen ? 'mobile-open' : ''}`}>
        {/* Brand Header */}
        <div className="sidebar-brand">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <img src="/logo.jpg" alt="Logo SIT Bina Insan" className="sidebar-logo-img" />
            <div>
              <h2 className="sidebar-brand-title">SIT BINA INSAN</h2>
              <p className="sidebar-brand-sub">SIMPEG & Presensi Radius</p>
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
        <div style={{ padding: '0 16px 12px' }}>
          <button 
            type="button" 
            className="sidebar-realtime-pill" 
            onClick={onOpenDbModal}
            title="Klik untuk konfigurasi Supabase Real-Time"
          >
            <span className="pulse-dot"></span>
            <span style={{ flex: 1, textAlign: 'left' }}>
              {dbStatus.isSupabase ? 'Cloud Supabase Live' : 'Real-Time Sync Aktif'}
            </span>
            <Database size={13} style={{ opacity: 0.7 }} />
          </button>
        </div>

        {/* Role Switcher Box */}
        <div style={{ padding: '0 16px 16px' }}>
          <div className="role-switcher-box" style={{ width: '100%', justifyContent: 'space-between' }}>
            <button 
              type="button"
              className={`role-btn ${currentRole === 'admin' ? 'active' : ''}`}
              onClick={() => setCurrentRole('admin')}
              style={{ flex: 1, justifyContent: 'center' }}
            >
              <Building2 size={13} />
              <span>Admin / HRD</span>
            </button>
            <button 
              type="button"
              className={`role-btn ${currentRole === 'pegawai' ? 'active' : ''}`}
              onClick={() => setCurrentRole('pegawai')}
              style={{ flex: 1, justifyContent: 'center' }}
            >
              <UserCheck size={13} />
              <span>Pegawai</span>
            </button>
          </div>

          {/* If Pegawai Mode, select which employee */}
          {currentRole === 'pegawai' && (
            <div style={{ marginTop: 10 }}>
              <label style={{ display: 'block', fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: 4, fontWeight: 700, textTransform: 'uppercase' }}>
                Akun Pegawai:
              </label>
              <select 
                className="user-select-dropdown"
                style={{ width: '100%' }}
                value={currentEmployee?.id || ''}
                onChange={(e) => {
                  const found = employees.find(p => p.id === e.target.value);
                  if (found) setCurrentEmployee(found);
                }}
              >
                {employees.map(p => (
                  <option key={p.id} value={p.id}>
                    👤 {p.nama}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Navigation Menu Links */}
        <nav className="sidebar-nav">
          <div className="sidebar-nav-label">Menu Utama</div>

          <button 
            type="button"
            className={`sidebar-nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => handleNavClick('dashboard')}
          >
            <LayoutDashboard size={18} className="nav-icon" />
            <span className="nav-text">Dashboard Utama</span>
          </button>

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

          <button 
            type="button"
            className={`sidebar-nav-item ${activeTab === 'absensi' ? 'active' : ''}`}
            onClick={() => handleNavClick('absensi')}
          >
            <MapPin size={18} className="nav-icon" />
            <span className="nav-text">Absensi Radius</span>
            <span className="badge badge-success" style={{ fontSize: '0.68rem', padding: '1px 6px' }}>
              GPS
            </span>
          </button>

          <button 
            type="button"
            className={`sidebar-nav-item ${activeTab === 'cuti' ? 'active' : ''}`}
            onClick={() => handleNavClick('cuti')}
          >
            <CalendarCheck size={18} className="nav-icon" />
            <span className="nav-text">Pengajuan Cuti & Izin</span>
            {pendingLeaves > 0 && (
              <span className="sidebar-counter" style={{ background: 'var(--accent-gold-500)' }}>
                {pendingLeaves}
              </span>
            )}
          </button>

          <button 
            type="button"
            className={`sidebar-nav-item ${activeTab === 'gaji' ? 'active' : ''}`}
            onClick={() => handleNavClick('gaji')}
          >
            <TrendingUp size={18} className="nav-icon" />
            <span className="nav-text">Kenaikan Gaji</span>
            {pendingSalaries > 0 && (
              <span className="sidebar-counter" style={{ background: '#8b5cf6' }}>
                {pendingSalaries}
              </span>
            )}
          </button>

          <div className="sidebar-nav-label" style={{ marginTop: 18 }}>Pengaturan & Bantuan</div>

          {currentRole === 'admin' && (
            <button 
              type="button"
              className="sidebar-nav-item"
              onClick={onOpenSettingsModal}
            >
              <Settings size={18} className="nav-icon" />
              <span className="nav-text">Radius & Jam Kerja</span>
            </button>
          )}

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
        </nav>

        {/* Sidebar Footer User & Theme Profile */}
        <div className="sidebar-footer">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Mode Tampilan:
            </span>
            <button 
              type="button" 
              className="theme-toggle-btn"
              onClick={toggleTheme}
              style={{ width: 32, height: 32 }}
              title={theme === 'dark' ? 'Ganti ke Mode Terang' : 'Ganti ke Mode Gelap'}
            >
              {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
            </button>
          </div>

          <div className="sidebar-user-card">
            <img 
              src={currentEmployee?.foto_url || '/logo.jpg'} 
              alt="Profil User" 
              className="avatar"
              style={{ width: 36, height: 36 }}
            />
            <div style={{ overflow: 'hidden', flex: 1 }}>
              <strong style={{ display: 'block', fontSize: '0.82rem', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                {currentRole === 'admin' ? 'Administrator HRD' : currentEmployee?.nama}
              </strong>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block' }}>
                {currentRole === 'admin' ? 'Yayasan Bina Insan' : currentEmployee?.jabatan}
              </span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
