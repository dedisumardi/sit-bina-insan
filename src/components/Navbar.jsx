import { 
  Building2, 
  Users, 
  UserCheck, 
  Moon, 
  Sun, 
  Database, 
  SendHorizontal,
  Settings,
  Sparkles,
  GitBranch
} from 'lucide-react';

const GithubIcon = ({ size = 15 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
  </svg>
);

export default function Navbar({ 
  currentRole, 
  setCurrentRole, 
  currentEmployee, 
  setCurrentEmployee, 
  employees, 
  dbStatus, 
  onOpenDbModal, 
  onOpenDeployModal,
  onOpenSettingsModal,
  theme, 
  toggleTheme 
}) {
  return (
    <header className="navbar">
      <div className="navbar-inner">
        {/* Brand Logo & Name */}
        <div className="brand-section">
          <img src="/logo.jpg" alt="Logo SIT Bina Insan" className="brand-logo-img" />
          <div className="brand-text">
            <h1>
              SIMPEG SIT Bina Insan
              <span className="badge badge-success" style={{ fontSize: '0.68rem', padding: '2px 8px' }}>
                v2.0 Realtime
              </span>
            </h1>
            <p className="brand-tagline">Sistem Informasi Manajemen Kepegawaian & Absensi Radius Geofencing</p>
          </div>
        </div>

        {/* Action Controls & Switcher */}
        <div className="nav-controls">
          {/* Real-time Status Badge */}
          <button 
            type="button" 
            className="realtime-pill" 
            onClick={onOpenDbModal}
            title="Klik untuk konfigurasi Supabase Real-Time Database"
          >
            <span className="pulse-dot"></span>
            <span>{dbStatus.isSupabase ? 'Cloud Supabase Live' : 'Real-Time Sync Aktif'}</span>
            <Database size={13} style={{ marginLeft: 2 }} />
          </button>

          {/* Role Switcher Pill */}
          <div className="role-switcher-box">
            <button 
              type="button"
              className={`role-btn ${currentRole === 'admin' ? 'active' : ''}`}
              onClick={() => setCurrentRole('admin')}
            >
              <Building2 size={14} />
              <span>Admin / HRD</span>
            </button>
            <button 
              type="button"
              className={`role-btn ${currentRole === 'pegawai' ? 'active' : ''}`}
              onClick={() => setCurrentRole('pegawai')}
            >
              <UserCheck size={14} />
              <span>Pegawai</span>
            </button>
          </div>

          {/* If Pegawai Mode, select which employee */}
          {currentRole === 'pegawai' && (
            <select 
              className="user-select-dropdown"
              value={currentEmployee?.id || ''}
              onChange={(e) => {
                const found = employees.find(p => p.id === e.target.value);
                if (found) setCurrentEmployee(found);
              }}
              title="Pilih akun pegawai untuk simulasi"
            >
              {employees.map(p => (
                <option key={p.id} value={p.id}>
                  👤 {p.nama} ({p.jabatan})
                </option>
              ))}
            </select>
          )}

          {/* Quick Config Button */}
          {currentRole === 'admin' && (
            <button 
              type="button" 
              className="icon-action-btn" 
              onClick={onOpenSettingsModal}
              title="Pengaturan Radius & Lokasi Sekolah"
            >
              <Settings size={18} />
            </button>
          )}

          {/* Panduan Deploy GitHub & Vercel */}
          <button 
            type="button" 
            className="btn btn-sm btn-secondary"
            onClick={onOpenDeployModal}
            style={{ gap: 6, fontWeight: 600 }}
          >
            <GithubIcon size={15} />
            <span>GitHub & Vercel</span>
          </button>

          {/* Theme Toggle */}
          <button 
            type="button" 
            className="theme-toggle-btn" 
            onClick={toggleTheme}
            title={theme === 'dark' ? 'Ganti ke Mode Terang' : 'Ganti ke Mode Gelap'}
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </div>
    </header>
  );
}
