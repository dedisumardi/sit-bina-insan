import React, { useState } from 'react';
import { Lock, Eye, EyeOff, X, CheckCircle, AlertCircle, Shield } from 'lucide-react';
import { changePegawaiPassword } from '../services/db';

export default function GantiPasswordModal({ currentEmployee, onClose, onSuccess }) {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (newPassword.length < 4) {
      setErrorMessage('Kata sandi baru minimal 4 karakter.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage('Konfirmasi kata sandi baru tidak cocok.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await changePegawaiPassword(currentEmployee.id, oldPassword, newPassword);
      if (res.success) {
        onSuccess('Kata sandi berhasil diperbarui. Silakan gunakan kata sandi baru ini untuk login berikutnya.');
        onClose();
      } else {
        setErrorMessage(res.message);
      }
    } catch (err) {
      setErrorMessage('Gagal memperbarui kata sandi: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-container" style={{ maxWidth: 440 }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ 
              width: 38, 
              height: 38, 
              borderRadius: 10, 
              background: 'rgba(16, 185, 129, 0.12)', 
              color: 'var(--primary-600)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center' 
            }}>
              <Shield size={20} />
            </div>
            <div>
              <h3 className="modal-title">Ganti Kata Sandi Akun</h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Akun: {currentEmployee?.nama} ({currentEmployee?.nip})
              </p>
            </div>
          </div>
          <button type="button" className="modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {errorMessage && (
            <div style={{
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.25)',
              borderRadius: 8,
              padding: '10px 12px',
              fontSize: '0.8rem',
              color: 'var(--color-danger)',
              display: 'flex',
              alignItems: 'center',
              gap: 8
            }}>
              <AlertCircle size={16} style={{ flexShrink: 0 }} />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Kata Sandi Lama */}
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label" style={{ fontSize: '0.82rem', fontWeight: 600 }}>
              Kata Sandi Saat Ini (Lama):
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showOld ? 'text' : 'password'}
                className="form-input"
                placeholder="Masukkan kata sandi lama"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                style={{ paddingRight: 40 }}
                required
              />
              <button
                type="button"
                onClick={() => setShowOld(!showOld)}
                style={{
                  position: 'absolute',
                  right: 10,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--text-muted)'
                }}
              >
                {showOld ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Kata Sandi Baru */}
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label" style={{ fontSize: '0.82rem', fontWeight: 600 }}>
              Kata Sandi Baru:
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showNew ? 'text' : 'password'}
                className="form-input"
                placeholder="Minimal 4 karakter"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                style={{ paddingRight: 40 }}
                required
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                style={{
                  position: 'absolute',
                  right: 10,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--text-muted)'
                }}
              >
                {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Konfirmasi Kata Sandi Baru */}
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label" style={{ fontSize: '0.82rem', fontWeight: 600 }}>
              Ulangi Kata Sandi Baru:
            </label>
            <input
              type={showNew ? 'text' : 'password'}
              className="form-input"
              placeholder="Ketik ulang kata sandi baru"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <div className="modal-footer" style={{ marginTop: 10, padding: 0 }}>
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={isLoading}>
              Batal
            </button>
            <button type="submit" className="btn btn-success" disabled={isLoading}>
              {isLoading ? 'Menyimpan...' : 'Perbarui Kata Sandi'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
