import React, { useState, useEffect } from 'react';
import PortalAuth from './components/PortalAuth';
import DatabaseSettingsModal from './components/DatabaseSettingsModal';
import { getPegawai, getDatabaseStatus } from './services/db';
import { CheckCircle2, ArrowRight, UserCheck, ShieldCheck, Sun, Moon } from 'lucide-react';

export default function LoginPage() {
  const [employees, setEmployees] = useState([]);
  const [dbStatus, setDbStatus] = useState(getDatabaseStatus());
  const [isDbModalOpen, setIsDbModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Theme state
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('sit_theme') || 'light';
  });

  // Check existing session
  const [existingSession, setExistingSession] = useState(null);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('sit_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  useEffect(() => {
    async function loadInitial() {
      try {
        const emps = await getPegawai();
        setEmployees(emps || []);
        setDbStatus(getDatabaseStatus());

        const savedPortal = localStorage.getItem('sit_active_portal');
        const savedEmpId = localStorage.getItem('sit_logged_pegawai_id');
        if (savedPortal) {
          const loggedEmp = emps.find(e => e.id === savedEmpId);
          setExistingSession({
            portal: savedPortal,
            employee: loggedEmp
          });
        }
      } catch (err) {
        console.error('Error loading employees on login page:', err);
      }
    }
    loadInitial();
  }, []);

  const showToast = (title, message) => {
    setToastMessage({ title, message, id: Date.now() });
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleSelectPortal = (portal, emp) => {
    localStorage.setItem('sit_active_portal', portal);
    if (emp) {
      localStorage.setItem('sit_logged_pegawai_id', emp.id);
      showToast('Login Berhasil', `Ahlan wa Sahlan, ${emp.nama}! Mengalihkan ke dashboard...`);
    } else {
      localStorage.removeItem('sit_logged_pegawai_id');
      showToast('Login Berhasil', 'Ahlan wa Sahlan! Mengalihkan ke Panel Administrator...');
    }

    // Redirect to main application dashboard
    setTimeout(() => {
      window.location.href = '/';
    }, 600);
  };

  return (
    <div className="app-container" style={{ minHeight: '100vh', position: 'relative' }}>
      {/* Top Bar Floating Buttons (Theme & Direct Dashboard if logged in) */}
      <div style={{ 
        position: 'absolute', 
        top: 20, 
        right: 24, 
        zIndex: 20, 
        display: 'flex', 
        alignItems: 'center', 
        gap: 10 
      }}>
        {existingSession && (
          <button
            type="button"
            className="btn btn-sm btn-primary"
            onClick={() => { window.location.href = '/'; }}
            style={{ fontWeight: 700, gap: 6, boxShadow: 'var(--shadow-md)' }}
          >
            {existingSession.portal === 'admin' ? <ShieldCheck size={15} /> : <UserCheck size={15} />}
            <span>Lanjut ke Dashboard ({existingSession.portal === 'admin' ? 'Admin' : existingSession.employee?.nama?.split(',')[0] || 'Pegawai'})</span>
            <ArrowRight size={14} />
          </button>
        )}

        <button
          type="button"
          className="theme-toggle-btn"
          onClick={toggleTheme}
          style={{ width: 36, height: 36, background: 'var(--bg-card)', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}
          title={theme === 'dark' ? 'Ganti ke Mode Terang' : 'Ganti ke Mode Gelap'}
        >
          {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
        </button>
      </div>

      {/* Main Authentication Component */}
      <PortalAuth 
        employees={employees}
        onSelectPortal={handleSelectPortal}
        theme={theme}
        toggleTheme={toggleTheme}
        dbStatus={dbStatus}
        onOpenDbModal={() => setIsDbModalOpen(true)}
      />

      {/* Database Modal */}
      {isDbModalOpen && (
        <DatabaseSettingsModal 
          dbStatus={dbStatus}
          onClose={() => setIsDbModalOpen(false)}
          onRefreshData={async () => {
            const emps = await getPegawai();
            setEmployees(emps || []);
            setDbStatus(getDatabaseStatus());
          }}
        />
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="toast-container">
          <div className="toast">
            <CheckCircle2 size={20} style={{ color: 'var(--primary-600)', flexShrink: 0 }} />
            <div>
              <strong style={{ display: 'block', fontSize: '0.85rem' }}>{toastMessage.title}</strong>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{toastMessage.message}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
