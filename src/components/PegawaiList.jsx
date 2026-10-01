import React, { useState } from 'react';
import { 
  Users, 
  UserPlus, 
  Search, 
  Filter, 
  Edit3, 
  Trash2, 
  Eye, 
  Download, 
  Phone, 
  Mail, 
  Calendar, 
  Briefcase, 
  Building, 
  DollarSign, 
  CheckCircle,
  X,
  CreditCard
} from 'lucide-react';
import { formatRupiah, formatTanggalIndo, formatTanggalPendek } from '../utils/geo';

export default function PegawaiList({ 
  employees, 
  onAddEmployee, 
  onUpdateEmployee, 
  onDeleteEmployee, 
  currentRole 
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDivisi, setFilterDivisi] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table'

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' | 'edit'
  const [selectedPegawai, setSelectedPegawai] = useState(null);
  const [detailPegawai, setDetailPegawai] = useState(null);

  // Form State
  const initialFormData = {
    nip: '',
    nama: '',
    email: '',
    no_hp: '',
    jabatan: '',
    divisi: 'SD Islam Terpadu',
    status: 'Tetap',
    tanggal_masuk: new Date().toISOString().split('T')[0],
    gaji_pokok: 5000000,
    sisa_cuti: 12,
    foto_url: ''
  };
  const [formData, setFormData] = useState(initialFormData);

  // Filter employees
  const filteredEmployees = employees.filter(p => {
    const matchesSearch = 
      p.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.nip.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.jabatan.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDivisi = filterDivisi === 'ALL' || p.divisi === filterDivisi;
    const matchesStatus = filterStatus === 'ALL' || p.status === filterStatus;
    return matchesSearch && matchesDivisi && matchesStatus;
  });

  const handleOpenAdd = () => {
    setModalMode('add');
    const autoNIP = 'BI-' + new Date().getFullYear() + String(Math.floor(100 + Math.random() * 900));
    setFormData({
      ...initialFormData,
      nip: autoNIP,
      foto_url: `https://images.unsplash.com/photo-${1534528741775 + Math.floor(Math.random() * 1000)}?w=150&auto=format&fit=crop&q=80`
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (p) => {
    setModalMode('edit');
    setSelectedPegawai(p);
    setFormData({
      nip: p.nip || '',
      nama: p.nama || '',
      email: p.email || '',
      no_hp: p.no_hp || '',
      jabatan: p.jabatan || '',
      divisi: p.divisi || 'SD Islam Terpadu',
      status: p.status || 'Tetap',
      tanggal_masuk: p.tanggal_masuk || new Date().toISOString().split('T')[0],
      gaji_pokok: p.gaji_pokok || 5000000,
      sisa_cuti: p.sisa_cuti !== undefined ? p.sisa_cuti : 12,
      foto_url: p.foto_url || ''
    });
    setIsModalOpen(true);
  };

  const handleSubmitForm = (e) => {
    e.preventDefault();
    if (!formData.nama || !formData.nip || !formData.jabatan) {
      alert('Mohon lengkapi NIP, Nama Pegawai, dan Jabatan');
      return;
    }

    if (modalMode === 'add') {
      onAddEmployee(formData);
    } else if (modalMode === 'edit' && selectedPegawai) {
      onUpdateEmployee(selectedPegawai.id, formData);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (p) => {
    if (confirm(`Apakah Anda yakin ingin menghapus data pegawai: ${p.nama} (${p.nip})?`)) {
      onDeleteEmployee(p.id);
    }
  };

  // Export Data to CSV
  const handleExportCSV = () => {
    const headers = ['NIP', 'Nama Lengkap', 'Email', 'No HP', 'Unit/Divisi', 'Jabatan', 'Status', 'Tanggal Masuk', 'Gaji Pokok', 'Sisa Cuti'];
    const rows = filteredEmployees.map(p => [
      p.nip,
      `"${p.nama}"`,
      p.email,
      `'${p.no_hp}'`,
      `"${p.divisi}"`,
      `"${p.jabatan}"`,
      p.status,
      p.tanggal_masuk,
      p.gaji_pokok,
      p.sisa_cuti
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `data_pegawai_sit_bina_insan_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="pegawai-module">
      {/* Top Header & Actions */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
          <div>
            <h2 className="card-title">
              <Users size={22} style={{ color: 'var(--primary-600)' }} />
              Direktori Data Pegawai SIT Bina Insan
            </h2>
            <p className="card-subtitle">
              Total {employees.length} guru dan staf terdaftar di sistem kepegawaian
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            <button 
              type="button" 
              className="btn btn-secondary"
              onClick={handleExportCSV}
              title="Unduh laporan data pegawai ke format CSV/Excel"
            >
              <Download size={15} />
              <span>Ekspor CSV</span>
            </button>
            {currentRole === 'admin' && (
              <button 
                type="button" 
                className="btn btn-primary"
                onClick={handleOpenAdd}
              >
                <UserPlus size={16} />
                <span>Tambah Pegawai Baru</span>
              </button>
            )}
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12, marginTop: 18 }}>
          <div style={{ position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: 12, top: 12, color: 'var(--text-muted)' }} />
            <input 
              type="text" 
              className="form-input" 
              placeholder="Cari NIP, nama, atau jabatan..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ paddingLeft: 36 }}
            />
          </div>

          <div>
            <select 
              className="form-select"
              value={filterDivisi}
              onChange={(e) => setFilterDivisi(e.target.value)}
            >
              <option value="ALL">Semua Unit / Divisi</option>
              <option value="TK Islam Terpadu">TK Islam Terpadu</option>
              <option value="SD Islam Terpadu">SD Islam Terpadu</option>
              <option value="SMP Islam Terpadu">SMP Islam Terpadu</option>
              <option value="SMA Islam Terpadu">SMA Islam Terpadu</option>
              <option value="Manajemen Yayasan">Manajemen Yayasan</option>
            </select>
          </div>

          <div>
            <select 
              className="form-select"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="ALL">Semua Status Kepegawaian</option>
              <option value="Tetap">Pegawai Tetap</option>
              <option value="Kontrak">Pegawai Kontrak</option>
              <option value="Guru Tamu">Guru Tamu / Honor</option>
            </select>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
            <div className="role-switcher-box" style={{ width: 'fit-content' }}>
              <button 
                type="button" 
                className={`role-btn ${viewMode === 'grid' ? 'active' : ''}`}
                onClick={() => setViewMode('grid')}
              >
                Kartu
              </button>
              <button 
                type="button" 
                className={`role-btn ${viewMode === 'table' ? 'active' : ''}`}
                onClick={() => setViewMode('table')}
              >
                Tabel
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Grid View Mode */}
      {viewMode === 'grid' ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 20 }}>
          {filteredEmployees.map(p => (
            <div key={p.id} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 14 }}>
                  <img 
                    src={p.foto_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'} 
                    alt={p.nama} 
                    className="avatar-lg"
                  />
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
                    <span className="badge badge-info">{p.divisi}</span>
                    <span className={`badge ${p.status === 'Tetap' ? 'badge-success' : 'badge-warning'}`}>
                      {p.status}
                    </span>
                  </div>
                </div>

                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: 2 }}>
                  {p.nama}
                </h3>
                <p style={{ fontSize: '0.82rem', color: 'var(--primary-600)', fontWeight: 600, marginBottom: 8 }}>
                  {p.jabatan}
                </p>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: 12 }}>
                  NIP: <strong>{p.nip}</strong>
                </div>

                <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: 12, display: 'flex', flexDirection: 'column', gap: 6, fontSize: '0.82rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-sub)' }}>
                    <Mail size={14} style={{ color: 'var(--text-muted)' }} />
                    <span>{p.email || '-'}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-sub)' }}>
                    <Phone size={14} style={{ color: 'var(--text-muted)' }} />
                    <span>{p.no_hp || '-'}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 4 }}>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>Gaji Pokok:</span>
                    <strong style={{ color: 'var(--text-main)' }}>{formatRupiah(p.gaji_pokok)}</strong>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>Sisa Cuti:</span>
                    <strong style={{ color: 'var(--primary-600)' }}>{p.sisa_cuti || 12} Hari</strong>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 8, marginTop: 18, borderTop: '1px solid var(--border-color)', paddingTop: 12 }}>
                <button 
                  type="button" 
                  className="btn btn-sm btn-secondary"
                  onClick={() => setDetailPegawai(p)}
                  title="Lihat detail lengkap"
                >
                  <Eye size={14} /> Detail
                </button>
                {currentRole === 'admin' && (
                  <>
                    <button 
                      type="button" 
                      className="btn btn-sm btn-secondary"
                      onClick={() => handleOpenEdit(p)}
                      title="Edit data pegawai"
                    >
                      <Edit3 size={14} />
                    </button>
                    <button 
                      type="button" 
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDelete(p)}
                      title="Hapus data pegawai"
                    >
                      <Trash2 size={14} />
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Table View Mode */
        <div className="card">
          <div className="table-responsive">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Pegawai</th>
                  <th>NIP</th>
                  <th>Unit / Divisi</th>
                  <th>Jabatan</th>
                  <th>Status</th>
                  <th>Gaji Pokok</th>
                  <th>Sisa Cuti</th>
                  <th style={{ textAlign: 'right' }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredEmployees.map(p => (
                  <tr key={p.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <img src={p.foto_url || '/logo.jpg'} alt={p.nama} className="avatar" />
                        <div>
                          <strong style={{ display: 'block', fontSize: '0.9rem' }}>{p.nama}</strong>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{p.email}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="badge badge-neutral" style={{ fontVariantNumeric: 'tabular-nums' }}>
                        {p.nip}
                      </span>
                    </td>
                    <td>{p.divisi}</td>
                    <td>{p.jabatan}</td>
                    <td>
                      <span className={`badge ${p.status === 'Tetap' ? 'badge-success' : 'badge-warning'}`}>
                        {p.status}
                      </span>
                    </td>
                    <td>
                      <strong>{formatRupiah(p.gaji_pokok)}</strong>
                    </td>
                    <td>
                      <span className="badge badge-info">{p.sisa_cuti || 12} Hari</span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: 6 }}>
                        <button 
                          type="button" 
                          className="btn btn-sm btn-secondary"
                          onClick={() => setDetailPegawai(p)}
                        >
                          <Eye size={13} />
                        </button>
                        {currentRole === 'admin' && (
                          <>
                            <button 
                              type="button" 
                              className="btn btn-sm btn-secondary"
                              onClick={() => handleOpenEdit(p)}
                            >
                              <Edit3 size={13} />
                            </button>
                            <button 
                              type="button" 
                              className="btn btn-sm btn-danger"
                              onClick={() => handleDelete(p)}
                            >
                              <Trash2 size={13} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal Tambah / Edit Pegawai */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: 680 }}>
            <div className="modal-header">
              <h3 className="modal-title">
                <UserPlus size={20} style={{ color: 'var(--primary-600)' }} />
                {modalMode === 'add' ? 'Tambah Data Pegawai Baru' : `Edit Pegawai: ${formData.nama}`}
              </h3>
              <button type="button" className="modal-close-btn" onClick={() => setIsModalOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmitForm}>
              <div className="modal-body">
                <div className="form-grid-2">
                  <div className="form-group">
                    <label className="form-label">
                      NIP (Nomor Induk Pegawai)<span className="required">*</span>
                    </label>
                    <input 
                      type="text" 
                      className="form-input" 
                      value={formData.nip}
                      onChange={(e) => setFormData({ ...formData, nip: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      Nama Lengkap & Gelar<span className="required">*</span>
                    </label>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="Contoh: Ustadz Ahmad Fauzi, M.Pd."
                      value={formData.nama}
                      onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="form-grid-2">
                  <div className="form-group">
                    <label className="form-label">Unit / Divisi Pendidikan</label>
                    <select 
                      className="form-select"
                      value={formData.divisi}
                      onChange={(e) => setFormData({ ...formData, divisi: e.target.value })}
                    >
                      <option value="TK Islam Terpadu">TK Islam Terpadu</option>
                      <option value="SD Islam Terpadu">SD Islam Terpadu</option>
                      <option value="SMP Islam Terpadu">SMP Islam Terpadu</option>
                      <option value="SMA Islam Terpadu">SMA Islam Terpadu</option>
                      <option value="Manajemen Yayasan">Manajemen Yayasan</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      Amanah / Jabatan<span className="required">*</span>
                    </label>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="Contoh: Guru Tahfidz / Kepala Sekolah"
                      value={formData.jabatan}
                      onChange={(e) => setFormData({ ...formData, jabatan: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="form-grid-2">
                  <div className="form-group">
                    <label className="form-label">Email Resmi</label>
                    <input 
                      type="email" 
                      className="form-input" 
                      placeholder="nama@binainsan.sch.id"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">No. Telepon / WhatsApp</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="081234567890"
                      value={formData.no_hp}
                      onChange={(e) => setFormData({ ...formData, no_hp: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-grid-3">
                  <div className="form-group">
                    <label className="form-label">Status Kepegawaian</label>
                    <select 
                      className="form-select"
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    >
                      <option value="Tetap">Tetap</option>
                      <option value="Kontrak">Kontrak</option>
                      <option value="Guru Tamu">Guru Tamu</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Gaji Pokok (Rp)</label>
                    <input 
                      type="number" 
                      className="form-input" 
                      value={formData.gaji_pokok}
                      onChange={(e) => setFormData({ ...formData, gaji_pokok: Number(e.target.value) })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Sisa Kuota Cuti (Hari)</label>
                    <input 
                      type="number" 
                      className="form-input" 
                      value={formData.sisa_cuti}
                      onChange={(e) => setFormData({ ...formData, sisa_cuti: Number(e.target.value) })}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">URL Foto / Foto Profil</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="https://..."
                    value={formData.foto_url}
                    onChange={(e) => setFormData({ ...formData, foto_url: e.target.value })}
                  />
                  <span className="form-help">Bisa dikosongkan untuk menggunakan avatar default</span>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
                  Batal
                </button>
                <button type="submit" className="btn btn-primary">
                  {modalMode === 'add' ? 'Simpan Pegawai' : 'Perbarui Pegawai'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Detail Profil Pegawai */}
      {detailPegawai && (
        <div className="modal-overlay" onClick={() => setDetailPegawai(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: 540 }}>
            <div className="modal-header">
              <h3 className="modal-title">
                <Eye size={18} style={{ color: 'var(--primary-600)' }} />
                Profil Lengkap Pegawai
              </h3>
              <button type="button" className="modal-close-btn" onClick={() => setDetailPegawai(null)}>
                <X size={18} />
              </button>
            </div>

            <div className="modal-body" style={{ textAlign: 'center' }}>
              <img 
                src={detailPegawai.foto_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'} 
                alt={detailPegawai.nama} 
                className="avatar-lg"
                style={{ width: 90, height: 90, margin: '0 auto 12px' }}
              />
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)' }}>
                {detailPegawai.nama}
              </h3>
              <p style={{ color: 'var(--primary-600)', fontWeight: 600, fontSize: '0.9rem' }}>
                {detailPegawai.jabatan} - {detailPegawai.divisi}
              </p>
              <div style={{ marginTop: 6 }}>
                <span className="badge badge-neutral">NIP: {detailPegawai.nip}</span>
                <span className="badge badge-success" style={{ marginLeft: 6 }}>{detailPegawai.status}</span>
              </div>

              <div style={{ marginTop: 24, textAlign: 'left', background: 'var(--bg-subtle)', borderRadius: 12, padding: 18, display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: 8 }}>
                  <span style={{ color: 'var(--text-muted)' }}>Email:</span>
                  <strong>{detailPegawai.email || '-'}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: 8 }}>
                  <span style={{ color: 'var(--text-muted)' }}>No. Handphone:</span>
                  <strong>{detailPegawai.no_hp || '-'}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: 8 }}>
                  <span style={{ color: 'var(--text-muted)' }}>Tanggal Masuk:</span>
                  <strong>{formatTanggalIndo(detailPegawai.tanggal_masuk)}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: 8 }}>
                  <span style={{ color: 'var(--text-muted)' }}>Gaji Pokok Saat Ini:</span>
                  <strong style={{ color: 'var(--primary-700)', fontSize: '1.05rem' }}>{formatRupiah(detailPegawai.gaji_pokok)}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Sisa Cuti Tahunan:</span>
                  <strong style={{ color: 'var(--primary-600)' }}>{detailPegawai.sisa_cuti || 12} Hari Kerja</strong>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={() => setDetailPegawai(null)}>
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
