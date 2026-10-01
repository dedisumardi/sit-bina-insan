import React, { useState } from 'react';
import { 
  SendHorizontal, 
  Copy, 
  Check, 
  ExternalLink, 
  CheckCircle2, 
  Terminal, 
  X,
  Sparkles,
  Layers
} from 'lucide-react';

const GithubIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
  </svg>
);

export default function PanduanDeployModal({ onClose }) {
  const [copiedIndex, setCopiedIndex] = useState(null);

  const copyToClipboard = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2500);
  };

  const gitCommands = `# 1. Inisialisasi dan Commit kode aplikasi
git init
git add .
git commit -m "feat: Sistem Kepegawaian & Absensi Radius SIT Bina Insan"

# 2. Hubungkan ke repository GitHub Anda (Ganti URL dengan repo Anda)
git branch -M main
git remote add origin https://github.com/USERNAME/sit-bina-insan.git

# 3. Push ke GitHub
git push -u origin main`;

  const vercelCliCommand = `# Deploy langsung melalui Vercel CLI
npx.cmd -y vercel`;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: 680 }}>
        <div className="modal-header">
          <h3 className="modal-title">
            <GithubIcon size={20} />
            Panduan Push ke GitHub & Deploy ke Vercel
          </h3>
          <button type="button" className="modal-close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          {/* Langkah 1: Push ke GitHub */}
          <div style={{ marginBottom: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <h4 style={{ fontSize: '1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-main)' }}>
                <span style={{ width: 24, height: 24, borderRadius: '50%', background: 'var(--primary-600)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem' }}>1</span>
                Push Kode ke GitHub Repository
              </h4>
              <button 
                type="button" 
                className="btn btn-sm btn-secondary"
                onClick={() => copyToClipboard(gitCommands, 1)}
                style={{ gap: 6 }}
              >
                {copiedIndex === 1 ? <Check size={14} style={{ color: '#10b981' }} /> : <Copy size={14} />}
                <span>{copiedIndex === 1 ? 'Tersalin!' : 'Salin Perintah Git'}</span>
              </button>
            </div>

            <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginBottom: 8 }}>
              Buka terminal PowerShell / Command Prompt di folder proyek ini dan jalankan perintah:
            </p>

            <pre style={{ background: 'var(--slate-900)', color: '#38bdf8', padding: 14, borderRadius: 10, fontSize: '0.82rem', overflowX: 'auto', lineHeight: 1.5, border: '1px solid var(--border-color)' }}>
              {gitCommands}
            </pre>
          </div>

          {/* Langkah 2: Deploy ke Vercel */}
          <div style={{ marginBottom: 24 }}>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-main)', marginBottom: 8 }}>
              <span style={{ width: 24, height: 24, borderRadius: '50%', background: 'var(--primary-600)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem' }}>2</span>
              Deploy ke Vercel (Opsi Terbaik & Otomatis)
            </h4>

            <div style={{ background: 'var(--bg-subtle)', borderRadius: 10, padding: 14, fontSize: '0.85rem', lineHeight: 1.6 }}>
              <p><strong>Cara Deploy 1-Klik dari Dashboard Vercel:</strong></p>
              <ol style={{ paddingLeft: 20, marginTop: 6, display: 'flex', flexDirection: 'column', gap: 4 }}>
                <li>Buka <a href="https://vercel.com" target="_blank" rel="noreferrer" style={{ textDecoration: 'underline', color: 'var(--primary-600)', fontWeight: 600 }}>vercel.com <ExternalLink size={12} style={{ display: 'inline' }} /></a> dan login dengan akun GitHub Anda.</li>
                <li>Klik tombol <strong>"Add New..." ➔ "Project"</strong>.</li>
                <li>Pilih repository <strong>sit-bina-insan</strong> yang baru saja Anda push.</li>
                <li>Framework Preset otomatis terdeteksi sebagai <strong>Vite</strong>.</li>
                <li>(Opsional) Di bagian <strong>Environment Variables</strong>, masukkan:
                  <ul style={{ paddingLeft: 20, marginTop: 4 }}>
                    <li><code>VITE_SUPABASE_URL</code></li>
                    <li><code>VITE_SUPABASE_ANON_KEY</code></li>
                  </ul>
                </li>
                <li>Klik <strong>Deploy</strong>! Dalam waktu ~30 detik situs Anda aktif dengan domain gratis <code>https://sit-bina-insan.vercel.app</code> dan HTTPS SSL otomatis.</li>
              </ol>
            </div>
          </div>

          {/* Alternatif: CLI */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <h4 style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--text-sub)' }}>
                Opsi Alternatif: Deploy via Vercel CLI Langsung
              </h4>
              <button 
                type="button" 
                className="btn btn-sm btn-secondary"
                onClick={() => copyToClipboard(vercelCliCommand, 2)}
                style={{ gap: 6 }}
              >
                {copiedIndex === 2 ? <Check size={14} style={{ color: '#10b981' }} /> : <Copy size={14} />}
                <span>{copiedIndex === 2 ? 'Tersalin!' : 'Salin'}</span>
              </button>
            </div>
            <pre style={{ background: 'var(--slate-900)', color: '#34d399', padding: 12, borderRadius: 8, fontSize: '0.82rem', overflowX: 'auto' }}>
              {vercelCliCommand}
            </pre>
          </div>
        </div>

        <div className="modal-footer">
          <button type="button" className="btn btn-primary" onClick={onClose}>
            Mengerti & Siap Deploy
          </button>
        </div>
      </div>
    </div>
  );
}
