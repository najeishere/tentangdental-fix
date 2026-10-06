// app/Admin/pembayaran/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { fetchApi } from '@/utils/api';

export default function PembayaranAdmin() {
  const router = useRouter();
  const [tanggalHariIni, setTanggalHariIni] = useState('');
  const [namaAdmin, setNamaAdmin] = useState('Nadia A.');
  const [jabatanAdmin, setJabatanAdmin] = useState('Admin');

  // State alur pembayaran
  const [step, setStep] = useState<'list' | 'proses' | 'sukses'>('list');
  const [metodePembayaran, setMetodePembayaran] = useState<'Tunai' | 'Transfer' | 'QRIS'>('Tunai');
  const [uangDiterima, setUangDiterima] = useState('');

  // Data Keuangan & Invoice — dari API
  const [kasMasuk, setKasMasuk] = useState(4545000);
  const [jumlahSudahLunas, setJumlahSudahLunas] = useState(2);
  const [isLunas, setIsLunas] = useState(false);
  const [visit, setVisit] = useState<{ id: number; invoice_number: string; total: number; payment_status: string; patient_name: string; visit_date: string } | null>(null);
  const [totalTagihan, setTotalTagihan] = useState(0);

  const [daftarLunas, setDaftarLunas] = useState([
    { nama: 'Reza Pratama', inv: 'INV-2026-091', via: 'via QRIS', nominal: 'Rp 4.150.000' },
    { nama: 'Rina Kartika', inv: 'INV-2026-089', via: 'via QRIS', nominal: 'Rp 395.000' },
  ]);

  useEffect(() => {
    // Tanggal otomatis menyesuaikan hari ini
    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' };
    const todayStr = new Date().toLocaleDateString('id-ID', options);
    setTanggalHariIni(todayStr);

    const savedNama = localStorage.getItem('adminNama');
    const savedJabatan = localStorage.getItem('adminJabatan');
    if (savedNama) setNamaAdmin(savedNama);
    if (savedJabatan) setJabatanAdmin(savedJabatan);
  }, []);

  // Ambil data kunjungan/Invoice ketika komponen mount atau step berubah
  useEffect(() => {
    const loadVisit = async () => {
      try {
        // Coba ambil visit terakhir atau yang sedang diproses
        // Untuk sekarang gunakan visit statis karena belum ada navigasi dari pencatatan-tagihan
        // di masa depan bisa dari API: fetchApi('/visits/latest')
        const dummyVisit = {
          id: 13,
          invoice_number: 'INV-2026-092',
          total: 378000,
          payment_status: 'partial',
          patient_name: 'Dewi Rahayu',
          visit_date: '16 Sep 2026',
        };
        setVisit(dummyVisit);
        setTotalTagihan(dummyVisit?.total ?? 0);
      } catch (e) {
        console.error('Gagal load visit', e);
      }
    };
    loadVisit();
  }, [step]);

  const handleKonfirmasiPembayaran = async () => {
    if (!visit || totalTagihan <= 0) {
      alert('Data invoice tidak lengkap');
      return;
    }

    const amount = metodePembayaran === 'Tunai' 
      ? (parseInt(uangDiterima.replace(/[^0-9]/g, '')) || totalTagihan)
      : totalTagihan;

    const methodMap: Record<'Tunai' | 'Transfer' | 'QRIS', string> = {
      Tunai: 'cash',
      Transfer: 'transfer',
      QRIS: 'qris',
    };

    try {
      await fetchApi('/payments', {
        method: 'POST',
        body: JSON.stringify({
          visit_id: visit.id,
          method: methodMap[metodePembayaran],
          amount,
          paid_by: localStorage.getItem('adminNama') || 'Admin',
        }),
      });

      // Setelah pembayaran sukses, perbarui state lokal
      const paymentAmount = metodePembayaran === 'Tunai' ? amount : totalTagihan;
      setKasMasuk(prev => prev + paymentAmount);
      setJumlahSudahLunas(prev => prev + 1);
      setIsLunas(true);

      // Tambahkan ke daftar lunas
      setDaftarLunas(prev => [
        { nama: visit.patient_name, inv: visit.invoice_number, via: `via ${metodePembayaran}`, nominal: `Rp ${paymentAmount.toLocaleString('id-ID')}` },
        ...prev
      ]);

      setStep('sukses');
    } catch (err: any) {
      alert(err.message || 'Gagal mencatat pembayaran. Periksa kembali data.');
      console.error('Payment error:', err);
    }
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
                <Link href="/Admin/pencatatan-tagihan" className="px-3 py-2 rounded-xl hover:bg-white/5 hover:text-white cursor-pointer transition flex items-center gap-3">
                  <svg className="w-4 h-4 opacity-70" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"/></svg>
                  Pencatatan Tagihan
                </Link>
                <div className="px-3 py-2 bg-[#2EC4B6] text-white font-medium rounded-xl flex items-center gap-3 shadow-sm cursor-pointer">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/></svg>
                  Pembayaran
                </div>
                {[
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
            <h1 className="text-base font-bold text-slate-900">Pembayaran</h1>
            <p className="text-[11px] text-slate-500">Proses pembayaran & kas harian</p>
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
          
          {step === 'sukses' ? (
            /* LAYAR SUKSES PEMBAYARAN */
            <div className="bg-white p-12 rounded-2xl border border-slate-200/80 shadow-sm text-center space-y-5 my-auto">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
              </div>
              <div className="space-y-1">
                <h2 className="text-lg font-bold text-slate-900">Pembayaran Berhasil!</h2>
                <p className="text-xs text-slate-500">Invoice INV-2026-092 telah lunas dan dicatat ke kas harian.</p>
              </div>
              <div className="flex justify-center gap-3 pt-3">
                <button 
                  onClick={() => setStep('list')}
                  className="px-6 py-2.5 bg-[#2EC4B6] hover:bg-[#259f93] text-white rounded-xl text-xs font-bold transition shadow-sm"
                >
                  Pembayaran Lain
                </button>
                <button 
                  onClick={() => alert('Navigasi ke Rekonsiliasi')}
                  className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition"
                >
                  Ke Rekonsiliasi
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* KARTU RINGKASAN ATAS */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
                  <div className="w-10 h-10 bg-teal-50 text-[#2EC4B6] rounded-xl flex items-center justify-center">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Kas Masuk Hari Ini</p>
                    <p className="text-lg font-bold text-slate-900">Rp {kasMasuk.toLocaleString('id-ID')}</p>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
                  <div className="w-10 h-10 bg-amber-50 text-amber-500 rounded-xl flex items-center justify-center">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Menunggu Bayar</p>
                    <p className="text-lg font-bold text-slate-900">{isLunas ? 0 : 1}</p>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
                  <div className="w-10 h-10 bg-emerald-50 text-emerald-500 rounded-xl flex items-center justify-center">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Sudah Lunas</p>
                    <p className="text-lg font-bold text-slate-900">{jumlahSudahLunas}</p>
                  </div>
                </div>
              </div>

              {/* KONTEN UTAMA DUA KOLOM */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                
                {/* SISI KIRI: DAFTAR PEMBAYARAN */}
                <div className="lg:col-span-7 space-y-6">
                  
                  {/* Menunggu Pembayaran */}
                  <div className="space-y-3">
                    <p className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">Menunggu Pembayaran</p>
                    {isLunas ? (
                      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm text-center text-slate-400 text-xs">
                        ✓ Semua invoice sudah lunas
                      </div>
                    ) : (
                      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex justify-between items-center">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-[#2EC4B6]">INV-2026-092</span>
                            <span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full text-[10px] font-bold">Finalisasi</span>
                          </div>
                          <p className="text-xs font-bold text-slate-900">Dewi Rahayu</p>
                          <p className="text-sm font-bold text-slate-900 pt-1">Rp 378.000</p>
                        </div>
                        <button 
                          onClick={() => setStep('proses')}
                          className="px-4 py-2.5 bg-[#2EC4B6] hover:bg-[#259f93] text-white rounded-xl text-xs font-bold transition shadow-sm"
                        >
                          Proses Bayar
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Sudah Lunas Hari Ini */}
                  <div className="space-y-3">
                    <p className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">Sudah Lunas Hari Ini</p>
                    <div className="space-y-3">
                      {daftarLunas.map((item, idx) => (
                        <div key={idx} className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex justify-between items-center">
                          <div>
                            <p className="text-xs font-bold text-slate-900">{item.nama}</p>
                            <p className="text-[10px] text-slate-400">{item.inv} · {item.via}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs font-bold text-slate-900">{item.nominal}</p>
                            <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-bold">✓ Lunas</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

                {/* SISI KANAN: PANEL PROSES PEMBAYARAN */}
                <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
                  {step === 'proses' && !isLunas ? (
                    <div className="space-y-5">
                      <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                        <h3 className="text-sm font-bold text-slate-900">Proses Pembayaran</h3>
                        <button onClick={() => setStep('list')} className="text-slate-400 hover:text-slate-600 font-bold">✕</button>
                      </div>

                      <div className="p-4 bg-slate-50 rounded-xl space-y-1">
                        <p className="text-[10px] text-slate-400">Total Tagihan — Dewi Rahayu</p>
                        <p className="text-lg font-bold text-slate-900">Rp 378.000</p>
                      </div>

                      {/* Pilihan Metode Pembayaran */}
                      <div className="space-y-2 text-xs">
                        <p className="font-semibold text-slate-500">Metode Pembayaran</p>
                        <div className="grid grid-cols-3 gap-2">
                          {(['Tunai', 'Transfer', 'QRIS'] as const).map((m) => (
                            <button
                              key={m}
                              type="button"
                              onClick={() => setMetodePembayaran(m)}
                              className={`py-2.5 rounded-xl font-bold border transition ${
                                metodePembayaran === m ? 'border-[#2EC4B6] bg-teal-50/50 text-[#2EC4B6]' : 'border-slate-200 text-slate-600 bg-white'
                              }`}
                            >
                              {m}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Kondisional Input berdasarkan Metode */}
                      {metodePembayaran === 'Tunai' && (
                        <div className="space-y-1 text-xs">
                          <label className="font-semibold text-slate-500">Uang Diterima</label>
                          <input 
                            type="text" 
                            placeholder="Masukkan nominal" 
                            value={uangDiterima}
                            onChange={(e) => setUangDiterima(e.target.value)}
                            className="w-full px-4 py-2.5 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-[#2EC4B6]"
                          />
                        </div>
                      )}

                      {metodePembayaran === 'Transfer' && (
                        <div className="p-3 bg-slate-50 rounded-xl text-xs space-y-1">
                          <p className="font-bold text-slate-700">Rekening Klinik</p>
                          <p className="font-bold text-slate-900">BCA — 1234567890</p>
                          <p className="text-[10px] text-slate-400">a.n. Klinik TentangDental</p>
                        </div>
                      )}

                      {metodePembayaran === 'QRIS' && (
                        <div className="p-4 bg-slate-50 rounded-xl text-center space-y-2">
                          <div className="w-28 h-28 bg-slate-200 mx-auto rounded-lg flex items-center justify-center text-slate-500 text-xs font-bold">
                            <svg className="w-12 h-12 text-slate-400" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 3h6v6H3V3zm12 0h6v6h-6V3zM3 15h6v6H3v-6zm15-3h3v3h-3v-3zm-3 3h3v3h-3v-3zm3 3h3v3h-3v-3z"/></svg>
                          </div>
                          <p className="text-[10px] text-slate-400">Scan QR dengan aplikasi pembayaran</p>
                        </div>
                      )}

                      <button 
                        onClick={handleKonfirmasiPembayaran}
                        className="w-full py-3 bg-[#2EC4B6] hover:bg-[#259f93] text-white rounded-xl text-xs font-bold transition shadow-sm"
                      >
                        Konfirmasi Pembayaran & Catat ke Kas
                      </button>
                    </div>
                  ) : (
                    <div className="py-20 text-center space-y-3">
                      <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/></svg>
                      </div>
                      <p className="text-xs text-slate-400 font-medium">Pilih invoice untuk diproses</p>
                    </div>
                  )}
                </div>

              </div>
            </>
          )}

        </main>
      </div>
    </div>
  );
}