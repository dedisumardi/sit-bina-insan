import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Clock, 
  CalendarCheck, 
  TrendingUp, 
  MapPin, 
  FileText, 
  CheckCircle2, 
  AlertCircle,
  ArrowRight,
  ShieldAlert,
  Sparkles,
  Award,
  DollarSign
} from 'lucide-react';
import { formatRupiah, formatTanggalIndo } from '../utils/geo';

export default function Dashboard({ 
  currentRole, 
  currentEmployee, 
  employees, 
  attendanceList, 
  leaveList, 
  salaryList, 
  officeConfig, 
  setActiveTab 
}) {
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update clock every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const todayStr = new Date().toISOString().split('T')[0];
  const todayAttendance = attendanceList.filter(a => a.tanggal === todayStr);
  const pendingLeaves = leaveList.filter(l => l.status === 'Menunggu Persetujuan');
  const pendingSalaries = salaryList.filter(s => s.status === 'Menunggu Persetujuan');

  // Cek absensi pegawai aktif hari ini
  const myAttendanceToday = currentEmployee 
    ? todayAttendance.find(a => a.pegawai_id === currentEmployee.id)
    : null;

  return (
    <div className="dashboard-view">
      {/* Banner Selamat Datang */}
      <div 
        className="card" 
        style={{ 
          background: 'linear-gradient(135deg, rgba(5, 150, 105, 0.08), rgba(217, 119, 6, 0.05))',
          borderColor: 'rgba(16, 185, 129, 0.25)',
          marginBottom: 24,
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 20, flexWrap: 'wrap' }}>
          <div style={{ maxWidth: 700 }}>
            <span className="badge badge-success" style={{ marginBottom: 10 }}>
              <Sparkles size={12} /> Portal Kepegawaian SIT Bina Insan
            </span>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: 6 }}>
              {currentRole === 'admin' 
                ? 'Selamat Datang di SIMPEG Administrator & HRD' 
                : `Ahlan wa Sahlan, ${currentEmployee?.nama || 'Pegawai'}`}
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: 1.6 }}>
              {currentRole === 'admin' 
                ? 'Kelola data seluruh guru & tenaga pendidik, monitoring kehadiran real-time berbasis radius geofencing, persetujuan cuti & izin, serta evaluasi kenaikan gaji yayasan.'
                : `Anda login sebagai ${currentEmployee?.jabatan || 'Guru'} di unit ${currentEmployee?.divisi || 'SIT Bina Insan'}. Silakan lakukan absensi harian tepat waktu sesuai radius sekolah.`}
            </p>

            {/* Quick Action Buttons */}
            <div style={{ display: 'flex', gap: 10, marginTop: 18, flexWrap: 'wrap' }}>
              <button 
                type="button" 
                className="btn btn-primary"
                onClick={() => setActiveTab('absensi')}
              >
                <MapPin size={16} />
                <span>Absensi Radius Hari Ini</span>
              </button>
              <button 
                type="button" 
                className="btn btn-secondary"
                onClick={() => setActiveTab('cuti')}
              >
                <CalendarCheck size={16} />
                <span>Ajukan Cuti / Izin</span>
              </button>
              {currentRole === 'admin' ? (
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => setActiveTab('pegawai')}
                >
                  <Users size={16} />
                  <span>Kelola Data Pegawai</span>
                </button>
              ) : (
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => setActiveTab('gaji')}
                >
                  <TrendingUp size={16} />
                  <span>Usulan Kenaikan Gaji</span>
                </button>
              )}
            </div>
          </div>

          {/* Jam Digital WIB */}
          <div className="clock-display" style={{ minWidth: 220 }}>
            <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Waktu Server (WIB)
            </div>
            <div className="clock-time">
              {currentTime.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </div>
            <div className="clock-date">
              {formatTanggalIndo(todayStr)}
            </div>
            <div style={{ marginTop: 8, fontSize: '0.76rem', color: 'var(--primary-600)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
              <MapPin size={12} /> Radius Kantor: {officeConfig.radius_meter}m
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="stats-grid">
        <div className="stat-card" style={{ '--stat-color': 'var(--primary-600)' }}>
          <div className="stat-info">
            <span className="stat-label">Total Pegawai</span>
            <span className="stat-value">{employees.length}</span>
            <span className="stat-meta">
              <Users size={13} /> Guru & Staf Aktif
            </span>
          </div>
          <div className="stat-icon-wrapper" style={{ '--stat-bg': 'rgba(16, 185, 129, 0.12)', '--stat-color': '#059669' }}>
            <Users size={24} />
          </div>
        </div>

        <div className="stat-card" style={{ '--stat-color': '#3b82f6' }}>
          <div className="stat-info">
            <span className="stat-label">Kehadiran Hari Ini</span>
            <span className="stat-value">{todayAttendance.length} / {employees.length}</span>
            <span className="stat-meta">
              <CheckCircle2 size={13} style={{ color: '#10b981' }} /> {Math.round((todayAttendance.length / (employees.length || 1)) * 100)}% Presensi Masuk
            </span>
          </div>
          <div className="stat-icon-wrapper" style={{ '--stat-bg': 'rgba(59, 130, 246, 0.12)', '--stat-color': '#2563eb' }}>
            <Clock size={24} />
          </div>
        </div>

        <div 
          className="stat-card" 
          style={{ '--stat-color': 'var(--accent-gold-500)', cursor: 'pointer' }}
          onClick={() => setActiveTab('cuti')}
          title="Klik untuk melihat pengajuan cuti"
        >
          <div className="stat-info">
            <span className="stat-label">Pengajuan Cuti / Izin</span>
            <span className="stat-value">{pendingLeaves.length}</span>
            <span className="stat-meta">
              <AlertCircle size={13} style={{ color: '#f59e0b' }} /> Menunggu Persetujuan
            </span>
          </div>
          <div className="stat-icon-wrapper" style={{ '--stat-bg': 'rgba(245, 158, 11, 0.12)', '--stat-color': '#d97706' }}>
            <CalendarCheck size={24} />
          </div>
        </div>

        <div 
          className="stat-card" 
          style={{ '--stat-color': '#8b5cf6', cursor: 'pointer' }}
          onClick={() => setActiveTab('gaji')}
          title="Klik untuk melihat pengajuan kenaikan gaji"
        >
          <div className="stat-info">
            <span className="stat-label">Pengajuan Kenaikan Gaji</span>
            <span className="stat-value">{pendingSalaries.length}</span>
            <span className="stat-meta">
              <TrendingUp size={13} style={{ color: '#8b5cf6' }} /> Menunggu Review
            </span>
          </div>
          <div className="stat-icon-wrapper" style={{ '--stat-bg': 'rgba(139, 92, 246, 0.12)', '--stat-color': '#7c3aed' }}>
            <Award size={24} />
          </div>
        </div>
      </div>

      {/* Baris Khusus Pegawai Aktif (Jika login sebagai pegawai) */}
      {currentRole === 'pegawai' && currentEmployee && (
        <div className="card" style={{ marginBottom: 24, borderLeft: '4px solid var(--primary-600)' }}>
          <div className="card-header">
            <div>
              <h3 className="card-title">
                <CheckCircle2 size={18} style={{ color: 'var(--primary-600)' }} />
                Status Kehadiran & Profil Anda Hari Ini
              </h3>
              <p className="card-subtitle">
                {currentEmployee.nama} | NIP: {currentEmployee.nip}
              </p>
            </div>
            <div>
              {myAttendanceToday ? (
                <span className="badge badge-success" style={{ fontSize: '0.85rem', padding: '6px 14px' }}>
                  ✓ Sudah Absen Masuk ({myAttendanceToday.waktu_masuk})
                </span>
              ) : (
                <span className="badge badge-warning" style={{ fontSize: '0.85rem', padding: '6px 14px' }}>
                  ⚠ Belum Absen Masuk Hari Ini
                </span>
              )}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
            <div style={{ padding: 14, background: 'var(--bg-subtle)', borderRadius: 10 }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>Gaji Pokok Aktif</span>
              <strong style={{ fontSize: '1.25rem', color: 'var(--text-main)' }}>{formatRupiah(currentEmployee.gaji_pokok)}</strong>
            </div>
            <div style={{ padding: 14, background: 'var(--bg-subtle)', borderRadius: 10 }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>Sisa Cuti Tahunan</span>
              <strong style={{ fontSize: '1.25rem', color: 'var(--primary-600)' }}>{currentEmployee.sisa_cuti || 12} Hari</strong>
            </div>
            <div style={{ padding: 14, background: 'var(--bg-subtle)', borderRadius: 10 }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>Status Absen Pulang</span>
              <strong style={{ fontSize: '1.1rem', color: 'var(--text-main)' }}>
                {myAttendanceToday?.waktu_pulang ? `Sudah (${myAttendanceToday.waktu_pulang})` : 'Belum Pulang'}
              </strong>
            </div>
          </div>
        </div>
      )}

      {/* Grid 2 Kolom: Aktivitas Kehadiran Terkini & Log Pengajuan */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: 24 }}>
        {/* Kolom Kiri: Presensi Terkini Hari Ini */}
        <div className="card">
          <div className="card-header">
            <div>
              <h3 className="card-title">
                <Clock size={18} style={{ color: 'var(--primary-600)' }} />
                Presensi Masuk Terkini
              </h3>
              <p className="card-subtitle">Data absen langsung tersinkronisasi secara real-time</p>
            </div>
            <button 
              type="button" 
              className="btn btn-sm btn-secondary"
              onClick={() => setActiveTab('absensi')}
            >
              Lihat Peta <ArrowRight size={14} />
            </button>
          </div>

          {todayAttendance.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '36px 16px', color: 'var(--text-muted)' }}>
              <Clock size={36} style={{ opacity: 0.3, marginBottom: 10 }} />
              <p>Belum ada presensi yang tercatat hari ini.</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Pegawai</th>
                    <th>Waktu</th>
                    <th>Jarak Radius</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {todayAttendance.slice(0, 5).map(absen => (
                    <tr key={absen.id}>
                      <td>
                        <strong style={{ display: 'block', fontSize: '0.88rem' }}>{absen.nama_pegawai}</strong>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{absen.catatan || 'Hadir bertugas'}</span>
                      </td>
                      <td>
                        <span className="badge badge-neutral" style={{ fontVariantNumeric: 'tabular-nums' }}>
                          {absen.waktu_masuk}
                        </span>
                      </td>
                      <td>
                        <span style={{ fontSize: '0.8rem', color: 'var(--primary-600)', fontWeight: 600 }}>
                          📍 {absen.jarak_meter} m
                        </span>
                      </td>
                      <td>
                        <span className="badge badge-success">
                          {absen.status_kehadiran}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Kolom Kanan: Pengajuan Menunggu Verifikasi */}
        <div className="card">
          <div className="card-header">
            <div>
              <h3 className="card-title">
                <CalendarCheck size={18} style={{ color: 'var(--accent-gold-500)' }} />
                Pengajuan Perlu Tindakan
              </h3>
              <p className="card-subtitle">Pengajuan Cuti, Izin & Kenaikan Gaji terbaru</p>
            </div>
            <span className="badge badge-warning">
              {pendingLeaves.length + pendingSalaries.length} Pending
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {pendingLeaves.length === 0 && pendingSalaries.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '36px 16px', color: 'var(--text-muted)' }}>
                <CheckCircle2 size={36} style={{ color: 'var(--primary-500)', opacity: 0.5, marginBottom: 10 }} />
                <p>Semua pengajuan telah diproses / tidak ada pending!</p>
              </div>
            ) : (
              <>
                {pendingLeaves.map(leave => (
                  <div 
                    key={leave.id} 
                    style={{ 
                      padding: 14, 
                      borderRadius: 10, 
                      background: 'var(--bg-subtle)', 
                      border: '1px solid var(--border-color)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: 12
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                        <span className="badge badge-info" style={{ fontSize: '0.72rem' }}>{leave.jenis}</span>
                        <strong style={{ fontSize: '0.9rem' }}>{leave.nama_pegawai}</strong>
                      </div>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                        {leave.alasan} ({leave.jumlah_hari} hari: {leave.tanggal_mulai})
                      </p>
                    </div>
                    <button 
                      type="button" 
                      className="btn btn-sm btn-secondary"
                      onClick={() => setActiveTab('cuti')}
                    >
                      Proses
                    </button>
                  </div>
                ))}

                {pendingSalaries.map(sal => (
                  <div 
                    key={sal.id} 
                    style={{ 
                      padding: 14, 
                      borderRadius: 10, 
                      background: 'var(--bg-subtle)', 
                      border: '1px solid var(--border-color)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: 12
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                        <span className="badge badge-warning" style={{ fontSize: '0.72rem' }}>Kenaikan Gaji</span>
                        <strong style={{ fontSize: '0.9rem' }}>{sal.nama_pegawai}</strong>
                      </div>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                        Usulan: {formatRupiah(sal.gaji_lama)} ➔ <strong>{formatRupiah(sal.gaji_baru)}</strong> (+{sal.persentase}%)
                      </p>
                    </div>
                    <button 
                      type="button" 
                      className="btn btn-sm btn-gold"
                      onClick={() => setActiveTab('gaji')}
                    >
                      Review
                    </button>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
