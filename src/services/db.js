/**
 * db.js - Layer Database Real-Time Terpadu
 * Mendukung Supabase Cloud Realtime + Smart Local Realtime (Multi-Tab BroadcastChannel)
 */
import { createClient } from '@supabase/supabase-js';

// Saluran sinkronisasi antar-tab browser
const broadcast = typeof BroadcastChannel !== 'undefined' ? new BroadcastChannel('sit_simpeg_realtime') : null;

// Konfigurasi Kantor SIT Bina Insan Default
const DEFAULT_KONFIGURASI = {
  id: 'default_kantor',
  nama_lokasi: 'Kampus SIT Bina Insan',
  latitude: -6.208800,
  longitude: 106.845600,
  radius_meter: 100,
  jam_masuk: '07:15',
  jam_pulang: '15:30',
  toleransi_menit: 15
};

// Data Awal Pegawai SIT Bina Insan
const INITIAL_PEGAWAI = [
  {
    id: 'peg-001',
    nip: 'BI-2021001',
    nama: 'Ustadz Ahmad Fauzi, M.Pd.',
    email: 'ahmad.fauzi@binainsan.sch.id',
    no_hp: '081234567801',
    jabatan: 'Kepala Sekolah SDIT',
    divisi: 'SD Islam Terpadu',
    status: 'Tetap',
    tanggal_masuk: '2021-07-01',
    gaji_pokok: 8500000,
    sisa_cuti: 10,
    foto_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'peg-002',
    nip: 'BI-2022015',
    nama: 'Ustadzah Siti Nurhaliza, S.Pd.I',
    email: 'siti.nurhaliza@binainsan.sch.id',
    no_hp: '081234567802',
    jabatan: 'Guru Tahfidz & PAI',
    divisi: 'SMP Islam Terpadu',
    status: 'Tetap',
    tanggal_masuk: '2022-01-10',
    gaji_pokok: 5200000,
    sisa_cuti: 12,
    foto_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'peg-003',
    nip: 'BI-2022042',
    nama: 'Muhammad Rizky Pratama, S.Kom.',
    email: 'rizky.pratama@binainsan.sch.id',
    no_hp: '081234567803',
    jabatan: 'Staff IT & Kurikulum Digital',
    divisi: 'Manajemen Yayasan',
    status: 'Tetap',
    tanggal_masuk: '2022-08-15',
    gaji_pokok: 5800000,
    sisa_cuti: 8,
    foto_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'peg-004',
    nip: 'BI-2023008',
    nama: 'Fatimah Az-Zahra, S.Si.',
    email: 'fatimah.zahra@binainsan.sch.id',
    no_hp: '081234567804',
    jabatan: 'Guru Sains & Matematika',
    divisi: 'SMA Islam Terpadu',
    status: 'Kontrak',
    tanggal_masuk: '2023-01-05',
    gaji_pokok: 4800000,
    sisa_cuti: 11,
    foto_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'peg-005',
    nip: 'BI-2023019',
    nama: 'Ustadz Hendra Gunawan, Lc.',
    email: 'hendra.gunawan@binainsan.sch.id',
    no_hp: '081234567805',
    jabatan: 'Guru Bahasa Arab & Hadits',
    divisi: 'SMA Islam Terpadu',
    status: 'Tetap',
    tanggal_masuk: '2023-07-10',
    gaji_pokok: 5300000,
    sisa_cuti: 12,
    foto_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80'
  }
];

// Data Awal Absensi Hari Ini
const todayISO = new Date().toISOString().split('T')[0];
const INITIAL_ABSENSI = [
  {
    id: 'abs-001',
    pegawai_id: 'peg-001',
    nama_pegawai: 'Ustadz Ahmad Fauzi, M.Pd.',
    tanggal: todayISO,
    waktu_masuk: '06:58:20',
    waktu_pulang: null,
    latitude: -6.208750,
    longitude: 106.845620,
    jarak_meter: 8.5,
    status_kehadiran: 'Hadir Tepat Waktu',
    foto_absen: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    catatan: 'Hadir menyambut santri di gerbang utama'
  },
  {
    id: 'abs-002',
    pegawai_id: 'peg-002',
    nama_pegawai: 'Ustadzah Siti Nurhaliza, S.Pd.I',
    tanggal: todayISO,
    waktu_masuk: '07:05:42',
    waktu_pulang: null,
    latitude: -6.208790,
    longitude: 106.845580,
    jarak_meter: 12.3,
    status_kehadiran: 'Hadir Tepat Waktu',
    foto_absen: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    catatan: 'Persiapan halaqah quran pagi'
  }
];

// Data Awal Pengajuan Cuti & Izin
const INITIAL_CUTI = [
  {
    id: 'cuti-001',
    pegawai_id: 'peg-003',
    nama_pegawai: 'Muhammad Rizky Pratama, S.Kom.',
    jenis: 'Izin Terlambat',
    tanggal_mulai: todayISO,
    tanggal_selesai: todayISO,
    jumlah_hari: 1,
    alasan: 'Perbaikan darurat perangkat server jaringan yayasan di cabang selatan',
    dokumen_url: '',
    status: 'Disetujui',
    catatan_admin: 'Disetujui oleh Direktur Pendidikan',
    created_at: new Date(Date.now() - 3600000 * 5).toISOString()
  },
  {
    id: 'cuti-002',
    pegawai_id: 'peg-004',
    nama_pegawai: 'Fatimah Az-Zahra, S.Si.',
    jenis: 'Cuti Tahunan',
    tanggal_mulai: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
    tanggal_selesai: new Date(Date.now() + 86400000 * 4).toISOString().split('T')[0],
    jumlah_hari: 3,
    alasan: 'Menghadiri acara wisuda magister saudara kandung di luar kota',
    dokumen_url: 'https://example.com/undangan-wisuda.pdf',
    status: 'Menunggu Persetujuan',
    catatan_admin: '',
    created_at: new Date().toISOString()
  }
];

// Data Awal Pengajuan Kenaikan Gaji
const INITIAL_GAJI = [
  {
    id: 'gaji-001',
    pegawai_id: 'peg-005',
    nama_pegawai: 'Ustadz Hendra Gunawan, Lc.',
    jabatan: 'Guru Bahasa Arab & Hadits',
    gaji_lama: 5300000,
    gaji_baru: 6100000,
    persentase: 15.09,
    alasan: 'Telah lulus sertifikasi pengajar Bahasa Arab tingkat mahir dan bertambah amanah menjadi Koordinator Tahfidz Putra',
    status: 'Menunggu Persetujuan',
    catatan_pimpinan: '',
    tanggal_efektif: '2026-11-01',
    created_at: new Date().toISOString()
  }
];

// Helper Local Storage
function getLocalItem(key, defaultValue) {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
}

function setLocalItem(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error('Error saving to localStorage:', err);
  }
}

// Inisialisasi Klien Supabase jika ada konfig
let supabaseClient = null;
let supabaseSubscription = null;

export function getSupabaseCredentials() {
  const fromStorage = getLocalItem('sit_supabase_config', null);
  const url = fromStorage?.url || import.meta.env.VITE_SUPABASE_URL || '';
  const key = fromStorage?.key || import.meta.env.VITE_SUPABASE_ANON_KEY || '';
  return { url, key, isConfigured: Boolean(url && key && url.startsWith('http')) };
}

export function initSupabase() {
  const { url, key, isConfigured } = getSupabaseCredentials();
  if (isConfigured) {
    try {
      supabaseClient = createClient(url, key);
      return supabaseClient;
    } catch (e) {
      console.warn('Gagal menginisialisasi Supabase:', e);
      supabaseClient = null;
    }
  }
  return null;
}

// Jalankan inisialisasi awal
initSupabase();

// Listener subscriber untuk real-time events
const subscribers = new Set();

export function notifySubscribers(event) {
  subscribers.forEach((cb) => {
    try {
      cb(event);
    } catch (e) {
      console.error('Error in subscriber callback:', e);
    }
  });

  // Kirim juga ke tab lain jika menggunakan BroadcastChannel
  if (broadcast) {
    broadcast.postMessage(event);
  }
}

// Dengarkan pesan dari tab lain
if (broadcast) {
  broadcast.onmessage = (event) => {
    subscribers.forEach((cb) => cb(event.data));
  };
}

// Inisialisasi data lokal pertama kali
function ensureLocalData() {
  if (!localStorage.getItem('sit_pegawai')) setLocalItem('sit_pegawai', INITIAL_PEGAWAI);
  if (!localStorage.getItem('sit_absensi')) setLocalItem('sit_absensi', INITIAL_ABSENSI);
  if (!localStorage.getItem('sit_cuti')) setLocalItem('sit_cuti', INITIAL_CUTI);
  if (!localStorage.getItem('sit_gaji')) setLocalItem('sit_gaji', INITIAL_GAJI);
  if (!localStorage.getItem('sit_kantor')) setLocalItem('sit_kantor', DEFAULT_KONFIGURASI);
}
ensureLocalData();

// ==========================================
// API METODE UNTUK PEGAWAI
// ==========================================
export async function getPegawai() {
  if (supabaseClient) {
    try {
      const { data, error } = await supabaseClient.from('pegawai').select('*').order('nama', { ascending: true });
      if (!error && data && data.length > 0) return data;
    } catch (e) {
      console.warn('Supabase getPegawai gagal, menggunakan lokal:', e);
    }
  }
  return getLocalItem('sit_pegawai', INITIAL_PEGAWAI);
}

export async function addPegawai(pegawaiData) {
  const newPegawai = {
    id: 'peg-' + Date.now(),
    sisa_cuti: 12,
    tanggal_masuk: new Date().toISOString().split('T')[0],
    ...pegawaiData
  };

  if (supabaseClient) {
    try {
      await supabaseClient.from('pegawai').insert([newPegawai]);
    } catch (e) {
      console.warn('Supabase addPegawai error:', e);
    }
  }

  const current = getLocalItem('sit_pegawai', INITIAL_PEGAWAI);
  const updated = [newPegawai, ...current];
  setLocalItem('sit_pegawai', updated);
  notifySubscribers({ table: 'pegawai', action: 'INSERT', record: newPegawai });
  return newPegawai;
}

export async function updatePegawai(id, updates) {
  if (supabaseClient) {
    try {
      await supabaseClient.from('pegawai').update(updates).eq('id', id);
    } catch (e) {
      console.warn('Supabase updatePegawai error:', e);
    }
  }

  const current = getLocalItem('sit_pegawai', INITIAL_PEGAWAI);
  const updated = current.map((p) => (p.id === id ? { ...p, ...updates } : p));
  setLocalItem('sit_pegawai', updated);
  notifySubscribers({ table: 'pegawai', action: 'UPDATE', record: { id, ...updates } });
  return updated.find((p) => p.id === id);
}

export async function deletePegawai(id) {
  if (supabaseClient) {
    try {
      await supabaseClient.from('pegawai').delete().eq('id', id);
    } catch (e) {
      console.warn('Supabase deletePegawai error:', e);
    }
  }

  const current = getLocalItem('sit_pegawai', INITIAL_PEGAWAI);
  const updated = current.filter((p) => p.id !== id);
  setLocalItem('sit_pegawai', updated);
  notifySubscribers({ table: 'pegawai', action: 'DELETE', record: { id } });
  return true;
}

// ==========================================
// API METODE UNTUK ABSENSI
// ==========================================
export async function getAbsensi() {
  if (supabaseClient) {
    try {
      const { data, error } = await supabaseClient.from('absensi').select('*').order('created_at', { ascending: false });
      if (!error && data && data.length > 0) return data;
    } catch (e) {
      console.warn('Supabase getAbsensi gagal, menggunakan lokal:', e);
    }
  }
  return getLocalItem('sit_absensi', INITIAL_ABSENSI);
}

export async function addAbsensi(absenData) {
  const newAbsen = {
    id: 'abs-' + Date.now(),
    tanggal: new Date().toISOString().split('T')[0],
    created_at: new Date().toISOString(),
    ...absenData
  };

  if (supabaseClient) {
    try {
      await supabaseClient.from('absensi').insert([newAbsen]);
    } catch (e) {
      console.warn('Supabase addAbsensi error:', e);
    }
  }

  const current = getLocalItem('sit_absensi', INITIAL_ABSENSI);
  const updated = [newAbsen, ...current];
  setLocalItem('sit_absensi', updated);
  notifySubscribers({ table: 'absensi', action: 'INSERT', record: newAbsen });
  return newAbsen;
}

export async function updateAbsensiPulang(absenId, waktuPulang, catatanPulang = '') {
  const updates = {
    waktu_pulang: waktuPulang,
    catatan_pulang: catatanPulang
  };

  if (supabaseClient) {
    try {
      await supabaseClient.from('absensi').update(updates).eq('id', absenId);
    } catch (e) {
      console.warn('Supabase updateAbsensi error:', e);
    }
  }

  const current = getLocalItem('sit_absensi', INITIAL_ABSENSI);
  const updated = current.map((a) => (a.id === absenId ? { ...a, ...updates } : a));
  setLocalItem('sit_absensi', updated);
  notifySubscribers({ table: 'absensi', action: 'UPDATE', record: { id: absenId, ...updates } });
  return updated.find((a) => a.id === absenId);
}

// ==========================================
// API METODE UNTUK PENGAJUAN CUTI & IZIN
// ==========================================
export async function getCutiIzin() {
  if (supabaseClient) {
    try {
      const { data, error } = await supabaseClient.from('cuti_izin').select('*').order('created_at', { ascending: false });
      if (!error && data && data.length > 0) return data;
    } catch (e) {
      console.warn('Supabase getCutiIzin gagal, menggunakan lokal:', e);
    }
  }
  return getLocalItem('sit_cuti', INITIAL_CUTI);
}

export async function addCutiIzin(cutiData) {
  const newCuti = {
    id: 'cuti-' + Date.now(),
    status: 'Menunggu Persetujuan',
    created_at: new Date().toISOString(),
    ...cutiData
  };

  if (supabaseClient) {
    try {
      await supabaseClient.from('cuti_izin').insert([newCuti]);
    } catch (e) {
      console.warn('Supabase addCutiIzin error:', e);
    }
  }

  const current = getLocalItem('sit_cuti', INITIAL_CUTI);
  const updated = [newCuti, ...current];
  setLocalItem('sit_cuti', updated);
  notifySubscribers({ table: 'cuti_izin', action: 'INSERT', record: newCuti });
  return newCuti;
}

export async function updateStatusCutiIzin(id, status, catatanAdmin = '') {
  const updates = {
    status,
    catatan_admin: catatanAdmin,
    updated_at: new Date().toISOString()
  };

  if (supabaseClient) {
    try {
      await supabaseClient.from('cuti_izin').update(updates).eq('id', id);
    } catch (e) {
      console.warn('Supabase updateStatusCutiIzin error:', e);
    }
  }

  const current = getLocalItem('sit_cuti', INITIAL_CUTI);
  const targetItem = current.find((c) => c.id === id);
  const updated = current.map((c) => (c.id === id ? { ...c, ...updates } : c));
  setLocalItem('sit_cuti', updated);

  // Jika cuti disetujui dan berjenis 'Cuti Tahunan', kurangi sisa cuti pegawai
  if (status === 'Disetujui' && targetItem && targetItem.jenis === 'Cuti Tahunan') {
    const allPegawai = getLocalItem('sit_pegawai', INITIAL_PEGAWAI);
    const p = allPegawai.find((peg) => peg.id === targetItem.pegawai_id);
    if (p) {
      const sisaBaru = Math.max(0, (p.sisa_cuti || 12) - (targetItem.jumlah_hari || 1));
      await updatePegawai(p.id, { sisa_cuti: sisaBaru });
    }
  }

  notifySubscribers({ table: 'cuti_izin', action: 'UPDATE', record: { id, ...updates } });
  return updated.find((c) => c.id === id);
}

// ==========================================
// API METODE UNTUK PENGAJUAN KENAIKAN GAJI
// ==========================================
export async function getKenaikanGaji() {
  if (supabaseClient) {
    try {
      const { data, error } = await supabaseClient.from('kenaikan_gaji').select('*').order('created_at', { ascending: false });
      if (!error && data && data.length > 0) return data;
    } catch (e) {
      console.warn('Supabase getKenaikanGaji gagal, menggunakan lokal:', e);
    }
  }
  return getLocalItem('sit_gaji', INITIAL_GAJI);
}

export async function addKenaikanGaji(gajiData) {
  const newGaji = {
    id: 'gaji-' + Date.now(),
    status: 'Menunggu Persetujuan',
    created_at: new Date().toISOString(),
    ...gajiData
  };

  if (supabaseClient) {
    try {
      await supabaseClient.from('kenaikan_gaji').insert([newGaji]);
    } catch (e) {
      console.warn('Supabase addKenaikanGaji error:', e);
    }
  }

  const current = getLocalItem('sit_gaji', INITIAL_GAJI);
  const updated = [newGaji, ...current];
  setLocalItem('sit_gaji', updated);
  notifySubscribers({ table: 'kenaikan_gaji', action: 'INSERT', record: newGaji });
  return newGaji;
}

export async function updateStatusKenaikanGaji(id, status, catatanPimpinan = '', gajiBaruApproved = null) {
  const updates = {
    status,
    catatan_pimpinan: catatanPimpinan,
    updated_at: new Date().toISOString()
  };
  if (gajiBaruApproved) {
    updates.gaji_baru = Number(gajiBaruApproved);
  }

  if (supabaseClient) {
    try {
      await supabaseClient.from('kenaikan_gaji').update(updates).eq('id', id);
    } catch (e) {
      console.warn('Supabase updateStatusKenaikanGaji error:', e);
    }
  }

  const current = getLocalItem('sit_gaji', INITIAL_GAJI);
  const targetItem = current.find((g) => g.id === id);
  const updated = current.map((g) => (g.id === id ? { ...g, ...updates } : g));
  setLocalItem('sit_gaji', updated);

  // Jika disetujui, update gaji_pokok pegawai langsung di tabel pegawai!
  if (status === 'Disetujui' && targetItem) {
    const finalGaji = gajiBaruApproved ? Number(gajiBaruApproved) : targetItem.gaji_baru;
    await updatePegawai(targetItem.pegawai_id, { gaji_pokok: finalGaji });
  }

  notifySubscribers({ table: 'kenaikan_gaji', action: 'UPDATE', record: { id, ...updates } });
  return updated.find((g) => g.id === id);
}

// ==========================================
// API METODE UNTUK KONFIGURASI KANTOR
// ==========================================
export async function getKonfigurasiKantor() {
  if (supabaseClient) {
    try {
      const { data, error } = await supabaseClient.from('konfigurasi_kantor').select('*').limit(1).single();
      if (!error && data) return data;
    } catch (e) {
      console.warn('Supabase getKonfigurasiKantor error:', e);
    }
  }
  return getLocalItem('sit_kantor', DEFAULT_KONFIGURASI);
}

export async function updateKonfigurasiKantor(data) {
  const updated = {
    ...DEFAULT_KONFIGURASI,
    ...data,
    updated_at: new Date().toISOString()
  };

  if (supabaseClient) {
    try {
      await supabaseClient.from('konfigurasi_kantor').upsert([updated]);
    } catch (e) {
      console.warn('Supabase updateKonfigurasiKantor error:', e);
    }
  }

  setLocalItem('sit_kantor', updated);
  notifySubscribers({ table: 'konfigurasi_kantor', action: 'UPDATE', record: updated });
  return updated;
}

// ==========================================
// SUBSCRIPTION & STATUS MANAGER
// ==========================================
export function subscribeToRealtime(callback) {
  subscribers.add(callback);

  // Jika Supabase aktif, daftarkan Postgres Changes Real-Time channel
  if (supabaseClient && !supabaseSubscription) {
    try {
      supabaseSubscription = supabaseClient
        .channel('simpeg-db-changes')
        .on('postgres_changes', { event: '*', schema: 'public' }, (payload) => {
          callback({
            table: payload.table,
            action: payload.eventType,
            record: payload.new || payload.old
          });
        })
        .subscribe();
    } catch (err) {
      console.warn('Tidak dapat mendaftarkan realtime channel Supabase:', err);
    }
  }

  // Return fungsi cleanup
  return () => {
    subscribers.delete(callback);
  };
}

export function getDatabaseStatus() {
  const { url, key, isConfigured } = getSupabaseCredentials();
  return {
    isSupabase: isConfigured && Boolean(supabaseClient),
    url: isConfigured ? url : null,
    mode: isConfigured && Boolean(supabaseClient) ? 'Cloud Supabase Realtime' : 'Local Realtime Sync (BroadcastChannel)'
  };
}

export async function testAndSaveSupabaseConfig(url, key) {
  if (!url || !key) {
    setLocalItem('sit_supabase_config', null);
    supabaseClient = null;
    return { success: false, message: 'URL atau Key tidak boleh kosong' };
  }

  try {
    const testClient = createClient(url, key);
    const { error } = await testClient.from('konfigurasi_kantor').select('id').limit(1);
    if (error && error.code !== 'PGRST116') {
      return { success: false, message: 'Koneksi gagal: ' + error.message };
    }

    setLocalItem('sit_supabase_config', { url, key });
    supabaseClient = testClient;
    notifySubscribers({ table: 'system', action: 'CONNECTED' });
    return { success: true, message: 'Koneksi ke Supabase Realtime Berhasil!' };
  } catch (err) {
    return { success: false, message: 'Error: ' + err.message };
  }
}

export function resetToSampleData() {
  setLocalItem('sit_pegawai', INITIAL_PEGAWAI);
  setLocalItem('sit_absensi', INITIAL_ABSENSI);
  setLocalItem('sit_cuti', INITIAL_CUTI);
  setLocalItem('sit_gaji', INITIAL_GAJI);
  setLocalItem('sit_kantor', DEFAULT_KONFIGURASI);
  notifySubscribers({ table: 'all', action: 'RESET' });
  return true;
}
