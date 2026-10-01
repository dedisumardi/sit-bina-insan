/**
 * geo.js - Utilitas Perhitungan Geolocation & Formatting Kepegawaian
 */

// Menghitung jarak antara 2 koordinat (Haversine formula) dalam satuan meter
export function calculateDistance(lat1, lon1, lat2, lon2) {
  if (lat1 === undefined || lon1 === undefined || lat2 === undefined || lon2 === undefined) {
    return 0;
  }
  const R = 6371e3; // Radius bumi dalam meter
  const phi1 = (lat1 * Math.PI) / 180;
  const phi2 = (lat2 * Math.PI) / 180;
  const deltaPhi = ((lat2 - lat1) * Math.PI) / 180;
  const deltaLambda = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
    Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const distance = R * c;
  return Math.round(distance * 10) / 10; // 1 desimal
}

// Cek apakah koordinat pengguna berada dalam radius kantor
export function isWithinRadius(userLat, userLon, officeLat, officeLon, radiusMeters) {
  const dist = calculateDistance(userLat, userLon, officeLat, officeLon);
  return dist <= radiusMeters;
}

// Format format jarak yang manusiawi (meter atau kilometer)
export function formatDistance(meters) {
  if (meters === undefined || meters === null || isNaN(meters)) return '0 m';
  if (meters >= 1000) {
    return `${(meters / 1000).toFixed(2)} km`;
  }
  return `${Math.round(meters)} meter`;
}

// Format Rupiah Indonesia
export function formatRupiah(number) {
  if (number === undefined || number === null || isNaN(number)) return 'Rp 0';
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(number);
}

// Format Tanggal Indonesia (e.g. "Kamis, 1 Oktober 2026")
export function formatTanggalIndo(dateStr) {
  if (!dateStr) return '-';
  try {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  } catch {
    return dateStr;
  }
}

// Format Tanggal Pendek (e.g. "01/10/2026")
export function formatTanggalPendek(dateStr) {
  if (!dateStr) return '-';
  try {
    const d = new Date(dateStr);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  } catch {
    return dateStr;
  }
}

// Hitung selisih hari kerja antara dua tanggal inklusif
export function hitungHariCuti(tglMulai, tglSelesai) {
  if (!tglMulai || !tglSelesai) return 0;
  const start = new Date(tglMulai);
  const end = new Date(tglSelesai);
  if (end < start) return 0;

  let count = 0;
  const current = new Date(start);
  while (current <= end) {
    const dayOfWeek = current.getDay();
    // Hitung Senin-Jumat atau Senin-Sabtu (SIT biasanya Senin-Jumat/Sabtu, abaikan Minggu)
    if (dayOfWeek !== 0) {
      count++;
    }
    current.setDate(current.getDate() + 1);
  }
  return count > 0 ? count : 1;
}
