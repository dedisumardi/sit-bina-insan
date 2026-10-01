import React, { useState, useEffect } from 'react';
import { 
  Menu, 
  Clock, 
  MapPin, 
  Calendar, 
  Database, 
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { formatTanggalIndo } from '../utils/geo';

export default function Topbar({ 
  activeTab, 
  onToggleMobileSidebar, 
  dbStatus, 
  onOpenDbModal, 
  currentRole,
  currentEmployee 
}) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const tabTitles = {
    dashboard: 'Dashboard Utama & Ringkasan',
    pegawai: 'Direktori Data Pegawai SIT Bina Insan',
    absensi: 'Presensi Harian Berbasis Radius Geofence',
    cuti: 'Pengajuan Cuti & Izin Kerja',
    gaji: 'Pengajuan & Evaluasi Kenaikan Gaji'
  };

  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <header className="topbar">
      <div className="topbar-left">
        {/* Mobile Hamburger Menu */}
        <button 
          type="button" 
          className="mobile-menu-btn"
          onClick={onToggleMobileSidebar}
          title="Buka Menu Sidebar"
        >
          <Menu size={20} />
        </button>

        {/* Title & Breadcrumb */}
        <div>
          <div className="topbar-breadcrumb">
            <span>SIT Bina Insan</span>
            <span>/</span>
            <span style={{ color: 'var(--primary-600)', fontWeight: 600 }}>
              {currentRole === 'admin' ? 'Administrator' : currentEmployee?.nama || 'Pegawai'}
            </span>
          </div>
          <h1 className="topbar-title">
            {tabTitles[activeTab] || 'SIMPEG SIT Bina Insan'}
          </h1>
        </div>
      </div>

      <div className="topbar-right">
        {/* Real-time Indicator pill */}
        <button 
          type="button" 
          className="realtime-pill" 
          onClick={currentRole === 'admin' ? onOpenDbModal : undefined}
          style={{ cursor: 'pointer' }}
        >
          <span className="pulse-dot"></span>
          <span>{dbStatus.isSupabase ? 'Cloud Supabase' : 'Real-Time Sync'}</span>
        </button>

        {/* Live Clock WIB */}
        <div className="topbar-clock">
          <Clock size={14} style={{ color: 'var(--primary-600)' }} />
          <span style={{ fontVariantNumeric: 'tabular-nums', fontWeight: 700 }}>
            {time.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })} WIB
          </span>
          <span className="topbar-date">
            ({formatTanggalIndo(todayStr).split(',')[0]})
          </span>
        </div>
      </div>
    </header>
  );
}
