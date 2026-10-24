// app/(admin)/pengeluaran/page.tsx
'use client';

import { useState } from 'react';

interface TransaksiPengeluaran {
  id: string;
  nama: string;
  deskripsi: string;
  kategori: string;
  metode: string;
  nominal: number;
  status: 'Completed';
}

export default function PengeluaranPage() {
  const [selectedKategori, setSelectedKategori] = useState<string | null>(null);
  const [filterKategori, setFilterKategori] = useState<string>('Semua Kategori');
  const [toast, setToast] = useState<string | null>(null);

  // Form Input Modal
  const [field1, setField1] = useState('');
  const [field2, setField2] = useState('');
  const [nominal, setNominal] = useState('');
  const [metode, setMetode] = useState('Transfer');

  // List Transaksi Dummy
  const [transaksiList, setTransaksiList] = useState<TransaksiPengeluaran[]>([
    {
      id: 'KAS-002',
      nama: 'Restock Kapas & Sarung Tangan',
      deskripsi: 'PT Medika Jaya',
      kategori: 'Beban BMHP',
      metode: 'Transfer',
      nominal: 250000,
      status: 'Completed',
    },
  ]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  // Konfigurasi Kategori Modal Input
  const configKategori: Record<
    string,
    { title: string; label1: string; ph1: string; label2: string; ph2: string }
  > = {
    'Beban BMHP': {
      title: 'Beban BMHP',
      label1: 'Nama Bahan',
      ph1: 'Contoh: Sarung tangan latex',
      label2: 'Supplier / Catatan',
      ph2: 'Contoh: PT Medika Jaya · 5 box',
    },
    'Biaya Lab': {
      title: 'Biaya Lab',
      label1: 'Nama Vendor Lab',
      ph1: 'Contoh: PT Dental Pro Lab',
      label2: 'Pasien / Pekerjaan',
      ph2: 'Contoh: Budi Santoso · Crown Zirconia',
    },
    'Bagi Hasil Dokter': {
      title: 'Bagi Hasil Dokter',
      label1: 'Nama Dokter',
      ph1: 'Contoh: drg. Sari Dewi',
      label2: 'Periode / Tindakan',
      ph2: 'Contoh: September 2026 · Scaling',
    },
    'Bagi Hasil Perawat': {
      title: 'Bagi Hasil Perawat',
      label1: 'Nama Perawat',
      ph1: 'Contoh: Rina (Perawat)',
      label2: 'Periode / Tindakan',
      ph2: 'Contoh: September 2026 · Asistensi',
    },
    'Gaji Staf': {
      title: 'Gaji Staf',
      label1: 'Nama Staf',
      ph1: 'Contoh: Nadia A.',
      label2: 'Jabatan / Periode',
      ph2: 'Contoh: Finance Admin · September 2026',
    },
    Utilitas: {
      title: 'Utilitas',
      label1: 'Jenis Utilitas',
      ph1: 'Contoh: Listrik PLN',
      label2: 'Periode / Nomor Tagihan',
      ph2: 'Contoh: September 2026 · INV-PLN-0926',
    },
    'Maintenance Alat': {
      title: 'Maintenance Alat',
      label1: 'Nama Alat / Perbaikan',
      ph1: 'Contoh: Autoclave Tuttnauer',
      label2: 'Teknisi / Keterangan',
      ph2: 'Contoh: CV Medtech · Servis berkala',
    },
  };

  // Submit Modal Input Pengeluaran
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!field1 || !nominal || !selectedKategori) return;

    const numVal = parseInt(nominal.replace(/\D/g, '')) || 0;

    const newTrans: TransaksiPengeluaran = {
      id: `KAS-00${transaksiList.length + 3}`,
      nama: field1,
      deskripsi: field2 || '-',
      kategori: selectedKategori,
      metode,
      nominal: numVal,
      status: 'Completed',
    };

    setTransaksiList([newTrans, ...transaksiList]);
    setSelectedKategori(null);

    // Reset Form
    setField1('');
    setField2('');
    setNominal('');
    setMetode('Transfer');

    showToast('Pengeluaran berhasil dicatat.');
  };

  // Filter List Pengeluaran
  const filteredList = transaksiList.filter(
    (item) => filterKategori === 'Semua Kategori' || item.kategori === filterKategori
  );

  const totalFiltered = filteredList.reduce((acc, curr) => acc + curr.nominal, 0);

  // Hitung Total per Kategori
  const getKategoriTotal = (kat: string) => {
    const list = transaksiList.filter((item) => item.kategori === kat);
    const sum = list.reduce((acc, curr) => acc + curr.nominal, 0);
    return { count: list.length, sum };
  };

  const kategoriCards = [
    {
      title: 'Beban BMHP',
      sub: 'Pembelian dan restock bahan medis',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8">
          <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      ),
      bg: 'bg-rose-50 text-rose-500',
    },
    {
      title: 'Biaya Lab',
      sub: 'Pembayaran pekerjaan vendor lab',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L5.6 15.12a2 2 0 00-1.022.547l-1.01 1.01a2 2 0 00-.568 1.414V20a1 1 0 001 1h16a1 1 0 001-1v-1.909a2 2 0 00-.568-1.414l-1.01-1.01zM12 3a4 4 0 100 8 4 4 0 000-8z" />
        </svg>
      ),
      bg: 'bg-purple-50 text-purple-600',
    },
    {
      title: 'Bagi Hasil Dokter',
      sub: 'Jasa medis dan tindakan dokter',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8">
          <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
      bg: 'bg-teal-50 text-teal-600',
    },
    {
      title: 'Bagi Hasil Perawat',
      sub: 'Jasa pendampingan perawat',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8">
          <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
      bg: 'bg-teal-50 text-teal-500',
    },
    {
      title: 'Gaji Staf',
      sub: 'Gaji resepsionis dan admin',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      bg: 'bg-blue-50 text-blue-600',
    },
    {
      title: 'Utilitas',
      sub: 'Listrik, air, dan internet',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8">
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      bg: 'bg-amber-50 text-amber-500',
    },
    {
      title: 'Maintenance Alat',
      sub: 'Perawatan alat dan fasilitas',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      bg: 'bg-rose-50 text-rose-500',
    },
  ];

  return (
    <div className="space-y-8 relative min-h-[500px]">
      {/* 1. KATEGORI PENGELUARAN GRID */}
      <div className="space-y-3">
        <div>
          <h2 className="text-sm font-bold text-gray-900">Kategori Pengeluaran</h2>
          <p className="text-xs text-gray-400">Pilih kategori untuk mencatat pengeluaran baru</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {kategoriCards.map((cat) => {
            const data = getKategoriTotal(cat.title);
            return (
              <div
                key={cat.title}
                onClick={() => setSelectedKategori(cat.title)}
                className="p-5 bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition cursor-pointer flex flex-col justify-between group space-y-4"
              >
                <div className="flex items-start justify-between">
                  <div className={`w-10 h-10 rounded-2xl ${cat.bg} flex items-center justify-center`}>
                    {cat.icon}
                  </div>
                  <span className="text-gray-300 group-hover:text-gray-600 transition text-xs">›</span>
                </div>

                <div>
                  <h3 className="text-xs font-bold text-gray-900">{cat.title}</h3>
                  <p className="text-[10px] text-gray-400 line-clamp-1">{cat.sub}</p>
                </div>

                <div className="pt-3 border-t border-gray-50">
                  <p className="text-sm font-bold text-rose-500">
                    Rp {data.sum.toLocaleString('id-ID')}
                  </p>
                  <p className="text-[10px] text-gray-400">{data.count} transaksi</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. TABEL RIWAYAT PENGELUARAN OPERASIONAL */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-sm font-bold text-gray-900">Pengeluaran Operasional</h2>
            <p className="text-xs text-gray-400">
              Total hasil filter: <span className="font-bold text-gray-700">Rp {totalFiltered.toLocaleString('id-ID')}</span>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <select
              value={filterKategori}
              onChange={(e) => setFilterKategori(e.target.value)}
              className="h-9 px-3 bg-white border border-gray-200 rounded-xl text-xs font-medium text-gray-700 focus:outline-none focus:border-teal-500"
            >
              <option value="Semua Kategori">Semua Kategori</option>
              {kategoriCards.map((c) => (
                <option key={c.title} value={c.title}>
                  {c.title}
                </option>
              ))}
            </select>

            <span className="text-xs text-gray-400 font-medium">
              {filteredList.length} transaksi
            </span>
          </div>
        </div>

        {/* Tabel Data */}
        <div className="p-6 bg-white rounded-3xl border border-gray-100 shadow-sm overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="text-gray-400 border-b border-gray-100 font-semibold uppercase">
                <th className="pb-3">ID</th>
                <th className="pb-3">Nama</th>
                <th className="pb-3">Deskripsi</th>
                <th className="pb-3">Kategori</th>
                <th className="pb-3">Metode</th>
                <th className="pb-3">Nominal</th>
                <th className="pb-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredList.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-gray-400">
                    Belum ada catatan pengeluaran.
                  </td>
                </tr>
              ) : (
                filteredList.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50/50 transition">
                    <td className="py-3.5 font-bold text-teal-600">{item.id}</td>
                    <td className="py-3.5 font-bold text-gray-900">{item.nama}</td>
                    <td className="py-3.5 text-gray-500">{item.deskripsi}</td>
                    <td className="py-3.5 font-semibold text-gray-700">{item.kategori}</td>
                    <td className="py-3.5 text-gray-600">{item.metode}</td>
                    <td className="py-3.5 font-bold text-rose-500">
                      Rp {item.nominal.toLocaleString('id-ID')}
                    </td>
                    <td className="py-3.5 text-right">
                      <span className="px-2.5 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-bold inline-flex items-center gap-1">
                        ✓ Completed
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. MODAL DINAMIS PENGELUARAN BARU */}
      {selectedKategori && configKategori[selectedKategori] && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-xl space-y-5 relative">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-teal-500 tracking-wider uppercase">
                  PENGELUARAN BARU
                </span>
                <h3 className="text-base font-bold text-gray-900 mt-0.5">
                  {configKategori[selectedKategori].title}
                </h3>
                <p className="text-[11px] text-gray-400">
                  Tanggal transaksi dicatat otomatis hari ini
                </p>
              </div>
              <button
                onClick={() => setSelectedKategori(null)}
                className="text-gray-400 hover:text-gray-600 font-bold text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  {configKategori[selectedKategori].label1}
                </label>
                <input
                  type="text"
                  placeholder={configKategori[selectedKategori].ph1}
                  value={field1}
                  onChange={(e) => setField1(e.target.value)}
                  className="w-full h-10 px-3 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:border-teal-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  {configKategori[selectedKategori].label2}
                </label>
                <input
                  type="text"
                  placeholder={configKategori[selectedKategori].ph2}
                  value={field2}
                  onChange={(e) => setField2(e.target.value)}
                  className="w-full h-10 px-3 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Nominal</label>
                  <input
                    type="text"
                    placeholder="0"
                    value={nominal}
                    onChange={(e) => setNominal(e.target.value)}
                    className="w-full h-10 px-3 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:border-teal-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">
                    Metode Pembayaran
                  </label>
                  <select
                    value={metode}
                    onChange={(e) => setMetode(e.target.value)}
                    className="w-full h-10 px-3 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:border-teal-500"
                  >
                    <option value="Transfer">Transfer</option>
                    <option value="Tunai">Tunai</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setSelectedKategori(null)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-bold transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#25A99D] hover:bg-teal-600 text-white rounded-xl text-xs font-bold transition shadow-sm"
                >
                  Simpan Pengeluaran
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
            <p className="text-xs font-bold text-gray-900 leading-tight">Pengeluaran Dicatat</p>
            <p className="text-[11px] text-gray-500 mt-0.5 leading-snug">{toast}</p>
          </div>
          <button
            onClick={() => setToast(null)}
            className="text-gray-400 hover:text-gray-600 text-xs font-bold leading-none"
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
}