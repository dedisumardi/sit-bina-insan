import React, { useState, useEffect } from 'react';
import { ArrowRight, UserCheck, ShieldCheck, Sun, Moon, Eye, EyeOff } from 'lucide-react';
import { authenticatePegawai, authenticateAdmin } from './services/db';
import { portalRole, dashboardUrl, readSession, saveSession } from './services/portal';

export default function LoginPage() {
  const role = portalRole();
  const isAdmin = role === 'admin';
  const [year] = useState(() => new Date().getFullYear());
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [theme, setTheme] = useState(() => localStorage.getItem('sit_theme') || 'light');
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('sit_theme', theme);
    document.title = 'Login ' + (isAdmin ? 'Admin' : 'Pegawai') + ' — SIT Bina Insan';
  }, [theme, isAdmin]);
  async function submit(event) {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      const result = isAdmin ? await authenticateAdmin(identifier, password) : await authenticatePegawai(identifier, password);
      if (!result.success) { setError(result.message); return; }
      saveSession(role, result.employee);
      window.location.assign(dashboardUrl(role));
    } catch {
      setError('Login belum berhasil. Silakan coba kembali.');
    } finally { setLoading(false); }
  }
  return <div className="auth-portal-wrapper">
    <div className="auth-bg-overlay" />
    <div className="auth-portal-container" style={{ maxWidth: 520, width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
        <button className="theme-toggle-btn" type="button" aria-label="Ganti tema" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </div>
      <header className="auth-header">
        <img src="/logo.jpg" alt="Logo SIT Bina Insan" className="auth-logo-img" />
        <h1 className="auth-title">{isAdmin ? 'PORTAL ADMIN' : 'PORTAL PEGAWAI'}</h1>
        <p className="auth-subtitle">SIT Bina Insan</p>
      </header>
      <section className={'portal-card ' + (isAdmin ? 'admin-card' : 'pegawai-card')}>
        <div className="portal-card-top">
          <div className={'portal-icon-box ' + (isAdmin ? 'admin-icon-box' : 'pegawai-icon-box')}>
            {isAdmin ? <ShieldCheck size={32} /> : <UserCheck size={32} />}
          </div>
        </div>
        <h2 className="portal-card-title">{isAdmin ? 'Login Administrator' : 'Login Pegawai'}</h2>
        <p className="portal-card-desc">{isAdmin ? 'Masuk untuk mengelola data pegawai, memantau absensi, dan memproses pengajuan.' : 'Masuk untuk melakukan presensi, mengajukan cuti, dan melihat informasi kepegawaian Anda.'}</p>
        {error && <p role="alert" style={{ color: 'var(--color-danger)', marginBottom: 16 }}>{error}</p>}
        <form onSubmit={submit} style={{ display: 'grid', gap: 18 }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label" htmlFor="identifier">{isAdmin ? 'Username Admin' : 'NIP atau Email'}</label>
            <input id="identifier" className="form-input" autoComplete="username" value={identifier} onChange={e => setIdentifier(e.target.value)} required />
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label" htmlFor="password">Kata Sandi</label>
            <div style={{ position: 'relative' }}>
              <input id="password" className="form-input" type={visible ? 'text' : 'password'} autoComplete="current-password" style={{ paddingRight: 48 }} value={password} onChange={e => setPassword(e.target.value)} required />
              <button type="button" aria-label={visible ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'} onClick={() => setVisible(!visible)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', border: 0, background: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>{visible ? <EyeOff size={18} /> : <Eye size={18} />}</button>
            </div>
          </div>
          <button className={'btn btn-portal ' + (isAdmin ? 'btn-primary' : 'btn-success')} disabled={loading} type="submit">{loading ? 'Memverifikasi...' : isAdmin ? 'Masuk sebagai Admin' : 'Masuk sebagai Pegawai'}<ArrowRight size={18} /></button>
        </form>
        {readSession(role) && <a className="btn btn-secondary" style={{ marginTop: 16, width: '100%' }} href={dashboardUrl(role)}>Lanjut ke dashboard</a>}
      </section>
      <footer className="auth-footer"><p>© {year} SIT Bina Insan</p></footer>
    </div>
  </div>;
}
