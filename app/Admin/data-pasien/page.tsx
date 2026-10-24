// app/(admin)/pasien/page.tsx
'use client';

import { useState } from 'react';

interface RiwayatKunjungan {
  tindakan: string;
  tanggal: string;
  dokter: string;
  status: 'Selesai';
}

interface Pasien {
  id: string;
  kode: string;
  nama: string;
  usia: number;
  telepon: string;
  nik: string;
  email: string;
  alamat: string;
  kunjunganTerakhir: string;
  totalKunjungan: number;
  status: 'Aktif' | 'Nonaktif';
  riwayat: RiwayatKunjungan[];
}

export default function PasienPage() {
  const [search, setSearch] = useState('');
  const [showModalTambah, setShowModalTambah] = useState(false);
  const [selectedPasien, setSelectedPasien] = useState<Pasien | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  // Form State
  const [nama, setNama] = useState('');
  const [usia, setUsia] = useState('');
  const [telepon, setTelepon] = useState('');
  const [email, setEmail] = useState('');
  const [alamat, setAlamat] = useState('');
  const [status, setStatus] = useState<'Aktif' | 'Nonaktif'>('Aktif');

  const [pasienList, setPasienList] = useState<Pasien[]>([
    {
      id: '1',
      kode: 'P-00124',
      nama: 'Budi Santoso',
      usia: 31,
      telepon: '81234567890',
      nik: '3174011503950001',
      email: 'budi@email.com',
      alamat: 'Jl. Merdeka No.12',
      kunjunganTerakhir: '16 Sep 2026',
      totalKunjungan: 12,
      status: 'Aktif',
      riwayat: [
        { tindakan: 'Scaling & Polishing', tanggal: '16 Sep 2026', dokter: 'drg. Sari Dewi', status: 'Selesai' },
        { tindakan: 'Konsultasi', tanggal: '02 Sep 2026', dokter: 'drg. Hendra K.', status: 'Selesai' },
        { tindakan: 'Tambal Gigi Komposit', tanggal: '15 Agu 2026', dokter: 'drg. Sari Dewi', status: 'Selesai' },
      ],
    },
    {
      id: '2',
      kode: 'P-00125',
      nama: 'Dewi Rahayu',
      usia: 42,
      telepon: '81398765432',
      nik: '3174025208840003',
      email: 'dewi.rahayu@email.com',
      alamat: 'Jl. Sudirman No.45',
      kunjunganTerakhir: '28 Sep 2026',
      totalKunjungan: 8,
      status: 'Aktif',
      riwayat: [
        { tindakan: 'Pemeriksaan Rutin', tanggal: '28 Sep 2026', dokter: 'drg. Sari Dewi', status: 'Selesai' },
      ],
    },
  ]);

  const showNotification = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTelepon(e.target.value.replace(/\D/g, ''));
  };

  const handleUsiaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '');
    setUsia(val);
  };

  const handleDeletePasien = (id: string, namaPasien: string) => {
    setPasienList(pasienList.filter((p) => p.id !== id));
    if (selectedPasien?.id === id) setSelectedPasien(null);
    showNotification(`Data pasien ${namaPasien} berhasil dihapus.`);
  };

  const handleSubmitTambah = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nama || !telepon) return;

    const newKode = `P-00${pasienList.length + 126}`;
    const newPasien: Pasien = {
      id: Date.now().toString(),
      kode: newKode,
      nama,
      usia: parseInt(usia) || 0,
      telepon,
      nik: '31740' + Math.floor(1000000000 + Math.random() * 9000000000),
      email: email || `${nama.toLowerCase().replace(/\s+/g, '')}@email.com`,
      alamat: alamat || '-',
      kunjunganTerakhir: 'Hari ini',
      totalKunjungan: 1,
      status,
      riwayat: [],
    };

    setPasienList([newPasien, ...pasienList]);
    setShowModalTambah(false);
    setNama('');
    setUsia('');
    setTelepon('');
    setEmail('');
    setAlamat('');
    setStatus('Aktif');

    showNotification(`Pasien ${nama} berhasil ditambahkan.`);
  };

  const filteredPasien = pasienList.filter(
    (p) =>
      p.nama.toLowerCase().includes(search.toLowerCase()) ||
      p.kode.toLowerCase().includes(search.toLowerCase()) ||
      p.telepon.includes(search)
  );

  return (
    <div className="space-y-6 relative min-h-[500px]">
      {/* HEADER & TOMBOL TAMBAH PASIEN */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-bold text-gray-900">Data Pasien</h2>
          <p className="text-xs text-gray-400">Kelola dan lihat rekam medis singkat pasien klinik</p>
        </div>

        <button
          onClick={() => setShowModalTambah(true)}
          className="px-4 py-2.5 bg-[#25A99D] hover:bg-teal-600 text-white font-bold rounded-xl text-xs transition shadow-sm flex items-center justify-center gap-1.5 shrink-0"
        >
          <span>+</span> Tambah Pasien Baru
        </button>
      </div>

      {/* TABEL PASIEN */}
      <div className="p-6 bg-white rounded-3xl border border-gray-100 shadow-sm space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <svg className="w-4 h-4 text-gray-400 absolute left-3.5 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Cari nama, ID pasien, atau nomor telepon..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-9 pl-9 pr-4 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:border-teal-500"
            />
          </div>
          <span className="text-xs text-gray-400 font-medium">
            {filteredPasien.length} dari {pasienList.length} pasien
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="text-gray-400 border-b border-gray-100 font-semibold uppercase">
                <th className="pb-3">ID Pasien</th>
                <th className="pb-3">Nama Pasien</th>
                <th className="pb-3">No. Telepon</th>
                <th className="pb-3">Alamat</th>
                <th className="pb-3">Kunjungan Terakhir</th>
                <th className="pb-3">Status</th>
                <th className="pb-3 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredPasien.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50/50 transition cursor-pointer" onClick={() => setSelectedPasien(p)}>
                  <td className="py-3.5 font-bold text-teal-600">{p.kode}</td>
                  <td className="py-3.5">
                    <p className="font-bold text-gray-900">{p.nama}</p>
                    <p className="text-[10px] text-gray-400">{p.usia} tahun</p>
                  </td>
                  <td className="py-3.5 text-gray-600">+62 {p.telepon}</td>
                  <td className="py-3.5 text-gray-500 truncate max-w-[180px]">{p.alamat}</td>
                  <td className="py-3.5 text-gray-600 font-medium">{p.kunjunganTerakhir}</td>
                  <td className="py-3.5">
                    <span className="px-2.5 py-1 bg-teal-50 text-teal-600 rounded-full text-[10px] font-bold">
                      {p.status}
                    </span>
                  </td>
                  <td className="py-3.5 text-right">
                    <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => setSelectedPasien(p)}
                        className="px-3 py-1.5 border border-gray-200 hover:border-teal-500 hover:text-teal-600 rounded-xl text-xs font-semibold transition"
                      >
                        Detail
                      </button>
                      <button
                        onClick={() => handleDeletePasien(p.id, p.nama)}
                        className="p-1.5 text-rose-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                        title="Hapus Pasien"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 1. MODAL DETAIL PASIEN */}
      {selectedPasien && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-[#F4F5F7] w-full max-w-4xl rounded-3xl p-6 shadow-xl space-y-6 relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setSelectedPasien(null)}
                className="flex items-center gap-2 text-xs font-bold text-gray-700 hover:text-gray-900 transition"
              >
                <span>←</span> Detail Pasien
              </button>
              <button onClick={() => setSelectedPasien(null)} className="text-gray-400 hover:text-gray-600 font-bold text-sm">
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm text-center space-y-4">
                <div className="w-20 h-20 bg-[#25A99D] text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto shadow-inner">
                  {selectedPasien.nama.charAt(0)}
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-900">{selectedPasien.nama}</h3>
                  <p className="text-xs text-gray-400 font-medium mt-0.5">{selectedPasien.kode}</p>
                  <span className="inline-block mt-2 px-3 py-0.5 bg-gray-100 text-gray-500 rounded-full text-[10px] font-semibold">
                    ⏱ {selectedPasien.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="p-3 bg-teal-50/50 rounded-2xl text-center border border-teal-100/50">
                    <p className="text-lg font-bold text-[#25A99D]">{selectedPasien.totalKunjungan}</p>
                    <p className="text-[10px] text-gray-400 font-medium">Kunjungan</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-2xl text-center border border-gray-100">
                    <p className="text-lg font-bold text-gray-700">{selectedPasien.usia}</p>
                    <p className="text-[10px] text-gray-400 font-medium">Tahun</p>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-8 space-y-6">
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
                  <h4 className="text-xs font-bold text-gray-900">Informasi Kontak</h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 shrink-0">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8"><path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                      </div>
                      <div>
                        <p className="text-[10px] text-gray-400">Telepon</p>
                        <p className="font-bold text-gray-900">+62 {selectedPasien.telepon}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 shrink-0">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8"><path strokeLinecap="round" strokeLinejoin="round" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 012-2h2a2 2 0 012 2v1m-6 0h6" /></svg>
                      </div>
                      <div>
                        <p className="text-[10px] text-gray-400">NIK</p>
                        <p className="font-bold text-gray-900">{selectedPasien.nik}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 shrink-0">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8"><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                      </div>
                      <div>
                        <p className="text-[10px] text-gray-400">Email</p>
                        <p className="font-bold text-gray-900">{selectedPasien.email}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 shrink-0">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8"><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                      </div>
                      <div>
                        <p className="text-[10px] text-gray-400">Alamat</p>
                        <p className="font-bold text-gray-900">{selectedPasien.alamat}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 sm:col-span-2">
                      <div className="w-8 h-8 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 shrink-0">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8"><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                      </div>
                      <div>
                        <p className="text-[10px] text-gray-400">Kunjungan Terakhir</p>
                        <p className="font-bold text-gray-900">{selectedPasien.kunjunganTerakhir}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
                  <h4 className="text-xs font-bold text-gray-900">Riwayat Kunjungan Singkat</h4>

                  <div className="space-y-3">
                    {selectedPasien.riwayat.length === 0 ? (
                      <p className="text-xs text-gray-400 text-center py-4">Belum ada riwayat tindakan.</p>
                    ) : (
                      selectedPasien.riwayat.map((r, idx) => (
                        <div key={idx} className="flex items-center justify-between pb-3 border-b border-gray-50 last:border-0 last:pb-0">
                          <div>
                            <p className="text-xs font-bold text-gray-900">{r.tindakan}</p>
                            <p className="text-[10px] text-gray-400">{r.tanggal} · {r.dokter}</p>
                          </div>
                          <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-bold">
                            ✓ {r.status}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. MODAL TAMBAH PASIEN BARU */}
      {showModalTambah && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white w-full max-w-lg rounded-3xl p-6 shadow-xl space-y-5 relative">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-gray-900">Tambah Pasien Baru</h3>
                <p className="text-[11px] text-gray-400">Lengkapi informasi pasien di bawah ini.</p>
              </div>
              <button onClick={() => setShowModalTambah(false)} className="text-gray-400 hover:text-gray-600 font-bold text-sm">
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitTambah} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Nama Lengkap</label>
                  <input
                    type="text"
                    placeholder="Nama pasien"
                    maxLength={50}
                    value={nama}
                    onChange={(e) => setNama(e.target.value)}
                    className="w-full h-10 px-3 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:border-teal-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Usia</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder="0"
                    value={usia}
                    onChange={handleUsiaChange}
                    className="w-full h-10 px-3 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Nomor Telepon</label>
                  <div className="relative flex items-center">
                    <span className="absolute left-3 text-xs font-semibold text-gray-500">+62</span>
                    <input
                      type="text"
                      inputMode="numeric"
                      placeholder="8xxxxxxxxxx"
                      value={telepon}
                      onChange={handlePhoneChange}
                      className="w-full h-10 pl-11 pr-3 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:border-teal-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Email</label>
                  <input
                    type="email"
                    placeholder="nama@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full h-10 px-3 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Alamat</label>
                <textarea
                  rows={3}
                  placeholder="Alamat lengkap pasien"
                  maxLength={150}
                  value={alamat}
                  onChange={(e) => setAlamat(e.target.value)}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:border-teal-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as 'Aktif' | 'Nonaktif')}
                  className="w-full h-10 px-3 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:border-teal-500"
                >
                  <option value="Aktif">Aktif</option>
                  <option value="Nonaktif">Nonaktif</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowModalTambah(false)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-bold transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#25A99D] hover:bg-teal-600 text-white rounded-xl text-xs font-bold transition shadow-sm"
                >
                  Tambah Pasien
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TOAST NOTIFIKASI KANAN BAWAH */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-start gap-3 p-3.5 px-4 bg-[#E6F8F3] border border-[#25A99D]/30 rounded-2xl shadow-xl max-w-xs transition animate-fade-in">
          <div className="w-5 h-5 rounded-full border border-[#25A99D] flex items-center justify-center text-[#25A99D] text-[10px] font-bold shrink-0 mt-0.5">
            ✓
          </div>
          <div className="flex-1 pr-2">
            <p className="text-xs font-bold text-gray-900 leading-tight">Berhasil Ditambahkan</p>
            <p className="text-[11px] text-gray-500 mt-0.5 leading-snug">{toast}</p>
          </div>
          <button onClick={() => setToast(null)} className="text-gray-400 hover:text-gray-600 text-xs font-bold leading-none">
            ×
          </button>
        </div>
      )}
    </div>
  );
}