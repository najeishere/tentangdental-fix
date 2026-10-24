// app/(admin)/rekonsiliasi/page.tsx
'use client';

import { useState } from 'react';

// Tipe data item alokasi
interface AlokasiItem {
  id: string;
  nama: string;
  sub: string;
  nominal: number;
  persen: number;
  warna: string;
  bgWarna: string;
  badgeWarna: string;
  icon: JSX.Element;
  deskripsi: string;
  catatan?: string;
  rincian: {
    no: number;
    nama: string;
    keterangan: string;
    tanggal: string;
    jumlah: string;
  }[];
}

export default function RekonsiliasiPage() {
  const [selectedAlokasi, setSelectedAlokasi] = useState<AlokasiItem | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  // Ringkasan Keuangan Utama
  const totalKasMasuk = 85400000;
  const totalAlokasi = 76500000;
  const labaBersih = totalKasMasuk - totalAlokasi;

  // Daftar Alokasi Kas
  const alokasiList: AlokasiItem[] = [
    {
      id: 'bmhp',
      nama: 'Beban BMHP',
      sub: 'Restock bahan dental',
      nominal: 12750000,
      persen: 15,
      warna: 'bg-amber-800',
      bgWarna: 'bg-[#B07D70]',
      badgeWarna: 'bg-amber-50 text-amber-800 hover:bg-amber-100',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8">
          <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      ),
      deskripsi: 'Pembelian bahan medis habis pakai (BMHP) untuk operasional klinik bulan September 2026.',
      rincian: [
        { no: 1, nama: 'Polishing Paste', keterangan: 'Tube 100g × 20 pcs', tanggal: '03 Sep 2026', jumlah: 'Rp 1.800.000' },
        { no: 2, nama: 'Sarung Tangan Latex M', keterangan: 'Box 100 × 8 box', tanggal: '03 Sep 2026', jumlah: 'Rp 1.600.000' },
        { no: 3, nama: 'Sarung Tangan Latex S', keterangan: 'Box 100 × 4 box', tanggal: '03 Sep 2026', jumlah: 'Rp 800.000' },
        { no: 4, nama: 'Masker Medis 3-ply', keterangan: 'Box 50 × 10 box', tanggal: '05 Sep 2026', jumlah: 'Rp 750.000' },
        { no: 5, nama: 'Kapas Gulungan', keterangan: '250g × 12 rol', tanggal: '05 Sep 2026', jumlah: 'Rp 420.000' },
        { no: 6, nama: 'Jarum Suntik Dental', keterangan: 'Pcs × 200 pcs', tanggal: '10 Sep 2026', jumlah: 'Rp 1.200.000' },
      ],
    },
    {
      id: 'lab',
      nama: 'Biaya Lab',
      sub: 'Bayar tagihan vendor lab',
      nominal: 15300000,
      persen: 18,
      warna: 'bg-purple-600',
      bgWarna: 'bg-[#8B5CF6]',
      badgeWarna: 'bg-purple-50 text-purple-600 hover:bg-purple-100',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L5.6 15.12a2 2 0 00-1.022.547l-1.01 1.01a2 2 0 00-.568 1.414V20a1 1 0 001 1h16a1 1 0 001-1v-1.909a2 2 0 00-.568-1.414l-1.01-1.01zM12 3a4 4 0 100 8 4 4 0 000-8z" />
        </svg>
      ),
      deskripsi: 'Tagihan jasa vendor laboratorium dental untuk pekerjaan bulan September 2026.',
      rincian: [
        { no: 1, nama: 'Behel Metal Pasien Reza Pratama', keterangan: 'CV Mitra Gigi Sehat — INV-LAB-091', tanggal: '02 Sep 2026', jumlah: 'Rp 1.200.000' },
        { no: 2, nama: 'Crown Porcelain Fused Metal (PFM) ×2', keterangan: 'CV Mitra Gigi Sehat — INV-LAB-087', tanggal: '05 Sep 2026', jumlah: 'Rp 2.800.000' },
        { no: 3, nama: 'Gigi Tiruan Sebagian Lepasan ×1', keterangan: 'Lab Denta Prima — INV-LAB-088', tanggal: '08 Sep 2026', jumlah: 'Rp 1.700.000' },
        { no: 4, nama: 'Study Model + Artikulasi', keterangan: 'CV Mitra Gigi Sehat — INV-LAB-092', tanggal: '10 Sep 2026', jumlah: 'Rp 450.000' },
      ],
    },
    {
      id: 'dokter',
      nama: 'Bagi Hasil Dokter',
      sub: 'Jasa medis drg. Sari Dewi',
      nominal: 29750000,
      persen: 35,
      warna: 'bg-teal-500',
      bgWarna: 'bg-[#25A99D]',
      badgeWarna: 'bg-teal-50 text-teal-600 hover:bg-teal-100',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8">
          <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
      deskripsi: 'Bagi hasil jasa medis dokter berdasarkan total pendapatan tindakan.',
      rincian: [
        { no: 1, nama: 'drg. Sari Dewi', keterangan: 'Persentase 35% dari total Omset Tindakan Medis', tanggal: '30 Sep 2026', jumlah: 'Rp 29.750.000' },
      ],
    },
    {
      id: 'perawat',
      nama: 'Bagi Hasil Perawat',
      sub: 'Jasa perawat',
      nominal: 4250000,
      persen: 5,
      warna: 'bg-teal-400',
      bgWarna: 'bg-[#25A99D]',
      badgeWarna: 'bg-teal-50 text-teal-600 hover:bg-teal-100',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8">
          <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
      deskripsi: 'Bagi hasil jasa perawat berdasarkan kontribusi tindakan asistensi selama September 2026.',
      catatan: 'Persentase bagi hasil perawat: 5% dari total pendapatan tindakan medis.',
      rincian: [
        { no: 1, nama: 'Rina (Perawat)', keterangan: 'Asistensi Scaling & Polishing × 18 tindakan', tanggal: '30 Sep 2026', jumlah: 'Rp 1.800.000' },
        { no: 2, nama: 'Rina (Perawat)', keterangan: 'Asistensi Tambal Komposit × 9 tindakan', tanggal: '30 Sep 2026', jumlah: 'Rp 900.000' },
        { no: 3, nama: 'Rina (Perawat)', keterangan: 'Asistensi Pemasangan Behel × 3 tindakan', tanggal: '30 Sep 2026', jumlah: 'Rp 750.000' },
        { no: 4, nama: 'Rina (Perawat)', keterangan: 'Asistensi PSA × 2 tindakan', tanggal: '30 Sep 2026', jumlah: 'Rp 400.000' },
        { no: 5, nama: 'Rina (Perawat)', keterangan: 'Sterilisasi Alat & Persiapan Ruangan', tanggal: '30 Sep 2026', jumlah: 'Rp 400.000' },
      ],
    },
    {
      id: 'gaji',
      nama: 'Gaji Staf',
      sub: 'Resepsionis & admin',
      nominal: 8500000,
      persen: 10,
      warna: 'bg-blue-500',
      bgWarna: 'bg-[#3B82F6]',
      badgeWarna: 'bg-blue-50 text-blue-600 hover:bg-blue-100',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      deskripsi: 'Penggajian staf non-medis klinik untuk periode September 2026.',
      catatan: 'Pembayaran gaji dilakukan setiap tanggal 28 atau hari kerja terakhir sebelumnya.',
      rincian: [
        { no: 1, nama: 'Nadia A.', keterangan: 'Finance Admin — Gaji Pokok', tanggal: '28 Sep 2026', jumlah: 'Rp 3.500.000' },
        { no: 2, nama: 'Dani Setiawan', keterangan: 'Resepsionis — Gaji Pokok', tanggal: '28 Sep 2026', jumlah: 'Rp 2.800.000' },
        { no: 3, nama: 'Nadia A.', keterangan: 'Finance Admin — Tunjangan Transport', tanggal: '28 Sep 2026', jumlah: 'Rp 300.000' },
        { no: 4, nama: 'Dani Setiawan', keterangan: 'Resepsionis — Tunjangan Transport', tanggal: '28 Sep 2026', jumlah: 'Rp 300.000' },
        { no: 5, nama: 'Nadia A.', keterangan: 'Finance Admin — Tunjangan Makan', tanggal: '28 Sep 2026', jumlah: 'Rp 600.000' },
        { no: 6, nama: 'Dani Setiawan', keterangan: 'Resepsionis — Tunjangan Makan', tanggal: '28 Sep 2026', jumlah: 'Rp 600.000' },
        { no: 7, nama: 'Keduanya', keterangan: 'BPJS Ketenagakerjaan (4%)', tanggal: '28 Sep 2026', jumlah: 'Rp 252.000' },
        { no: 8, nama: 'Keduanya', keterangan: 'BPJS Kesehatan (1%)', tanggal: '28 Sep 2026', jumlah: 'Rp 148.000' },
      ],
    },
    {
      id: 'utilitas',
      nama: 'Utilitas',
      sub: 'Listrik, air, internet',
      nominal: 3400000,
      persen: 4,
      warna: 'bg-amber-500',
      bgWarna: 'bg-[#F59E0B]',
      badgeWarna: 'bg-amber-50 text-amber-600 hover:bg-amber-100',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8">
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      deskripsi: 'Tagihan utilitas operasional klinik (listrik, air, internet, dan telepon) bulan September 2026.',
      catatan: 'Tagihan dibayarkan setiap awal bulan untuk tagihan bulan sebelumnya.',
      rincian: [
        { no: 1, nama: 'PLN — Listrik', keterangan: 'Daya 13.200 VA — No. Pel. 512340001', tanggal: '05 Sep 2026', jumlah: 'Rp 1.850.000' },
        { no: 2, nama: 'PDAM — Air', keterangan: 'Penggunaan 28 m³ — No. Pel. 89210', tanggal: '05 Sep 2026', jumlah: 'Rp 420.000' },
        { no: 3, nama: 'Biznet — Internet', keterangan: 'Paket 100 Mbps dedicated — Inv. BN-Sep', tanggal: '03 Sep 2026', jumlah: 'Rp 850.000' },
        { no: 4, nama: 'Telkom — Telepon', keterangan: 'Line PSTN klinik + pulsa bisnis', tanggal: '07 Sep 2026', jumlah: 'Rp 280.000' },
      ],
    },
    {
      id: 'maintenance',
      nama: 'Maintenance Alat',
      sub: 'Autoclave, dental chair service',
      nominal: 2550000,
      persen: 3,
      warna: 'bg-rose-500',
      bgWarna: 'bg-[#EF4444]',
      badgeWarna: 'bg-rose-50 text-rose-500 hover:bg-rose-100',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      deskripsi: 'Biaya perawatan dan servis peralatan medis klinik selama September 2026.',
      catatan: 'Servis dilakukan oleh teknisi bersertifikat. Semua alat dalam kondisi layak pakai setelah servis.',
      rincian: [
        { no: 1, nama: 'Autoclave Tuttnauer', keterangan: 'Servis berkala + penggantian gasket — CV Medtech', tanggal: '08 Sep 2026', jumlah: 'Rp 850.000' },
        { no: 2, nama: 'Dental Chair Unit #1', keterangan: 'Kalibrasi & pelumasan hidrolik — CV Medtech', tanggal: '10 Sep 2026', jumlah: 'Rp 600.000' },
        { no: 3, nama: 'Dental Chair Unit #2', keterangan: 'Penggantian headrest cover + servis pompa', tanggal: '10 Sep 2026', jumlah: 'Rp 450.000' },
        { no: 4, nama: 'X-Ray Dental (Intraoral)', keterangan: 'Kalibrasi dosis + pemeriksaan kondisi sensor', tanggal: '15 Sep 2026', jumlah: 'Rp 400.000' },
        { no: 5, nama: 'Kompresor Udara', keterangan: 'Pembersihan filter + cek tekanan — CV Medtech', tanggal: '22 Sep 2026', jumlah: 'Rp 250.000' },
      ],
    },
  ];

  // SUB-VIEW: DETAIL ALOKASI
  if (selectedAlokasi) {
    return (
      <div className="space-y-6 animate-fade-in">
        {/* Tombol Kembali */}
        <button
          onClick={() => setSelectedAlokasi(null)}
          className="flex items-center gap-2 text-xs font-semibold text-gray-500 hover:text-gray-900 transition"
        >
          <span>‹</span> Kembali ke Rekonsiliasi
        </button>

        {/* Hero Card Banner Color */}
        <div className={`p-8 rounded-3xl text-white shadow-md ${selectedAlokasi.bgWarna} relative overflow-hidden`}>
          <div className="flex items-start justify-between relative z-10">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center">
                {selectedAlokasi.icon}
              </div>
              <div>
                <h2 className="text-xl font-bold">{selectedAlokasi.nama}</h2>
                <p className="text-xs text-white/80">{selectedAlokasi.sub}</p>
              </div>
            </div>

            <div className="text-right">
              <p className="text-[10px] uppercase font-bold tracking-wider text-white/70">Alokasi Bulan Ini</p>
              <p className="text-2xl font-bold mt-0.5">Rp {selectedAlokasi.nominal.toLocaleString('id-ID')}</p>
              <p className="text-[11px] text-white/80 mt-1">{selectedAlokasi.persen}% dari total kas masuk</p>
            </div>
          </div>

          {/* Progress Bar Header */}
          <div className="mt-8 space-y-1 relative z-10">
            <div className="w-full h-2 bg-black/20 rounded-full overflow-hidden">
              <div className="h-full bg-white rounded-full" style={{ width: `${selectedAlokasi.persen}%` }} />
            </div>
            <div className="flex justify-between text-[10px] text-white/70 font-medium">
              <span>0%</span>
              <span>{selectedAlokasi.persen}% dari Rp 85,4jt</span>
            </div>
          </div>
        </div>

        {/* Rincian Transaksi */}
        <div className="p-6 bg-white rounded-3xl border border-gray-100 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-gray-900">Rincian Transaksi</h3>
              <p className="text-xs text-gray-400 mt-0.5">{selectedAlokasi.deskripsi}</p>
            </div>
            <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-semibold">
              {selectedAlokasi.rincian.length} item
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-gray-400 border-b border-gray-100 font-semibold uppercase">
                  <th className="pb-3 w-10">#</th>
                  <th className="pb-3">Nama / Deskripsi</th>
                  <th className="pb-3">Keterangan</th>
                  <th className="pb-3">Tanggal</th>
                  <th className="pb-3 text-right">Jumlah</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {selectedAlokasi.rincian.map((item) => (
                  <tr key={item.no} className="hover:bg-gray-50/50 transition">
                    <td className="py-3.5">
                      <span className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center font-bold text-gray-500 text-[10px]">
                        {item.no}
                      </span>
                    </td>
                    <td className="py-3.5 font-bold text-gray-900">{item.nama}</td>
                    <td className="py-3.5 text-gray-500">{item.keterangan}</td>
                    <td className="py-3.5 text-gray-400">{item.tanggal}</td>
                    <td className="py-3.5 text-right font-bold text-gray-900">{item.jumlah}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="pt-4 border-t border-gray-100 flex justify-between items-center font-bold text-sm">
            <span className="text-gray-500">Total Realisasi</span>
            <span className="text-gray-900">Rp {selectedAlokasi.nominal.toLocaleString('id-ID')}</span>
          </div>
        </div>

        {/* Catatan Khusus di Bawah */}
        {selectedAlokasi.catatan && (
          <div className="p-4 bg-teal-50/50 border border-teal-100 rounded-2xl flex items-center gap-2.5 text-xs text-teal-800">
            <span className="w-4 h-4 rounded-full border border-teal-600 flex items-center justify-center text-[10px] font-bold shrink-0">
              !
            </span>
            <span>{selectedAlokasi.catatan}</span>
          </div>
        )}
      </div>
    );
  }

  // TAMPILAN UTAMA REKONSILIASI
  return (
    <div className="space-y-6 relative min-h-[500px]">
      {/* 1. THREE TOP SUMMARY CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Total Kas Masuk */}
        <div className="p-6 bg-white rounded-3xl border border-gray-100 shadow-sm space-y-2">
          <div className="flex items-center gap-2 text-teal-500 text-xs font-semibold">
            <span className="w-5 h-5 rounded-lg bg-teal-50 flex items-center justify-center text-xs">↙</span>
            <span>Total Kas Masuk</span>
          </div>
          <p className="text-2xl font-bold text-teal-600">Rp {totalKasMasuk.toLocaleString('id-ID')}</p>
        </div>

        {/* Total Alokasi */}
        <div className="p-6 bg-white rounded-3xl border border-gray-100 shadow-sm space-y-2">
          <div className="flex items-center gap-2 text-rose-500 text-xs font-semibold">
            <span className="w-5 h-5 rounded-lg bg-rose-50 flex items-center justify-center text-xs">↗</span>
            <span>Total Alokasi</span>
          </div>
          <p className="text-2xl font-bold text-rose-600">Rp {totalAlokasi.toLocaleString('id-ID')}</p>
        </div>

        {/* Laba Bersih */}
        <div className="p-6 bg-white rounded-3xl border border-gray-100 shadow-sm space-y-2">
          <div className="flex items-center gap-2 text-teal-600 text-xs font-semibold">
            <span className="w-5 h-5 rounded-lg bg-teal-50 flex items-center justify-center text-xs">$</span>
            <span>Laba Bersih</span>
          </div>
          <p className="text-2xl font-bold text-teal-600">Rp {labaBersih.toLocaleString('id-ID')}</p>
        </div>
      </div>

      {/* 2. ALOKASI KAS CONTAINER */}
      <div className="p-6 bg-white rounded-3xl border border-gray-100 shadow-sm space-y-6">
        <h3 className="text-sm font-bold text-gray-900">Alokasi Kas — September 2026</h3>

        <div className="space-y-6">
          {alokasiList.map((item) => (
            <div key={item.id} className="flex items-center justify-between gap-4 group">
              <div className="flex items-center gap-4 flex-1">
                <div className={`w-10 h-10 rounded-2xl ${item.badgeWarna} flex items-center justify-center shrink-0`}>
                  {item.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <div>
                      <p className="text-xs font-bold text-gray-900">{item.nama}</p>
                      <p className="text-[10px] text-gray-400">{item.sub}</p>
                    </div>
                    <span className="text-xs font-bold text-gray-900">
                      Rp {item.nominal.toLocaleString('id-ID')}
                    </span>
                  </div>

                  {/* Progress Bar Alokasi */}
                  <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className={`h-full ${item.warna} rounded-full`} style={{ width: `${item.persen}%` }} />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 shrink-0">
                <span className="text-xs text-gray-400 font-semibold w-8 text-right">{item.persen}%</span>
                <button
                  onClick={() => setSelectedAlokasi(item)}
                  className="px-3 py-1.5 border border-gray-200 hover:border-teal-500 hover:text-teal-600 text-gray-600 rounded-xl text-xs font-semibold transition"
                >
                  Detail ›
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* FOOTER ACTIONS */}
        <div className="pt-6 border-t border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-[10px] text-gray-400 font-medium">Laba Bersih</p>
            <p className="text-lg font-bold text-teal-600">Rp {labaBersih.toLocaleString('id-ID')}</p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => triggerToast('Rekonsiliasi keuangan berhasil diperbarui.')}
              className="px-5 py-2.5 bg-[#25A99D] hover:bg-teal-600 text-white rounded-xl text-xs font-bold shadow-sm transition"
            >
              Simpan Alokasi
            </button>
            <button
              onClick={() => triggerToast('Jurnal transaksi berhasil di-export ke Excel/PDF.')}
              className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Export Jurnal
            </button>
          </div>
        </div>
      </div>

      {/* TOAST NOTIFIKASI KANAN BAWAH */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-start gap-3 p-3.5 px-4 bg-[#E6F8F3] border border-[#25A99D]/30 rounded-2xl shadow-xl max-w-xs transition animate-fade-in">
          <div className="w-5 h-5 rounded-full border border-[#25A99D] flex items-center justify-center text-[#25A99D] text-[10px] font-bold shrink-0 mt-0.5">
            ✓
          </div>
          <div className="flex-1 pr-2">
            <p className="text-xs font-bold text-gray-900 leading-tight">Alokasi Disimpan</p>
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