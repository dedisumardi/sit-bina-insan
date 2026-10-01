import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import Dashboard from './components/Dashboard';
import PegawaiList from './components/PegawaiList';
import AbsensiRadius from './components/AbsensiRadius';
import CutiIzin from './components/CutiIzin';
import KenaikanGaji from './components/KenaikanGaji';
import PengaturanKantorModal from './components/PengaturanKantorModal';
import DatabaseSettingsModal from './components/DatabaseSettingsModal';
import PanduanDeployModal from './components/PanduanDeployModal';

import { 
  getPegawai, 
  addPegawai, 
  updatePegawai, 
  deletePegawai,
  getAbsensi,
  addAbsensi,
  updateAbsensiPulang,
  getCutiIzin,
  addCutiIzin,
  updateStatusCutiIzin,
  getKenaikanGaji,
  addKenaikanGaji,
  updateStatusKenaikanGaji,
  getKonfigurasiKantor,
  updateKonfigurasiKantor,
  subscribeToRealtime,
  getDatabaseStatus
} from './services/db';

import { 
  LayoutDashboard, 
  Users, 
  MapPin, 
  CalendarCheck, 
  TrendingUp, 
  Bell,
  CheckCircle2,
  Info
} from 'lucide-react';

export default function App() {
  // Theme state
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('sit_theme') || 'light';
  });

  // Role & Active User
  const [currentRole, setCurrentRole] = useState('admin'); // 'admin' | 'pegawai'
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);

  // Active Tab
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard' | 'pegawai' | 'absensi' | 'cuti' | 'gaji'

  // Data States
  const [employees, setEmployees] = useState([]);
  const [attendanceList, setAttendanceList] = useState([]);
  const [leaveList, setLeaveList] = useState([]);
  const [salaryList, setSalaryList] = useState([]);
  const [officeConfig, setOfficeConfig] = useState({
    nama_lokasi: 'Kampus SIT Bina Insan',
    latitude: -6.208800,
    longitude: 106.845600,
    radius_meter: 100,
    jam_masuk: '07:15',
    jam_pulang: '15:30',
    toleransi_menit: 15
  });

  // Modal States
  const [isDbModalOpen, setIsDbModalOpen] = useState(false);
  const [isDeployModalOpen, setIsDeployModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Toast notification state
  const [toastMessage, setToastMessage] = useState(null);

  // Database Connection Status
  const [dbStatus, setDbStatus] = useState(getDatabaseStatus());

  // Derived current active employee
  const currentEmployee = employees.find(e => e.id === selectedEmployeeId) || employees[0] || null;
  const setCurrentEmployee = (emp) => setSelectedEmployeeId(emp?.id || null);

  // Set Theme on root element
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('sit_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const showToast = (title, message) => {
    setToastMessage({ title, message, id: Date.now() });
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Muat seluruh data dari DB layer (Stabil, tanpa dependensi melingkar)
  const loadAllData = useCallback(async () => {
    try {
      const [p, a, c, g, k] = await Promise.all([
        getPegawai(),
        getAbsensi(),
        getCutiIzin(),
        getKenaikanGaji(),
        getKonfigurasiKantor()
      ]);

      setEmployees(p || []);
      setAttendanceList(a || []);
      setLeaveList(c || []);
      setSalaryList(g || []);
      if (k) setOfficeConfig(k);
      setDbStatus(getDatabaseStatus());
    } catch (err) {
      console.error('Error loading data:', err);
    }
  }, []);

  // Initial Load & Realtime subscription
  useEffect(() => {
    loadAllData();

    // Dengarkan event sinkronisasi real-time
    const unsubscribe = subscribeToRealtime((event) => {
      loadAllData();
      if (event && event.table) {
        let msg = 'Data diperbarui secara real-time';
        if (event.table === 'absensi') msg = 'Presensi baru tercatat secara real-time!';
        if (event.table === 'cuti_izin') msg = 'Pembaruan data cuti & izin pegawai!';
        if (event.table === 'kenaikan_gaji') msg = 'Pembaruan status kenaikan gaji pegawai!';
        if (event.table === 'pegawai') msg = 'Data pegawai diperbarui!';
        showToast('Sinkronisasi Real-Time', msg);
      }
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [loadAllData]);

  // Action Wrappers
  const handleAddEmployee = async (data) => {
    await addPegawai(data);
    await loadAllData();
    showToast('Pegawai Ditambahkan', `${data.nama} berhasil didaftarkan ke sistem.`);
  };

  const handleUpdateEmployee = async (id, data) => {
    await updatePegawai(id, data);
    await loadAllData();
    showToast('Data Diperbarui', 'Data pegawai berhasil diperbarui.');
  };

  const handleDeleteEmployee = async (id) => {
    await deletePegawai(id);
    await loadAllData();
    showToast('Pegawai Dihapus', 'Data pegawai telah dihapus dari sistem.');
  };

  const handleAddAbsensi = async (data) => {
    await addAbsensi(data);
    await loadAllData();
    showToast('Presensi Berhasil', `Absen Masuk ${data.nama_pegawai} berhasil dicatat.`);
  };

  const handleUpdateAbsensiPulang = async (id, waktuPulang, catatan) => {
    await updateAbsensiPulang(id, waktuPulang, catatan);
    await loadAllData();
    showToast('Absen Pulang Tercatat', 'Terima kasih, presensi kepulangan berhasil disimpan.');
  };

  const handleAddLeave = async (data) => {
    await addCutiIzin(data);
    await loadAllData();
    showToast('Pengajuan Terkirim', `Permohonan ${data.jenis} berhasil diajukan dan menunggu persetujuan.`);
  };

  const handleUpdateLeaveStatus = async (id, status, catatanAdmin) => {
    await updateStatusCutiIzin(id, status, catatanAdmin);
    await loadAllData();
    showToast('Status Cuti Diperbarui', `Permohonan cuti telah berstatus: ${status}`);
  };

  const handleAddSalaryRequest = async (data) => {
    await addKenaikanGaji(data);
    await loadAllData();
    showToast('Usulan Gaji Terkirim', `Usulan kenaikan gaji untuk ${data.nama_pegawai} berhasil dikirim ke pimpinan yayasan.`);
  };

  const handleUpdateSalaryStatus = async (id, status, catatanPimpinan, gajiBaruApproved) => {
    await updateStatusKenaikanGaji(id, status, catatanPimpinan, gajiBaruApproved);
    await loadAllData();
    showToast('Keputusan Kenaikan Gaji', `Usulan gaji telah berstatus: ${status}`);
  };

  const handleSaveOfficeConfig = async (newConfig) => {
    await updateKonfigurasiKantor(newConfig);
    setOfficeConfig(newConfig);
    showToast('Konfigurasi Disimpan', 'Titik koordinat dan radius sekolah berhasil diperbarui.');
  };

  // Badge counters
  const pendingLeavesCount = leaveList.filter(l => l.status === 'Menunggu Persetujuan').length;
  const pendingSalaryCount = salaryList.filter(s => s.status === 'Menunggu Persetujuan').length;

  return (
    <div className="app-layout">
      {/* Left Sidebar Menu */}
      <Sidebar 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentRole={currentRole}
        setCurrentRole={setCurrentRole}
        currentEmployee={currentEmployee}
        setCurrentEmployee={setCurrentEmployee}
        employees={employees}
        leaveList={leaveList}
        salaryList={salaryList}
        dbStatus={dbStatus}
        onOpenDbModal={() => setIsDbModalOpen(true)}
        onOpenDeployModal={() => setIsDeployModalOpen(true)}
        onOpenSettingsModal={() => setIsSettingsModalOpen(true)}
        theme={theme}
        toggleTheme={toggleTheme}
        isMobileOpen={isMobileSidebarOpen}
        setIsMobileOpen={setIsMobileSidebarOpen}
      />

      {/* Main Content Area */}
      <div className="main-wrapper">
        <Topbar 
          activeTab={activeTab}
          onToggleMobileSidebar={() => setIsMobileSidebarOpen(prev => !prev)}
          dbStatus={dbStatus}
          onOpenDbModal={() => setIsDbModalOpen(true)}
          currentRole={currentRole}
          currentEmployee={currentEmployee}
        />

        <main className="main-content">
          {activeTab === 'dashboard' && (
            <Dashboard 
              currentRole={currentRole}
              currentEmployee={currentEmployee}
              employees={employees}
              attendanceList={attendanceList}
              leaveList={leaveList}
              salaryList={salaryList}
              officeConfig={officeConfig}
              setActiveTab={setActiveTab}
            />
          )}

          {activeTab === 'pegawai' && (
            <PegawaiList 
              employees={employees}
              onAddEmployee={handleAddEmployee}
              onUpdateEmployee={handleUpdateEmployee}
              onDeleteEmployee={handleDeleteEmployee}
              currentRole={currentRole}
            />
          )}

          {activeTab === 'absensi' && (
            <AbsensiRadius 
              currentEmployee={currentEmployee}
              attendanceList={attendanceList}
              officeConfig={officeConfig}
              onAddAbsensi={handleAddAbsensi}
              onUpdateAbsensiPulang={handleUpdateAbsensiPulang}
              onOpenSettingsModal={() => setIsSettingsModalOpen(true)}
              currentRole={currentRole}
            />
          )}

          {activeTab === 'cuti' && (
            <CutiIzin 
              currentEmployee={currentEmployee}
              employees={employees}
              leaveList={leaveList}
              onAddLeave={handleAddLeave}
              onUpdateLeaveStatus={handleUpdateLeaveStatus}
              currentRole={currentRole}
            />
          )}

          {activeTab === 'gaji' && (
            <KenaikanGaji 
              currentEmployee={currentEmployee}
              employees={employees}
              salaryList={salaryList}
              onAddSalaryRequest={handleAddSalaryRequest}
              onUpdateSalaryStatus={handleUpdateSalaryStatus}
              currentRole={currentRole}
            />
          )}
        </main>
      </div>

      {/* Floating Real-time Toast Notification */}
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

      {/* Modals */}
      {isSettingsModalOpen && (
        <PengaturanKantorModal 
          officeConfig={officeConfig}
          onSaveConfig={handleSaveOfficeConfig}
          onClose={() => setIsSettingsModalOpen(false)}
        />
      )}

      {isDbModalOpen && (
        <DatabaseSettingsModal 
          dbStatus={dbStatus}
          onClose={() => setIsDbModalOpen(false)}
          onRefreshData={loadAllData}
        />
      )}

      {isDeployModalOpen && (
        <PanduanDeployModal 
          onClose={() => setIsDeployModalOpen(false)}
        />
      )}
    </div>
  );
}
