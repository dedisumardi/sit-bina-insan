import React, { useState } from 'react';
import { 
  CalendarCheck, 
  PlusCircle, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  FileText, 
  Calendar, 
  User, 
  FileSpreadsheet, 
  X,
  Sparkles,
  Info
} from 'lucide-react';
import { hitungHariCuti, formatTanggalIndo, formatTanggalPendek } from '../utils/geo';
import confetti from 'canvas-confetti';

export default function CutiIzin({ 
  currentEmployee, 
  employees, 
  leaveList, 
  onAddLeave, 
  onUpdateLeaveStatus, 
  currentRole 
}) {
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reviewModalItem, setReviewModalItem] = useState(null);
  const [reviewNote, setReviewNote] = useState('');

  // Form State
  const initialForm = {
    pegawai_id: currentEmployee?.id || '',
    jenis: 'Cuti Tahunan',
    tanggal_mulai: new Date().toISOString().split('T')[0],
    tanggal_selesai: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    alasan: '',
    dokumen_url: ''
  };
  const [formData, setFormData] = useState(initialForm);

  // Hitung jumlah hari cuti
  const jumlahHari = hitungHariCuti(formData.tanggal_mulai, formData.tanggal_selesai);

  // Pegawai terpilih untuk form
  const applicant = employees.find(e => e.id === (formData.pegawai_id || currentEmployee?.id)) || currentEmployee;

  // Filter daftar cuti
  const filteredLeaves = leaveList.filter(item => {
    if (filterStatus === 'ALL') return true;
    return item.status === filterStatus;
  });

  const handleOpenModal = () => {
    setFormData({
      ...initialForm,
      pegawai_id: currentEmployee?.id || employees[0]?.id || ''
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.alasan) {
      alert('Mohon isi alasan pengajuan cuti / izin.');
      return;
    }

    if (formData.jenis === 'Cuti Tahunan' && applicant && jumlahHari > (applicant.sisa_cuti || 12)) {
      alert(`Jumlah hari pengajuan (${jumlahHari} hari) melebihi sisa kuota cuti tahunan pegawai (${applicant.sisa_cuti || 0} hari)!`);
      return;
    }

    const payload = {
      pegawai_id: applicant?.id,
      nama_pegawai: applicant?.nama,
      jenis: formData.jenis,
      tanggal_mulai: formData.tanggal_mulai,
      tanggal_selesai: formData.tanggal_selesai,
      jumlah_hari: jumlahHari,
      alasan: formData.alasan,
      dokumen_url: formData.dokumen_url
    };

    onAddLeave(payload);
    setIsModalOpen(false);

    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 }
    });
  };

  const handleProcessReview = (status) => {
    if (!reviewModalItem) return;
    onUpdateLeaveStatus(reviewModalItem.id, status, reviewNote || `Diproses oleh Admin (${status})`);
    setReviewModalItem(null);
    setReviewNote('');

    if (status === 'Disetujui') {
      confetti({
        particleCount: 70,
        spread: 80,
        origin: { y: 0.5 }
      });
    }
  };

  return (
    <div className="cuti-module">
      {/* Header & Aksi */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
          <div>
            <h2 className="card-title">
              <CalendarCheck size={22} style={{ color: 'var(--primary-600)' }} />
              Manajemen Pengajuan Cuti & Izin Pegawai
            </h2>
            <p className="card-subtitle">
              Workflow pengajuan izin dan cuti guru/staf dengan persetujuan real-time
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button 
              type="button" 
              className="btn btn-primary"
              onClick={handleOpenModal}
            >
              <PlusCircle size={16} />
              <span>Buat Pengajuan Cuti / Izin</span>
            </button>
          </div>
        </div>

        {/* Status Filter Pills */}
        <div style={{ display: 'flex', gap: 8, marginTop: 18, overflowX: 'auto', paddingBottom: 4 }}>
          {['ALL', 'Menunggu Persetujuan', 'Disetujui', 'Ditolak'].map(st => (
            <button 
              key={st}
              type="button" 
              className={`role-btn ${filterStatus === st ? 'active' : ''}`}
              onClick={() => setFilterStatus(st)}
              style={{ padding: '6px 14px', borderRadius: 9999, border: '1px solid var(--border-color)' }}
            >
              {st === 'ALL' ? 'Semua Status' : st}
              <span className="badge badge-neutral" style={{ fontSize: '0.7rem', padding: '1px 6px', marginLeft: 4 }}>
                {st === 'ALL' ? leaveList.length : leaveList.filter(l => l.status === st).length}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Grid Pengajuan Cuti */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: 20 }}>
        {filteredLeaves.map(leave => (
          <div key={leave.id} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10, marginBottom: 12 }}>
                <div>
                  <span className="badge badge-info" style={{ marginBottom: 6 }}>
                    {leave.jenis}
                  </span>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)' }}>
                    {leave.nama_pegawai}
                  </h3>
                </div>

                <span className={`badge ${
                  leave.status === 'Disetujui' ? 'badge-success' :
                  leave.status === 'Ditolak' ? 'badge-danger' : 'badge-warning'
                }`}>
                  {leave.status}
                </span>
              </div>

              {/* Rincian Tanggal */}
              <div style={{ background: 'var(--bg-subtle)', borderRadius: 10, padding: 12, marginBottom: 12, fontSize: '0.84rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-sub)', marginBottom: 4 }}>
                  <Calendar size={14} style={{ color: 'var(--primary-600)' }} />
                  <span>
                    <strong>{formatTanggalPendek(leave.tanggal_mulai)}</strong> s/d <strong>{formatTanggalPendek(leave.tanggal_selesai)}</strong>
                  </span>
                  <span className="badge badge-neutral" style={{ marginLeft: 'auto' }}>
                    {leave.jumlah_hari} Hari
                  </span>
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  Diajukan pada: {formatTanggalIndo(leave.created_at || leave.tanggal_mulai)}
                </div>
              </div>

              {/* Alasan */}
              <div style={{ marginBottom: 12 }}>
                <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.04em' }}>
                  Alasan / Keterangan:
                </span>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-main)', marginTop: 2, lineHeight: 1.5 }}>
                  {leave.alasan}
                </p>
              </div>

              {/* Dokumen lampiran jika ada */}
              {leave.dokumen_url && (
                <div style={{ marginBottom: 12 }}>
                  <a 
                    href={leave.dokumen_url} 
                    target="_blank" 
                    rel="noreferrer" 
                    style={{ fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: 4 }}
                  >
                    <FileText size={13} /> Lihat Dokumen Pendukung
                  </a>
                </div>
              )}

              {/* Catatan Admin jika ada */}
              {leave.catatan_admin && (
                <div style={{ padding: 10, background: 'rgba(59, 130, 246, 0.08)', borderRadius: 8, borderLeft: '3px solid #3b82f6', fontSize: '0.8rem', color: 'var(--text-main)' }}>
                  <strong>Catatan Verifikator:</strong> {leave.catatan_admin}
                </div>
              )}
            </div>

            {/* Aksi Persetujuan untuk Admin */}
            {currentRole === 'admin' && leave.status === 'Menunggu Persetujuan' && (
              <div style={{ display: 'flex', gap: 8, marginTop: 18, borderTop: '1px solid var(--border-color)', paddingTop: 14 }}>
                <button 
                  type="button" 
                  className="btn btn-sm btn-success" 
                  style={{ flex: 1 }}
                  onClick={() => setReviewModalItem(leave)}
                >
                  <CheckCircle2 size={14} /> Verifikasi
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredLeaves.length === 0 && (
        <div className="card" style={{ textAlign: 'center', padding: '48px 16px', color: 'var(--text-muted)' }}>
          <CalendarCheck size={40} style={{ opacity: 0.3, margin: '0 auto 12px' }} />
          <h3>Tidak ada pengajuan cuti/izin pada kategori ini</h3>
          <p style={{ fontSize: '0.85rem', marginTop: 4 }}>Klik tombol "Buat Pengajuan Cuti / Izin" untuk membuat permohonan baru.</p>
        </div>
      )}

      {/* Modal Formulir Pengajuan Cuti Baru */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: 600 }}>
            <div className="modal-header">
              <h3 className="modal-title">
                <CalendarCheck size={20} style={{ color: 'var(--primary-600)' }} />
                Formulir Pengajuan Cuti / Izin
              </h3>
              <button type="button" className="modal-close-btn" onClick={() => setIsModalOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                {/* Pemohon */}
                <div className="form-group">
                  <label className="form-label">Pegawai Pemohon</label>
                  {currentRole === 'admin' ? (
                    <select 
                      className="form-select"
                      value={formData.pegawai_id}
                      onChange={(e) => setFormData({ ...formData, pegawai_id: e.target.value })}
                    >
                      {employees.map(p => (
                        <option key={p.id} value={p.id}>
                          {p.nama} ({p.jabatan}) - Sisa Cuti: {p.sisa_cuti || 12} Hari
                        </option>
                      ))}
                    </select>
                  ) : (
                    <div style={{ padding: '10px 14px', background: 'var(--bg-subtle)', borderRadius: 8, fontWeight: 600 }}>
                      {currentEmployee?.nama} ({currentEmployee?.jabatan})
                      <span className="badge badge-success" style={{ marginLeft: 8 }}>
                        Sisa Cuti: {currentEmployee?.sisa_cuti || 12} Hari
                      </span>
                    </div>
                  )}
                </div>

                {/* Jenis Cuti / Izin */}
                <div className="form-group">
                  <label className="form-label">Kategori Pengajuan</label>
                  <select 
                    className="form-select"
                    value={formData.jenis}
                    onChange={(e) => setFormData({ ...formData, jenis: e.target.value })}
                  >
                    <option value="Cuti Tahunan">Cuti Tahunan (Memotong Kuota Tahunan)</option>
                    <option value="Cuti Sakit">Cuti Sakit (Disertai Surat Dokter)</option>
                    <option value="Cuti Melahirkan">Cuti Melahirkan</option>
                    <option value="Izin Terlambat">Izin Terlambat Masuk Tugas</option>
                    <option value="Izin Keperluan Pribadi">Izin Urusan Keluarga / Pribadi</option>
                    <option value="Izin Ibadah Umroh / Haji">Izin Ibadah Umroh / Haji</option>
                    <option value="Dinas Luar">Tugas Dinas Luar / Pelatihan Yayasan</option>
                  </select>
                </div>

                {/* Rentang Tanggal */}
                <div className="form-grid-2">
                  <div className="form-group">
                    <label className="form-label">Tanggal Mulai</label>
                    <input 
                      type="date" 
                      className="form-input" 
                      value={formData.tanggal_mulai}
                      onChange={(e) => setFormData({ ...formData, tanggal_mulai: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Tanggal Selesai</label>
                    <input 
                      type="date" 
                      className="form-input" 
                      value={formData.tanggal_selesai}
                      min={formData.tanggal_mulai}
                      onChange={(e) => setFormData({ ...formData, tanggal_selesai: e.target.value })}
                      required
                    />
                  </div>
                </div>

                {/* Perhitungan Durasi Hari */}
                <div style={{ padding: 12, background: 'rgba(16, 185, 129, 0.1)', borderRadius: 10, marginBottom: 18, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.85rem', color: 'var(--primary-700)' }}>
                    <Info size={16} />
                    <span>Total Hari Kerja Terhitung:</span>
                  </div>
                  <strong style={{ fontSize: '1.15rem', color: 'var(--primary-700)' }}>
                    {jumlahHari} Hari Kerja
                  </strong>
                </div>

                {/* Alasan */}
                <div className="form-group">
                  <label className="form-label">
                    Alasan / Keterangan Pengajuan<span className="required">*</span>
                  </label>
                  <textarea 
                    className="form-textarea"
                    rows="3"
                    placeholder="Tuliskan keterangan lengkap pengajuan cuti/izin..."
                    value={formData.alasan}
                    onChange={(e) => setFormData({ ...formData, alasan: e.target.value })}
                    required
                  />
                </div>

                {/* Link Dokumen */}
                <div className="form-group">
                  <label className="form-label">URL Dokumen Lampiran (Opsional)</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="https://drive.google.com/... atau surat-dokter.pdf"
                    value={formData.dokumen_url}
                    onChange={(e) => setFormData({ ...formData, dokumen_url: e.target.value })}
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
                  Batal
                </button>
                <button type="submit" className="btn btn-primary">
                  Kirim Pengajuan Cuti
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Review / Verifikasi Cuti oleh Admin */}
      {reviewModalItem && (
        <div className="modal-overlay" onClick={() => setReviewModalItem(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: 520 }}>
            <div className="modal-header">
              <h3 className="modal-title">
                <CheckCircle2 size={20} style={{ color: 'var(--primary-600)' }} />
                Verifikasi Pengajuan: {reviewModalItem.nama_pegawai}
              </h3>
              <button type="button" className="modal-close-btn" onClick={() => setReviewModalItem(null)}>
                <X size={18} />
              </button>
            </div>

            <div className="modal-body">
              <div style={{ background: 'var(--bg-subtle)', borderRadius: 10, padding: 14, marginBottom: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ color: 'var(--text-muted)' }}>Jenis Cuti:</span>
                  <strong>{reviewModalItem.jenis}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ color: 'var(--text-muted)' }}>Durasi:</span>
                  <strong>{reviewModalItem.jumlah_hari} Hari ({reviewModalItem.tanggal_mulai} s/d {reviewModalItem.tanggal_selesai})</strong>
                </div>
                <div style={{ marginTop: 8 }}>
                  <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.8rem' }}>Alasan:</span>
                  <p style={{ marginTop: 2, fontSize: '0.88rem' }}>{reviewModalItem.alasan}</p>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Catatan Admin / Pimpinan</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="Contoh: Disetujui, tugas piket digantikan Ust. Hendra"
                  value={reviewNote}
                  onChange={(e) => setReviewNote(e.target.value)}
                />
              </div>
            </div>

            <div className="modal-footer" style={{ justifyContent: 'space-between' }}>
              <button 
                type="button" 
                className="btn btn-danger"
                onClick={() => handleProcessReview('Ditolak')}
              >
                <XCircle size={15} /> Tolak Pengajuan
              </button>

              <div style={{ display: 'flex', gap: 8 }}>
                <button type="button" className="btn btn-secondary" onClick={() => setReviewModalItem(null)}>
                  Batal
                </button>
                <button 
                  type="button" 
                  className="btn btn-success"
                  onClick={() => handleProcessReview('Disetujui')}
                >
                  <CheckCircle2 size={15} /> Setujui Cuti
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
