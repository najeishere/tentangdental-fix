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
    // Invoice sudah siap, langsung navigasi ke halaman pembayaran
    router.push('/Admin/pembayaran');
  };

  const handleLanjutPembayaran = () => {
    // Navigasi ke halaman pembayaran sesuai permintaan
    router.push('/Admin/pembayaran');
  };

  return (
    <div className="min-h-screen bg-[#F4F5F7] flex font-sans text-slate-800 w-full relative">
      
      {/* SIDEBAR KIRI */}
      <aside className="w-64 bg-[#1A1D2E] text-white flex flex-col justify-between shrink-0 h-screen sticky top-0 overflow-y-auto">
        <div>
          <div className="px-6 py-4 border-b border-white/10 flex items-center gap-3">
            <div className="w-9 h-9 bg-white rounded-xl flex items-center justify-center overflow-hidden shadow-sm">
              <Image src="/logo.png" alt="Logo" width={36} height={36} className="object-contain" />
            </div>
            <div>
              <h2 className="text-sm font-bold tracking-wide">TentangDental</h2>
              <p className="text-xs text-[#2EC4B6]">Finance Admin</p>
            </div>
          </div>

          <div className="p-3 space-y-4 text-xs">
            <div>
              <p className="text-[10px] font-bold text-slate-400 tracking-wider uppercase px-3 mb-1.5">Overview</p>
              <Link href="/Admin/dashboard" className="px-3 py-2 rounded-xl text-slate-300 hover:bg-white/5 hover:text-white cursor-pointer transition flex items-center gap-3">
                <svg className="w-4 h-4 opacity-70" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/></svg>
                Dashboard
              </Link>
            </div>

            <div>
              <p className="text-[10px] font-bold text-slate-400 tracking-wider uppercase px-3 mb-1.5">Operasional</p>
              <div className="space-y-0.5 text-slate-300">
                <Link href="/Admin/manajemen-antrean" className="px-3 py-2 rounded-xl hover:bg-white/5 hover:text-white cursor-pointer transition flex items-center gap-3">
                  <svg className="w-4 h-4 opacity-70" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
                  Manajemen Antrean
                </Link>
                <div className="px-3 py-2 bg-[#2EC4B6] text-white font-medium rounded-xl flex items-center gap-3 shadow-sm cursor-pointer">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"/></svg>
                  Pencatatan Tagihan
                </div>
                {[
                  { name: 'Pembayaran', path: '/Admin/pembayaran', icon: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z' },
                  { name: 'Pengiriman Lab', path: '/Admin/pengiriman-lab', icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4' },
                  { name: 'Catatan BMHP', path: '/Admin/catatan-bmhp', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' }
                ].map((menu, i) => (
                  <Link key={i} href={menu.path} className="px-3 py-2 rounded-xl hover:bg-white/5 hover:text-white cursor-pointer transition flex items-center gap-3">
                    <svg className="w-4 h-4 opacity-70" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d={menu.icon}/></svg>
                    {menu.name}
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <p className="text-[10px] font-bold text-slate-400 tracking-wider uppercase px-3 mb-1.5">Keuangan</p>
              <div className="space-y-0.5 text-slate-300">
                <Link href="/Admin/rekonsiliasi" className="px-3 py-2 rounded-xl hover:bg-white/5 hover:text-white cursor-pointer transition flex items-center gap-3">
                  <svg className="w-4 h-4 opacity-70" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"/></svg>
                  Rekonsiliasi
                </Link>
                <Link href="/Admin/laporan-keuangan" className="px-3 py-2 rounded-xl hover:bg-white/5 hover:text-white cursor-pointer transition flex items-center gap-3">
                  <svg className="w-4 h-4 opacity-70" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>
                  Laporan Keuangan
                </Link>
              </div>
            </div>

            <div>
              <p className="text-[10px] font-bold text-slate-400 tracking-wider uppercase px-3 mb-1.5">Data & Sistem</p>
              <div className="space-y-0.5 text-slate-300">
                {[
                    { name: 'Data Pasien', path: '/Admin/data-pasien', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' },
                    { name: 'Data Tindakan', path: '/Admin/data-tindakan', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4' },
                    { name: 'Pengaturan', path: '/Admin/pengaturan', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065zM15 12a3 3 0 11-6 0 3 3 0 016 0z' }
                ].map((menu, i) => (
                    <Link key={i} href={menu.path} className="px-3 py-2 rounded-xl hover:bg-white/5 hover:text-white cursor-pointer transition flex items-center gap-3">
                        <svg className="w-4 h-4 opacity-70" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d={menu.icon}/></svg>
                        {menu.name}
                    </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="p-3 border-t border-white/10 space-y-3">
          <Link href="/Admin/login" className="flex items-center gap-2.5 text-xs text-slate-400 hover:text-white transition px-3 py-1.5 font-medium">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
            Keluar Akun
          </Link>
        </div>
      </aside>

      {/* KONTEN UTAMA */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Header Atas */}
        <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-20">
          <div>
            <h1 className="text-base font-bold text-slate-900">Pencatatan Tagihan</h1>
            <p className="text-[11px] text-slate-500">Generate invoice dari tindakan medis</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-600 flex items-center gap-2">
              <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
              {tanggalHariIni}
            </div>

            <button className="w-9 h-9 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-center relative hover:bg-slate-100 transition text-slate-600">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>
              <span className="w-2 h-2 bg-rose-500 rounded-full absolute top-2 right-2"></span>
            </button>

            <div 
              onClick={() => router.push('/Admin/pengaturan')}
              className="flex items-center gap-2.5 pl-2 pr-3 py-1 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl cursor-pointer transition"
            >
              <div className="w-7 h-7 bg-[#2EC4B6] rounded-full text-white font-bold text-xs flex items-center justify-center shadow-sm">
                {namaAdmin.charAt(0)}
              </div>
              <div className="text-left">
                <p className="text-xs font-bold text-slate-900 leading-tight">{namaAdmin}</p>
                <p className="text-[10px] text-slate-400">{jabatanAdmin}</p>
              </div>
            </div>
          </div>
        </header>

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