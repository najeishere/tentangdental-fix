// app/Admin/pencatatan-tagihan/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function PencatatanTagihanAdmin() {
  const router = useRouter();
  const [tanggalHariIni, setTanggalHariIni] = useState('');
  const [namaAdmin, setNamaAdmin] = useState('Nadia A.');
  const [jabatanAdmin, setJabatanAdmin] = useState('Admin');

  // State untuk status invoice (Draft / Finalisasi)
  const [statusInvoice, setStatusInvoice] = useState<'Draft' | 'Finalisasi'>('Draft');

  useEffect(() => {
    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' };
    const todayStr = new Date().toLocaleDateString('id-ID', options);
    setTanggalHariIni(todayStr);
    const savedNama = localStorage.getItem('adminNama');
    const savedJabatan = localStorage.getItem('adminJabatan');
    if (savedNama) setNamaAdmin(savedNama);
    if (savedJabatan) setJabatanAdmin(savedJabatan);
  }, []);

  const handleFinalisasi = () => {
    setStatusInvoice('Finalisasi');
    alert('Invoice berhasil difinalisasi dan digenerate!');
  };

  const handleLanjutPembayaran = () => {
    // Navigasi ke halaman pembayaran sesuai permintaan
    router.push('/Admin/pembayaran');
  };

  return (
    <div className="min-h-screen bg-[#F4F5F7] flex font-sans text-slate-800 w-full relative">
      

      {/* KONTEN UTAMA */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Isi Halaman */}
        <main className="p-6 space-y-6 overflow-y-auto">
          <p className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">Daftar Invoice</p>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Sisi Kiri: Daftar Invoice Card */}
            <div className="lg:col-span-5 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
              <div className="p-4 border-2 border-[#2EC4B6] bg-teal-50/30 rounded-2xl cursor-pointer space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-[#2EC4B6]">INV-2026-092</span>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${statusInvoice === 'Draft' ? 'bg-slate-100 text-slate-500' : 'bg-blue-100 text-blue-600'}`}>
                    {statusInvoice}
                  </span>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">Dewi Rahayu</p>
                  <p className="text-[10px] text-slate-400">16 Sep 2026</p>
                </div>
                <p className="text-xs font-bold text-slate-900 pt-1">Rp 378.000</p>
              </div>
            </div>

            {/* Sisi Kanan: Detail Invoice & Action */}
            <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-6">
              
              {/* Header Invoice Detail */}
              <div className="flex justify-between items-start pb-4 border-b border-slate-100">
                <div>
                  <h3 className="text-base font-bold text-slate-900">INV-2026-092</h3>
                  <p className="text-xs text-slate-500">Pasien: Dewi Rahayu · 16 Sep 2026</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${statusInvoice === 'Draft' ? 'bg-slate-100 text-slate-500' : 'bg-blue-100 text-blue-600'}`}>
                  {statusInvoice}
                </span>
              </div>

              {/* Rincian Tindakan */}
              <div className="space-y-4 text-xs">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 tracking-wider uppercase mb-2">Jasa Konsultasi / Tindakan</p>
                  <div className="flex justify-between items-center py-1">
                    <span className="font-medium text-slate-700">Scaling & Polishing</span>
                    <span className="font-bold text-[#2EC4B6]">Rp 350.000</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100">
                  <p className="text-[10px] font-bold text-slate-400 tracking-wider uppercase mb-2">Biaya BMHP</p>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-slate-700">Polishing Paste (10g)</span>
                      <span className="font-medium text-slate-900">Rp 25.000</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-slate-700">Sarung Tangan (2 pasang)</span>
                      <span className="font-medium text-slate-900">Rp 3.000</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Total Tagihan */}
              <div className="pt-4 border-t border-slate-200 flex justify-between items-center">
                <span className="text-xs font-bold text-slate-900">Total Tagihan</span>
                <span className="text-base font-bold text-[#2EC4B6]">Rp 378.000</span>
              </div>

              {/* Tombol Aksi */}
              <div className="flex items-center gap-3 pt-2">
                {statusInvoice === 'Draft' ? (
                  <button 
                    onClick={handleFinalisasi}
                    className="flex-1 py-3 bg-[#2EC4B6] hover:bg-[#259f93] text-white rounded-xl text-xs font-bold transition shadow-sm text-center"
                  >
                    Finalisasi & Generate Invoice
                  </button>
                ) : (
                  <button 
                    onClick={handleLanjutPembayaran}
                    className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition shadow-sm text-center flex items-center justify-center gap-2"
                  >
                    <span></span> Lanjut ke Pembayaran
                  </button>
                )}

                <button 
                  onClick={() => alert('Print Preview Invoice')}
                  className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition flex items-center gap-2"
                >
                  <span>👁</span> Print Preview
                </button>
              </div>

            </div>

          </div>
        </main>
      </div>
    </div>
  );
}