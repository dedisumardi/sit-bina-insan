import React, { useState } from 'react';
import { 
  Settings, 
  MapPin, 
  Clock, 
  Save, 
  Navigation, 
  X,
  Compass,
  AlertCircle
} from 'lucide-react';

export default function PengaturanKantorModal({ 
  officeConfig, 
  onSaveConfig, 
  onClose 
}) {
  const [formData, setFormData] = useState({
    nama_lokasi: officeConfig.nama_lokasi || 'Kampus SIT Bina Insan',
    latitude: officeConfig.latitude || -6.2088,
    longitude: officeConfig.longitude || 106.8456,
    radius_meter: officeConfig.radius_meter || 100,
    jam_masuk: officeConfig.jam_masuk || '07:15',
    jam_pulang: officeConfig.jam_pulang || '15:30',
    toleransi_menit: officeConfig.toleransi_menit || 15
  });

  const [isGettingCurrentPos, setIsGettingCurrentPos] = useState(false);

  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation tidak didukung di browser ini.');
      return;
    }
    setIsGettingCurrentPos(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setFormData({
          ...formData,
          latitude: Number(pos.coords.latitude.toFixed(6)),
          longitude: Number(pos.coords.longitude.toFixed(6))
        });
        setIsGettingCurrentPos(false);
      },
      (err) => {
        alert('Gagal mengambil GPS: ' + err.message);
        setIsGettingCurrentPos(false);
      },
      { enableHighAccuracy: true }
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSaveConfig({
      ...formData,
      latitude: Number(formData.latitude),
      longitude: Number(formData.longitude),
      radius_meter: Number(formData.radius_meter),
      toleransi_menit: Number(formData.toleransi_menit)
    });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: 580 }}>
        <div className="modal-header">
          <h3 className="modal-title">
            <Settings size={20} style={{ color: 'var(--primary-600)' }} />
            Pengaturan Radius & Lokasi Sekolah
          </h3>
          <button type="button" className="modal-close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label className="form-label">Nama Titik Presensi / Sekolah</label>
              <input 
                type="text" 
                className="form-input" 
                value={formData.nama_lokasi}
                onChange={(e) => setFormData({ ...formData, nama_lokasi: e.target.value })}
                required
              />
            </div>

            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label">Latitude Titik Kantor</label>
                <input 
                  type="number" 
                  step="0.000001" 
                  className="form-input" 
                  value={formData.latitude}
                  onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Longitude Titik Kantor</label>
                <input 
                  type="number" 
                  step="0.000001" 
                  className="form-input" 
                  value={formData.longitude}
                  onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                  required
                />
              </div>
            </div>

            <div style={{ marginBottom: 18 }}>
              <button 
                type="button" 
                className="btn btn-sm btn-secondary"
                onClick={handleGetCurrentLocation}
                disabled={isGettingCurrentPos}
                style={{ width: '100%', gap: 6 }}
              >
                <Navigation size={14} />
                <span>{isGettingCurrentPos ? 'Mendeteksi Posisi...' : 'Gunakan Koordinat Posisi Saya Saat Ini'}</span>
              </button>
            </div>

            <div className="form-group">
              <label className="form-label">
                Radius Toleransi Kehadiran (Meter): <strong>{formData.radius_meter} Meter</strong>
              </label>
              <input 
                type="range" 
                min="20" 
                max="500" 
                step="10"
                value={formData.radius_meter}
                onChange={(e) => setFormData({ ...formData, radius_meter: Number(e.target.value) })}
                style={{ width: '100%', accentColor: 'var(--primary-600)', margin: '8px 0' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                <span>Ketat (20m)</span>
                <span>Normal (100m)</span>
                <span>Luas (500m)</span>
              </div>
            </div>

            <div className="form-grid-3">
              <div className="form-group">
                <label className="form-label">Jam Masuk</label>
                <input 
                  type="time" 
                  className="form-input" 
                  value={formData.jam_masuk}
                  onChange={(e) => setFormData({ ...formData, jam_masuk: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Jam Pulang</label>
                <input 
                  type="time" 
                  className="form-input" 
                  value={formData.jam_pulang}
                  onChange={(e) => setFormData({ ...formData, jam_pulang: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Toleransi (Menit)</label>
                <input 
                  type="number" 
                  className="form-input" 
                  min="0"
                  max="60"
                  value={formData.toleransi_menit}
                  onChange={(e) => setFormData({ ...formData, toleransi_menit: e.target.value })}
                  required
                />
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Batal
            </button>
            <button type="submit" className="btn btn-primary">
              <Save size={15} /> Simpan Konfigurasi
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
