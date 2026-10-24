// app/Admin/laporan-keuangan/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function LaporanKeuanganAdmin() {
  const router = useRouter();
  const [tanggalHariIni, setTanggalHariIni] = useState('30 September 2026');
  const [namaAdmin, setNamaAdmin] = useState('Nadia A.');
  const [jabatanAdmin, setJabatanAdmin] = useState('Admin');

  // State untuk Tab Aktif: 'Laba Rugi' | 'Arus Kas' | 'Neraca'
  const [activeTab, setActiveTab] = useState<'Laba Rugi' | 'Arus Kas' | 'Neraca'>('Laba Rugi');
  const [selectedBulan, setSelectedBulan] = useState('September 2026');

  useEffect(() => {
    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' };
    setTanggalHariIni(new Date().toLocaleDateString('id-ID', options));
    const savedNama = localStorage.getItem('adminNama');
    const savedJabatan = localStorage.getItem('adminJabatan');
    if (savedNama) setNamaAdmin(savedNama);
    if (savedJabatan) setJabatanAdmin(savedJabatan);
  }, []);

  return (
    <div className="min-h-screen bg-[#F4F5F7] flex font-sans text-slate-800 w-full relative">
      {/* KONTEN UTAMA */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Isi Halaman */}
        <main className="p-6 space-y-6 overflow-y-auto">
          
          {/* Bar Filter Bulan & Tab Navigasi */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <select 
              value={selectedBulan} 
              onChange={(e) => setSelectedBulan(e.target.value)}
              className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 outline-none focus:ring-2 focus:ring-[#2EC4B6]"
            >
              <option>September 2026</option>
              <option>Agustus 2026</option>
              <option>Juli 2026</option>
            </select>

            {/* TAB SWITCHER */}
            <div className="bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-1 text-xs font-bold">
              {(['Laba Rugi', 'Arus Kas', 'Neraca'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-5 py-2 rounded-xl transition ${
                    activeTab === tab ? 'bg-[#1A1D2E] text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* KONTEN 1: LAPORAN LABA RUGI */}
          {activeTab === 'Laba Rugi' && (
            <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-8">
              
              <div className="flex justify-between items-start pb-4 border-b border-slate-100">
                <div>
                  <h2 className="text-base font-bold text-slate-900">Laporan Laba Rugi</h2>
                  <p className="text-xs text-slate-400">1 September 2026 — 30 September 2026</p>
                </div>
                <button onClick={() => alert('Export PDF Laba Rugi')} className="px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 rounded-xl text-xs font-bold transition flex items-center gap-1.5">
                  ↓ Export PDF
                </button>
              </div>

              {/* Pendapatan */}
              <div className="space-y-3 text-xs">
                <p className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">Pendapatan</p>
                <div className="space-y-2.5">
                  <div className="flex justify-between py-1 border-b border-slate-50">
                    <span className="text-slate-600 font-medium">Jasa Tindakan Umum</span>
                    <span className="font-bold text-slate-900">Rp 41.400.000</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-50">
                    <span className="text-slate-600 font-medium">Jasa Tindakan Estetik</span>
                    <span className="font-bold text-slate-900">Rp 27.200.000</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-50">
                    <span className="text-slate-600 font-medium">Jasa Lab (Markup)</span>
                    <span className="font-bold text-slate-900">Rp 8.600.000</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-600 font-medium">Jasa Konsultasi</span>
                    <span className="font-bold text-slate-900">Rp 8.200.000</span>
                  </div>
                </div>
                <div className="flex justify-between items-center pt-3 border-t border-slate-200 font-bold text-slate-900">
                  <span>Total Pendapatan</span>
                  <span className="text-sm">Rp 85.400.000</span>
                </div>
              </div>

              {/* Biaya Operasional */}
              <div className="space-y-3 text-xs pt-4 border-t border-slate-100">
                <p className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">Biaya Operasional</p>
                <div className="space-y-2.5">
                  <div className="flex justify-between py-1 border-b border-slate-50"><span className="text-slate-600 font-medium">Beban BMHP</span><span className="font-bold text-slate-900">Rp 12.750.000</span></div>
                  <div className="flex justify-between py-1 border-b border-slate-50"><span className="text-slate-600 font-medium">Biaya Lab Vendor</span><span className="font-bold text-slate-900">Rp 15.300.000</span></div>
                  <div className="flex justify-between py-1 border-b border-slate-50"><span className="text-slate-600 font-medium">Bagi Hasil Dokter</span><span className="font-bold text-slate-900">Rp 29.750.000</span></div>
                  <div className="flex justify-between py-1 border-b border-slate-50"><span className="text-slate-600 font-medium">Bagi Hasil Perawat</span><span className="font-bold text-slate-900">Rp 4.250.000</span></div>
                  <div className="flex justify-between py-1 border-b border-slate-50"><span className="text-slate-600 font-medium">Gaji Staf</span><span className="font-bold text-slate-900">Rp 8.500.000</span></div>
                  <div className="flex justify-between py-1 border-b border-slate-50"><span className="text-slate-600 font-medium">Utilitas</span><span className="font-bold text-slate-900">Rp 3.400.000</span></div>
                  <div className="flex justify-between py-1"><span className="text-slate-600 font-medium">Maintenance Alat</span><span className="font-bold text-slate-900">Rp 2.550.000</span></div>
                </div>
                <div className="flex justify-between items-center pt-3 border-t border-slate-200 font-bold text-slate-900">
                  <span>Total Biaya</span>
                  <span className="text-sm">Rp 76.500.000</span>
                </div>
              </div>

              {/* Laba Bersih Banner */}
              <div className="p-6 bg-teal-50/60 border border-teal-100 rounded-2xl flex justify-between items-center">
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">Laba Bersih</span>
                <span className="text-lg font-bold text-[#2EC4B6]">Rp 8.900.000</span>
              </div>

            </div>
          )}

          {/* KONTEN 2: LAPORAN ARUS KAS */}
          {activeTab === 'Arus Kas' && (
            <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-8">
              
              <div className="flex justify-between items-start pb-4 border-b border-slate-100">
                <div>
                  <h2 className="text-base font-bold text-slate-900">Laporan Arus Kas</h2>
                  <p className="text-xs text-slate-400">September 2026</p>
                </div>
                <button onClick={() => alert('Export PDF Arus Kas')} className="px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 rounded-xl text-xs font-bold transition flex items-center gap-1.5">
                  ↓ Export PDF
                </button>
              </div>

              {/* Aktivitas Operasi */}
              <div className="space-y-3 text-xs">
                <p className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">Aktivitas Operasi</p>
                <div className="space-y-2.5">
                  <div className="flex justify-between py-1 border-b border-slate-50"><span className="text-slate-600 font-medium">Penerimaan dari pasien</span><span className="font-bold text-emerald-600">+Rp 85.400.000</span></div>
                  <div className="flex justify-between py-1 border-b border-slate-50"><span className="text-slate-600 font-medium">Pembayaran BMHP & Lab</span><span className="font-bold text-rose-500">-Rp 28.050.000</span></div>
                  <div className="flex justify-between py-1 border-b border-slate-50"><span className="text-slate-600 font-medium">Pembayaran gaji & bagi hasil</span><span className="font-bold text-rose-500">-Rp 42.500.000</span></div>
                  <div className="flex justify-between py-1"><span className="text-slate-600 font-medium">Pembayaran utilitas</span><span className="font-bold text-rose-500">-Rp 3.400.000</span></div>
                </div>
                <div className="flex justify-between items-center pt-3 border-t border-slate-200 font-bold text-slate-900">
                  <span>Net Arus Kas</span>
                  <span className="text-sm text-emerald-600">+Rp 11.450.000</span>
                </div>
              </div>

              {/* Aktivitas Investasi */}
              <div className="space-y-3 text-xs pt-4 border-t border-slate-100">
                <p className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">Aktivitas Investasi</p>
                <div className="space-y-2.5">
                  <div className="flex justify-between py-1"><span className="text-slate-600 font-medium">Pembelian alat dental chair</span><span className="font-bold text-rose-500">-Rp 12.000.000</span></div>
                </div>
                <div className="flex justify-between items-center pt-3 border-t border-slate-200 font-bold text-slate-900">
                  <span>Net Arus Kas</span>
                  <span className="text-sm text-rose-500">Rp -12.000.000</span>
                </div>
              </div>

            </div>
          )}

          {/* KONTEN 3: NERACA KEUANGAN */}
          {activeTab === 'Neraca' && (
            <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-8">
              
              <div className="flex justify-between items-start pb-4 border-b border-slate-100">
                <div>
                  <h2 className="text-base font-bold text-slate-900">Neraca Keuangan</h2>
                  <p className="text-xs text-slate-400">Per 30 September 2026</p>
                </div>
                <button onClick={() => alert('Export PDF Neraca')} className="px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 rounded-xl text-xs font-bold transition flex items-center gap-1.5">
                  ↓ Export PDF
                </button>
              </div>

              {/* Dua Kolom Neraca: Aset vs Liabilitas & Ekuitas */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 text-xs">
                
                {/* Kolom Kiri: Aset */}
                <div className="space-y-6">
                  <p className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">Aset</p>
                  
                  <div className="space-y-2">
                    <p className="font-bold text-slate-900">Aset Lancar</p>
                    <div className="flex justify-between py-1"><span className="text-slate-600">Kas & Setara Kas</span><span className="font-bold text-slate-900">Rp 72.500.000</span></div>
                    <div className="flex justify-between py-1"><span className="text-slate-600">Piutang Pasien</span><span className="font-bold text-slate-900">Rp 8.650.000</span></div>
                    <div className="flex justify-between py-1 border-b border-slate-100 pb-2"><span className="text-slate-600">Persediaan BMHP</span><span className="font-bold text-slate-900">Rp 5.200.000</span></div>
                    <div className="flex justify-between font-bold text-[#2EC4B6] pt-1">
                      <span>Total Aset Lancar</span>
                      <span>Rp 86.350.000</span>
                    </div>
                  </div>

                  <div className="space-y-2 pt-2">
                    <p className="font-bold text-slate-900">Aset Tetap</p>
                    <div className="flex justify-between py-1"><span className="text-slate-600">Peralatan Dental</span><span className="font-bold text-slate-900">Rp 180.000.000</span></div>
                    <div className="flex justify-between py-1"><span className="text-slate-600">Akumulasi Penyusutan</span><span className="font-bold text-rose-500">(Rp 45.000.000)</span></div>
                    <div className="flex justify-between py-1 border-b border-slate-100 pb-2"><span className="text-slate-600">Inventaris Kantor</span><span className="font-bold text-slate-900">Rp 15.000.000</span></div>
                    <div className="flex justify-between font-bold text-[#2EC4B6] pt-1">
                      <span>Total Aset Tetap</span>
                      <span>Rp 150.000.000</span>
                    </div>
                  </div>

                </div>

                {/* Kolom Kanan: Liabilitas & Ekuitas */}
                <div className="space-y-6">
                  <p className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">Liabilitas & Ekuitas</p>
                  
                  <div className="space-y-2">
                    <p className="font-bold text-slate-900">Liabilitas</p>
                    <div className="flex justify-between py-1"><span className="text-slate-600">Utang Vendor Lab</span><span className="font-bold text-slate-900">Rp 15.300.000</span></div>
                    <div className="flex justify-between py-1 border-b border-slate-100 pb-2"><span className="text-slate-600">Utang Gaji</span><span className="font-bold text-slate-900">Rp 8.500.000</span></div>
                    <div className="flex justify-between font-bold text-[#2EC4B6] pt-1">
                      <span>Total Liabilitas</span>
                      <span>Rp 23.800.000</span>
                    </div>
                  </div>

                  <div className="space-y-2 pt-2">
                    <p className="font-bold text-slate-900">Ekuitas Pemilik</p>
                    <div className="flex justify-between py-1"><span className="text-slate-600">Modal Awal</span><span className="font-bold text-slate-900">Rp 200.000.000</span></div>
                    <div className="flex justify-between py-1 border-b border-slate-100 pb-2"><span className="text-slate-600">Laba Ditahan</span><span className="font-bold text-slate-900">Rp 12.550.000</span></div>
                    <div className="flex justify-between font-bold text-[#2EC4B6] pt-1">
                      <span>Total Ekuitas Pemilik</span>
                      <span>Rp 212.550.000</span>
                    </div>
                  </div>

                </div>

              </div>

            </div>
          )}

        </main>
      </div>
    </div>
  );
}