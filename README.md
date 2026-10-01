# 🏫 SIMPEG SIT Bina Insan
### Sistem Informasi Manajemen Kepegawaian & Absensi Radius Geofencing Real-Time

Aplikasi kepegawaian modern terintegrasi untuk **Sekolah Islam Terpadu (SIT) Bina Insan**, dilengkapi dengan pengelolaan data pegawai, presensi harian berbasis radius geofencing presisi, permohonan cuti & izin, serta pengajuan kenaikan gaji berkala dengan sinkronisasi database **Real-Time**.

---

## 🌟 Fitur Utama

### 1. 👥 Manajemen Data Pegawai
- Direktori guru & tenaga kependidikan lengkap (NIP, Nama & Gelar, Unit/Divisi, Jabatan, Email, Kontak WhatsApp, Status Kepegawaian, Gaji Pokok, Sisa Kuota Cuti).
- Pencarian cerdas multi-parameter dan filter berbasis unit (TKIT, SDIT, SMPIT, SMAIT, Manajemen Yayasan) serta status (Tetap/Kontrak/Honor).
- Tampilan fleksibel: **Mode Kartu Profil** dan **Mode Tabel Data**.
- Ekspor rekap data pegawai ke format **CSV / Excel** dalam 1-klik.
- Tambah, edit, dan hapus pegawai dengan validasi otomatis.

### 2. 📍 Presensi Harian Berbasis Radius (Geofencing GPS)
- Deteksi lokasi posisi pengguna secara real-time via Browser Geolocation API.
- Peta interaktif **Leaflet OpenStreetMap** dengan visualisasi titik kampus, lingkaran radius izin kantor (geofence), dan posisi aktual pegawai.
- Perhitungan jarak presisi dengan rumus **Haversine**:
  - **Dalam Radius (<= 100 meter)**: Absensi diizinkan, tombol Absen Masuk & Pulang aktif.
  - **Di Luar Radius (> 100 meter)**: Peringatan otomatis dan absensi ditolak untuk menjaga kedisiplinan.
- Dilengkapi **Webcam / Selfie Verification** langsung dari perangkat untuk validasi kehadiran fisik.
- Fitur **Simulator Lokasi (Pengujian)**: Memungkinkan pengujian skenario "Di Dalam Sekolah (15m)" atau "Di Luar Radius (3.2km)" kapan saja.
- Otomatis mencatat status kehadiran (Tepat Waktu vs Terlambat berdasarkan toleransi jam masuk).

### 3. 📅 Pengajuan Cuti & Izin Real-Time
- Formulir pengajuan cuti tahunan, cuti sakit, cuti melahirkan, izin terlambat masuk, urusan keluarga, atau tugas dinas luar.
- Kalkulasi otomatis durasi hari kerja dan verifikasi sisa kuota cuti tahunan pegawai.
- Upload tautan dokumen pendukung (surat dokter / surat tugas).
- Workflow persetujuan oleh Admin/Kepala Sekolah/HRD (Setujui / Tolak dengan catatan verifikator).
- Saat disetujui, sisa kuota cuti tahunan pegawai otomatis terpotong secara real-time.

### 4. 📈 Pengajuan & Evaluasi Kenaikan Gaji
- Pengajuan kenaikan gaji berkala atau promosi prestasi guru/tendik.
- **Kalkulator Kenaikan Interaktif**: Sinkronisasi otomatis antara persentase kenaikan (%) dan nominal rupiah baru (Rp), serta menghitung selisih nominal tambahan per bulan.
- Workflow persetujuan oleh Direksi Yayasan/Pimpinan dengan fleksibilitas penyesuaian nominal akhir yang disetujui.
- Saat kenaikan gaji disetujui, sistem **otomatis memperbarui gaji pokok pegawai** di database.
- **Cetak SK Kenaikan Gaji Resmi**: Fitur cetak / simpan PDF Surat Keputusan resmi bertandatangan pimpinan yayasan lengkap dengan kop surat institusi.

### 5. ⚡ Real-Time Database Architecture
- **Dual Layer Real-time Engine**:
  - **Cloud Supabase Real-time**: Terhubung ke database Postgres Supabase melalui websocket `postgres_changes`.
  - **Local Multi-Tab BroadcastChannel**: Bekerja instan seketika tanpa konfigurasi database eksternal. Buka 2 tab browser sekaligus, lakukan perubahan di satu tab dan tab lainnya langsung ter-update otomatis!
- Pengaturan koneksi Supabase dapat diinput langsung melalui panel antarmuka aplikasi.

---

## 🚀 Panduan Menjalankan di Komputer Lokal

```bash
# 1. Masuk ke direktori proyek
cd "c:\Users\LENOVO\Videos\FOLDER KERJA DEDI\SIT Bina Insan"

# 2. Pastikan dependensi telah terinstal
npm install

# 3. Jalankan server lokal
npm run dev
```

Akses aplikasi di browser melalui: `http://localhost:5173/`

---

## 📤 Panduan Push ke GitHub

Ikuti langkah-langkah berikut di terminal untuk mengunggah proyek ini ke akun GitHub Anda:

```bash
# 1. Pastikan Anda telah membuat repositori baru di GitHub (misal: sit-bina-insan)
# 2. Hubungkan repositori lokal ke remote GitHub Anda:
git branch -M main
git remote add origin https://github.com/USERNAME/sit-bina-insan.git

# 3. Unggah seluruh kode ke GitHub:
git push -u origin main
```

*(Ganti `USERNAME` dengan username GitHub Anda).*

---

## 🌐 Panduan Deploy ke Vercel

Aplikasi ini telah dikonfigurasi dengan file `vercel.json` dan siap di-deploy secara cuma-cuma:

### Metode 1: Deploy Otomatis via Dashboard Vercel (Disarankan)
1. Kunjungi [vercel.com](https://vercel.com) dan login dengan akun GitHub Anda.
2. Klik tombol **"Add New..."** ➔ **"Project"**.
3. Pilih repository **sit-bina-insan** dari daftar GitHub Anda.
4. Framework Preset akan otomatis terdeteksi sebagai **Vite**.
5. *(Opsional)* Jika menggunakan Cloud Supabase, tambahkan di menu **Environment Variables**:
   - `VITE_SUPABASE_URL` = URL project Supabase Anda
   - `VITE_SUPABASE_ANON_KEY` = Anon Public Key Supabase Anda
6. Klik tombol **"Deploy"**. Dalam hitungan detik website Anda akan aktif dengan domain global HTTPS (misal: `https://sit-bina-insan.vercel.app`).

### Metode 2: Deploy via Vercel CLI
```bash
npx vercel
```

---

## 🗄️ Menghubungkan ke Database Supabase Real-Time (Opsional)

1. Buat proyek gratis di [supabase.com](https://supabase.com).
2. Buka menu **SQL Editor** di dashboard Supabase.
3. Buka file `supabase_schema.sql` pada proyek ini, salin seluruh kodenya, dan jalankan (Run) di SQL Editor Supabase.
4. Buka menu **Project Settings ➔ API** di Supabase, lalu salin **Project URL** dan **anon public key**.
5. Masukkan ke file `.env.local` atau langsung masukkan melalui menu **Real-Time Sync** di navbar aplikasi!

---

*Dikembangkan untuk Sekolah Islam Terpadu (SIT) Bina Insan.*
