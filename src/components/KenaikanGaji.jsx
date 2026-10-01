import React, { useState } from 'react';
import { 
  TrendingUp, 
  PlusCircle, 
  DollarSign, 
  Award, 
  CheckCircle2, 
  XCircle, 
  FileText, 
  Printer, 
  Calendar, 
  User, 
  Sparkles, 
  X,
  Percent,
  Check
} from 'lucide-react';
import { formatRupiah, formatTanggalIndo } from '../utils/geo';
import confetti from 'canvas-confetti';

export default function KenaikanGaji({ 
  currentEmployee, 
  employees, 
  salaryList, 
  onAddSalaryRequest, 
  onUpdateSalaryStatus, 
  currentRole 
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [reviewModalItem, setReviewModalItem] = useState(null);
  const [approvedSalaryInput, setApprovedSalaryInput] = useState('');
  const [reviewNote, setReviewNote] = useState('');
  const [printItem, setPrintItem] = useState(null);

  // Form State
  const initialForm = {
    pegawai_id: currentEmployee?.id || '',
    gaji_baru: 0,
    persentase: 10,
    alasan: '',
    tanggal_efektif: new Date(Date.now() + 86400000 * 30).toISOString().split('T')[0]
  };
  const [formData, setFormData] = useState(initialForm);

  // Pegawai terpilih untuk form
  const selectedApplicant = employees.find(e => e.id === (formData.pegawai_id || currentEmployee?.id)) || currentEmployee || employees[0];
  const currentGaji = selectedApplicant?.gaji_pokok || 5000000;

  const handleOpenAdd = () => {
    const peg = currentEmployee || employees[0];
    const baseGaji = peg?.gaji_pokok || 5000000;
    const defaultNewGaji = Math.round(baseGaji * 1.1); // +10%
    setFormData({
      pegawai_id: peg?.id || '',
      gaji_baru: defaultNewGaji,
      persentase: 10,
      alasan: '',
      tanggal_efektif: new Date(Date.now() + 86400000 * 30).toISOString().split('T')[0]
    });
    setIsModalOpen(true);
  };

  // Sync saat pegawai diubah di form
  const handleSelectPegawai = (pegId) => {
    const p = employees.find(e => e.id === pegId);
    const base = p?.gaji_pokok || 5000000;
    const calcNew = Math.round(base * (1 + (formData.persentase || 10) / 100));
    setFormData({
      ...formData,
      pegawai_id: pegId,
      gaji_baru: calcNew
    });
  };

  // Sync saat persentase diubah
  const handleChangePersentase = (persen) => {
    const val = Number(persen);
    const newGaji = Math.round(currentGaji * (1 + val / 100));
    setFormData({
      ...formData,
      persentase: val,
      gaji_baru: newGaji
    });
  };

  // Sync saat nominal baru diubah
  const handleChangeGajiBaru = (val) => {
    const num = Number(val);
    const diff = num - currentGaji;
    const persen = currentGaji > 0 ? ((diff / currentGaji) * 100).toFixed(2) : 0;
    setFormData({
      ...formData,
      gaji_baru: num,
      persentase: Number(persen)
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.alasan) {
      alert('Mohon isi alasan atau prestasi yang mendasari usulan kenaikan gaji.');
      return;
    }
    if (formData.gaji_baru <= currentGaji) {
      alert('Usulan gaji baru harus lebih besar dari gaji pokok saat ini!');
      return;
    }

    const payload = {
      pegawai_id: selectedApplicant.id,
      nama_pegawai: selectedApplicant.nama,
      jabatan: selectedApplicant.jabatan,
      gaji_lama: currentGaji,
      gaji_baru: Number(formData.gaji_baru),
      persentase: Number(formData.persentase),
      alasan: formData.alasan,
      tanggal_efektif: formData.tanggal_efektif
    };

    onAddSalaryRequest(payload);
    setIsModalOpen(false);

    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 }
    });
  };

  const handleOpenReview = (item) => {
    setReviewModalItem(item);
    setApprovedSalaryInput(item.gaji_baru);
    setReviewNote('');
  };

  const handleProcessDecision = (status) => {
    if (!reviewModalItem) return;
    const finalGaji = approvedSalaryInput ? Number(approvedSalaryInput) : reviewModalItem.gaji_baru;
    onUpdateSalaryStatus(
      reviewModalItem.id, 
      status, 
      reviewNote || (status === 'Disetujui' ? 'Disetujui oleh Direksi Yayasan' : 'Belum disetujui'),
      status === 'Disetujui' ? finalGaji : null
    );

    setReviewModalItem(null);

    if (status === 'Disetujui') {
      confetti({
        particleCount: 80,
        spread: 90,
        origin: { y: 0.5 }
      });
    }
  };

  const filteredSalaries = salaryList.filter(s => {
    if (filterStatus === 'ALL') return true;
    return s.status === filterStatus;
  });

  return (
    <div className="gaji-module">
      {/* Header & Aksi */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
          <div>
            <h2 className="card-title">
              <TrendingUp size={22} style={{ color: 'var(--accent-gold-600)' }} />
              Pengajuan & Evaluasi Kenaikan Gaji Berkala
            </h2>
            <p className="card-subtitle">
              Sistem usulan penyesuaian gaji berbasis prestasi kerja, sertifikasi, dan evaluasi pimpinan yayasan
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button 
              type="button" 
              className="btn btn-gold"
              onClick={handleOpenAdd}
            >
              <PlusCircle size={16} />
              <span>Ajukan Kenaikan Gaji</span>
            </button>
          </div>
        </div>

        {/* Status Filter */}
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
                {st === 'ALL' ? salaryList.length : salaryList.filter(s => s.status === st).length}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Grid Usulan Kenaikan Gaji */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: 20 }}>
        {filteredSalaries.map(sal => {
          const selisihNominal = sal.gaji_baru - sal.gaji_lama;
          return (
            <div key={sal.id} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10, marginBottom: 12 }}>
                  <div>
                    <span className="badge badge-warning" style={{ marginBottom: 6 }}>
                      Usulan +{sal.persentase}%
                    </span>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)' }}>
                      {sal.nama_pegawai}
                    </h3>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      {sal.jabatan}
                    </p>
                  </div>

                  <span className={`badge ${
                    sal.status === 'Disetujui' ? 'badge-success' :
                    sal.status === 'Ditolak' ? 'badge-danger' : 'badge-warning'
                  }`}>
                    {sal.status}
                  </span>
                </div>

                {/* Perbandingan Gaji */}
                <div style={{ background: 'var(--bg-subtle)', borderRadius: 10, padding: 14, marginBottom: 14 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6, fontSize: '0.84rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Gaji Sebelumnya:</span>
                    <span style={{ textDecoration: 'line-through', color: 'var(--text-muted)' }}>{formatRupiah(sal.gaji_lama)}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6, fontSize: '0.95rem' }}>
                    <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>Usulan Gaji Baru:</span>
                    <strong style={{ color: 'var(--primary-600)', fontSize: '1.15rem' }}>{formatRupiah(sal.gaji_baru)}</strong>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px dashed var(--border-color)', paddingTop: 6, fontSize: '0.8rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Kenaikan Bersih:</span>
                    <span style={{ fontWeight: 700, color: '#10b981' }}>+{formatRupiah(selisihNominal)} / bulan</span>
                  </div>
                </div>

                {/* Alasan */}
                <div style={{ marginBottom: 12 }}>
                  <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.04em' }}>
                    Alasan / Prestasi:
                  </span>
                  <p style={{ fontSize: '0.86rem', color: 'var(--text-main)', marginTop: 2, lineHeight: 1.5 }}>
                    {sal.alasan}
                  </p>
                </div>

                {/* Tanggal Efektif & Catatan */}
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: 8 }}>
                  Berlaku Efektif: <strong>{formatTanggalIndo(sal.tanggal_efektif || sal.created_at)}</strong>
                </div>

                {sal.catatan_pimpinan && (
                  <div style={{ padding: 10, background: 'rgba(217, 119, 6, 0.08)', borderRadius: 8, borderLeft: '3px solid #d97706', fontSize: '0.8rem', color: 'var(--text-main)' }}>
                    <strong>Catatan Yayasan:</strong> {sal.catatan_pimpinan}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: 8, marginTop: 18, borderTop: '1px solid var(--border-color)', paddingTop: 14 }}>
                {sal.status === 'Disetujui' && (
                  <button 
                    type="button" 
                    className="btn btn-sm btn-secondary"
                    style={{ flex: 1 }}
                    onClick={() => setPrintItem(sal)}
                  >
                    <Printer size={14} /> Cetak SK Gaji
                  </button>
                )}

                {currentRole === 'admin' && sal.status === 'Menunggu Persetujuan' && (
                  <button 
                    type="button" 
                    className="btn btn-sm btn-gold" 
                    style={{ flex: 1 }}
                    onClick={() => handleOpenReview(sal)}
                  >
                    <Award size={14} /> Review & Putuskan
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {filteredSalaries.length === 0 && (
        <div className="card" style={{ textAlign: 'center', padding: '48px 16px', color: 'var(--text-muted)' }}>
          <TrendingUp size={40} style={{ opacity: 0.3, margin: '0 auto 12px' }} />
          <h3>Tidak ada pengajuan kenaikan gaji pada kategori ini</h3>
          <p style={{ fontSize: '0.85rem', marginTop: 4 }}>Klik tombol "Ajukan Kenaikan Gaji" untuk mengajukan usulan baru.</p>
        </div>
      )}

      {/* Modal Formulir Pengajuan Kenaikan Gaji */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: 620 }}>
            <div className="modal-header">
              <h3 className="modal-title">
                <TrendingUp size={20} style={{ color: 'var(--accent-gold-600)' }} />
                Formulir Usulan Kenaikan Gaji
              </h3>
              <button type="button" className="modal-close-btn" onClick={() => setIsModalOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                {/* Pegawai */}
                <div className="form-group">
                  <label className="form-label">Pegawai yang Diajukan</label>
                  {currentRole === 'admin' ? (
                    <select 
                      className="form-select"
                      value={formData.pegawai_id}
                      onChange={(e) => handleSelectPegawai(e.target.value)}
                    >
                      {employees.map(p => (
                        <option key={p.id} value={p.id}>
                          {p.nama} ({p.jabatan}) - Gaji Saat Ini: {formatRupiah(p.gaji_pokok)}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <div style={{ padding: '10px 14px', background: 'var(--bg-subtle)', borderRadius: 8, fontWeight: 600 }}>
                      {currentEmployee?.nama} ({currentEmployee?.jabatan})
                    </div>
                  )}
                </div>

                {/* Display Gaji Saat Ini */}
                <div style={{ padding: 14, background: 'var(--bg-subtle)', borderRadius: 10, marginBottom: 18, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Gaji Pokok Saat Ini:</span>
                  <strong style={{ fontSize: '1.25rem', color: 'var(--text-main)' }}>{formatRupiah(currentGaji)}</strong>
                </div>

                {/* Kalkulator Kenaikan (Persentase & Nominal) */}
                <div className="form-grid-2">
                  <div className="form-group">
                    <label className="form-label">Persentase Kenaikan (%)</label>
                    <input 
                      type="number" 
                      className="form-input" 
                      step="0.5"
                      min="1"
                      value={formData.persentase}
                      onChange={(e) => handleChangePersentase(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Usulan Gaji Baru (Rp)</label>
                    <input 
                      type="number" 
                      className="form-input" 
                      step="50000"
                      min={currentGaji + 10000}
                      value={formData.gaji_baru}
                      onChange={(e) => handleChangeGajiBaru(e.target.value)}
                      required
                    />
                  </div>
                </div>

                {/* Highlight Kenaikan */}
                <div style={{ padding: 12, background: 'rgba(16, 185, 129, 0.1)', borderRadius: 10, marginBottom: 18, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.85rem', color: 'var(--primary-700)' }}>
                    Tambahan Gaji per Bulan:
                  </span>
                  <strong style={{ fontSize: '1.15rem', color: 'var(--primary-700)' }}>
                    +{formatRupiah(formData.gaji_baru - currentGaji)}
                  </strong>
                </div>

                {/* Tanggal Efektif */}
                <div className="form-group">
                  <label className="form-label">Tanggal Usulan Mulai Berlaku</label>
                  <input 
                    type="date" 
                    className="form-input" 
                    value={formData.tanggal_efektif}
                    onChange={(e) => setFormData({ ...formData, tanggal_efektif: e.target.value })}
                    required
                  />
                </div>

                {/* Alasan & Pencapaian */}
                <div className="form-group">
                  <label className="form-label">
                    Alasan Pengajuan & Prestasi / Evaluasi Kinerja<span className="required">*</span>
                  </label>
                  <textarea 
                    className="form-textarea" 
                    rows="3"
                    placeholder="Contoh: Lulus sertifikasi tahfidz 30 juz, pengabdian lebih dari 3 tahun, peningkatan kepuasan wali santri..."
                    value={formData.alasan}
                    onChange={(e) => setFormData({ ...formData, alasan: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
                  Batal
                </button>
                <button type="submit" className="btn btn-gold">
                  Kirim Usulan Kenaikan Gaji
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Review Yayasan / Pimpinan */}
      {reviewModalItem && (
        <div className="modal-overlay" onClick={() => setReviewModalItem(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: 540 }}>
            <div className="modal-header">
              <h3 className="modal-title">
                <Award size={20} style={{ color: 'var(--accent-gold-600)' }} />
                Review Kenaikan Gaji: {reviewModalItem.nama_pegawai}
              </h3>
              <button type="button" className="modal-close-btn" onClick={() => setReviewModalItem(null)}>
                <X size={18} />
              </button>
            </div>

            <div className="modal-body">
              <div style={{ background: 'var(--bg-subtle)', borderRadius: 10, padding: 14, marginBottom: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ color: 'var(--text-muted)' }}>Gaji Saat Ini:</span>
                  <strong>{formatRupiah(reviewModalItem.gaji_lama)}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ color: 'var(--text-muted)' }}>Gaji yang Diajukan:</span>
                  <strong style={{ color: 'var(--primary-600)' }}>{formatRupiah(reviewModalItem.gaji_baru)} (+{reviewModalItem.persentase}%)</strong>
                </div>
                <div style={{ marginTop: 8 }}>
                  <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.8rem' }}>Alasan:</span>
                  <p style={{ marginTop: 2, fontSize: '0.88rem' }}>{reviewModalItem.alasan}</p>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Nominal Gaji Final yang Disetujui (Rp)</label>
                <input 
                  type="number" 
                  className="form-input" 
                  value={approvedSalaryInput}
                  onChange={(e) => setApprovedSalaryInput(e.target.value)}
                />
                <span className="form-help">Pimpinan dapat menyesuaikan nominal final sebelum disetujui</span>
              </div>

              <div className="form-group">
                <label className="form-label">Catatan Keputusan / Pertimbangan Yayasan</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="Contoh: Disetujui sesuai hasil rapat dewan pembina yayasan"
                  value={reviewNote}
                  onChange={(e) => setReviewNote(e.target.value)}
                />
              </div>
            </div>

            <div className="modal-footer" style={{ justifyContent: 'space-between' }}>
              <button 
                type="button" 
                className="btn btn-danger"
                onClick={() => handleProcessDecision('Ditolak')}
              >
                <XCircle size={15} /> Tolak Usulan
              </button>

              <div style={{ display: 'flex', gap: 8 }}>
                <button type="button" className="btn btn-secondary" onClick={() => setReviewModalItem(null)}>
                  Batal
                </button>
                <button 
                  type="button" 
                  className="btn btn-success"
                  onClick={() => handleProcessDecision('Disetujui')}
                >
                  <CheckCircle2 size={15} /> Setujui & Update Gaji Pokok
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Surat Keputusan Cetak Gaji (Print Friendly) */}
      {printItem && (
        <div className="modal-overlay" onClick={() => setPrintItem(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: 650 }}>
            <div className="modal-header no-print">
              <h3 className="modal-title">
                <Printer size={18} />
                Surat Keputusan Kenaikan Gaji
              </h3>
              <div style={{ display: 'flex', gap: 8 }}>
                <button 
                  type="button" 
                  className="btn btn-sm btn-primary"
                  onClick={() => window.print()}
                >
                  <Printer size={14} /> Cetak / Simpan PDF
                </button>
                <button type="button" className="modal-close-btn" onClick={() => setPrintItem(null)}>
                  <X size={18} />
                </button>
              </div>
            </div>

            <div className="modal-body" style={{ padding: 36, fontFamily: 'serif', lineHeight: 1.6 }}>
              {/* Kop Surat SIT Bina Insan */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, borderBottom: '2px double #000', paddingBottom: 16, marginBottom: 20 }}>
                <img src="/logo.jpg" alt="Logo SIT Bina Insan" style={{ width: 70, height: 70, borderRadius: '50%' }} />
                <div style={{ textAlign: 'center', flex: 1 }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, textTransform: 'uppercase', margin: 0 }}>
                    YAYASAN BINA INSAN CEMERLANG
                  </h3>
                  <h4 style={{ fontSize: '1rem', fontWeight: 700, margin: '2px 0', color: '#059669' }}>
                    SEKOLAH ISLAM TERPADU (SIT) BINA INSAN
                  </h4>
                  <p style={{ fontSize: '0.75rem', margin: 0, color: '#555' }}>
                    Jl. Bina Insan No. 1, Kota Insani | Telp: (021) 8899-7711 | Email: sdm@binainsan.sch.id
                  </p>
                </div>
              </div>

              {/* Judul Dokumen */}
              <div style={{ textAlign: 'center', marginBottom: 24 }}>
                <h4 style={{ textDecoration: 'underline', textTransform: 'uppercase', fontWeight: 800, fontSize: '1.1rem', margin: 0 }}>
                  SURAT KEPUTUSAN DIREKTUR YAYASAN
                </h4>
                <p style={{ fontSize: '0.85rem', margin: '4px 0' }}>
                  Nomor: SK-KG/{new Date().getFullYear()}/BI/{printItem.id.slice(-4).toUpperCase()}
                </p>
                <p style={{ fontSize: '0.85rem', fontWeight: 700 }}>
                  Tentang: Penetapan Penyesuaian Kenaikan Gaji Pegawai
                </p>
              </div>

              {/* Isi Surat */}
              <p style={{ fontSize: '0.9rem', marginBottom: 12 }}>
                Berdasarkan hasil evaluasi kinerja tahunan dan pengabdian, Yayasan menetapkan penyesuaian gaji bagi:
              </p>

              <table style={{ width: '100%', fontSize: '0.9rem', marginBottom: 18 }}>
                <tbody>
                  <tr>
                    <td style={{ width: 170, padding: '4px 0' }}>Nama Pegawai</td>
                    <td>: <strong>{printItem.nama_pegawai}</strong></td>
                  </tr>
                  <tr>
                    <td style={{ padding: '4px 0' }}>Jabatan / Unit</td>
                    <td>: {printItem.jabatan}</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '4px 0' }}>Gaji Pokok Sebelumnya</td>
                    <td>: {formatRupiah(printItem.gaji_lama)}</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '4px 0' }}>Gaji Pokok Baru</td>
                    <td>: <strong style={{ color: '#059669', fontSize: '1.05rem' }}>{formatRupiah(printItem.gaji_baru)}</strong></td>
                  </tr>
                  <tr>
                    <td style={{ padding: '4px 0' }}>Persentase Kenaikan</td>
                    <td>: +{printItem.persentase}%</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '4px 0' }}>Tanggal Efektif Berlaku</td>
                    <td>: <strong>{formatTanggalIndo(printItem.tanggal_efektif)}</strong></td>
                  </tr>
                </tbody>
              </table>

              <p style={{ fontSize: '0.9rem', marginBottom: 24 }}>
                Keputusan ini mulai berlaku terhitung sejak tanggal efektif yang telah ditetapkan dan diberikan sebagai apresiasi atas dedikasi dalam mencerdaskan generasi robbani di SIT Bina Insan.
              </p>

              {/* Tanda Tangan */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 36 }}>
                <div style={{ textAlign: 'center', width: 220 }}>
                  <p style={{ fontSize: '0.85rem', margin: 0 }}>Ditetapkan di Kota Insani</p>
                  <p style={{ fontSize: '0.85rem', margin: '2px 0 60px' }}>Pada: {formatTanggalIndo(new Date().toISOString().split('T')[0])}</p>
                  <p style={{ fontWeight: 800, textDecoration: 'underline', margin: 0 }}>H. Muhammad Danial, Lc., M.A.</p>
                  <p style={{ fontSize: '0.8rem', color: '#555', margin: 0 }}>Direktur Eksekutif Yayasan</p>
                </div>
              </div>
            </div>

            <div className="modal-footer no-print">
              <button type="button" className="btn btn-secondary" onClick={() => setPrintItem(null)}>
                Tutup
              </button>
              <button type="button" className="btn btn-primary" onClick={() => window.print()}>
                <Printer size={15} /> Cetak Sekarang
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
