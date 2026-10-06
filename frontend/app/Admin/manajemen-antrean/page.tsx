// app/Admin/manajemen-antrean/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function ManajemenAntreanAdmin() {
  const router = useRouter();
  const [tanggalHariIni, setTanggalHariIni] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [namaAdmin, setNamaAdmin] = useState('Nadia A.');
  const [jabatanAdmin, setJabatanAdmin] = useState('Finance Admin');

  // State untuk Modal Tambah Manual
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formBaru, setFormBaru] = useState({
    nama: '',
    telepon: '',
    keluhan: '',
    dokter: 'drg. Sari Dewi',
    tanggal: '2026-09-30',
    jam: '09:00',
  });

  const daftarJam = [
    { jam: '07:30', status: 'tersedia' },
    { jam: '08:00', status: 'tersedia' },
    { jam: '08:30', status: 'tersedia' },
    { jam: '09:00', status: 'tersedia' },
    { jam: '09:30', status: 'tersedia' },
    { jam: '10:00', status: 'tersedia' },
    { jam: '10:30', status: 'tersedia' },
    { jam: '11:00', status: 'terisi' },
    { jam: '11:30', status: 'dipilih' },
    { jam: '12:00', status: 'terisi' },
  ];

  useEffect(() => {
    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' };
    const todayStr = new Date().toLocaleDateString('id-ID', options);
    setTanggalHariIni(todayStr);
    const savedNama = localStorage.getItem('adminNama');
    const savedJabatan = localStorage.getItem('adminJabatan');
    if (savedNama) setNamaAdmin(savedNama);
    if (savedJabatan) setJabatanAdmin(savedJabatan);
  }, []);

  const [daftarAntrean, setDaftarAntrean] = useState([
    { id: 1, no: 'A-040', nama: 'Dewi Rahayu', usia: '42 tahun', dokter: 'drg. Sari Dewi', tanggal: '30 September 2026', jam: '09:30', keluhan: 'Gigi sensitif', status: 'Dalam Proses', validasi: 'Tervalidasi', aksi: 'Billing' },
    { id: 2, no: 'A-041', nama: 'Budi Santoso', usia: '31 tahun', dokter: 'drg. Sari Dewi', tanggal: '30 September 2026', jam: '10:00', keluhan: 'Scaling rutin', status: 'Menunggu', validasi: 'Belum', aksi: 'Validasi' },
  ]);

  const filteredAntrean = daftarAntrean.filter(item => 
    item.nama.toLowerCase().includes(searchQuery.toLowerCase()) || 
    item.no.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleProsesAksi = (id: number, currentAksi: string) => {
    if (currentAksi === 'Billing') {
      router.push('/Admin/pencatatan-tagihan');
      return;
    }

    setDaftarAntrean(prev => prev.map(item => {
      if (item.id === id && currentAksi === 'Validasi') {
        return { ...item, status: 'Dalam Proses', validasi: 'Tervalidasi', aksi: 'Billing' };
      }
      return item;
    }));
  };

  const handleTambahAntrean = (e: React.FormEvent) => {
    e.preventDefault();
    
    const dateObj = new Date(formBaru.tanggal);
    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' };
    const formattedDate = isNaN(dateObj.getTime()) ? formBaru.tanggal : dateObj.toLocaleDateString('id-ID', options);

    const nomorBaru = `A-04${daftarAntrean.length + 2}`;
    const dataBaru = {
      id: Date.now(),
      no: nomorBaru,
      nama: formBaru.nama,
      usia: '25 tahun',
      dokter: formBaru.dokter,
      tanggal: formattedDate,
      jam: formBaru.jam,
      keluhan: formBaru.keluhan,
      status: 'Menunggu',
      validasi: 'Belum',
      aksi: 'Validasi',
    };

    setDaftarAntrean([dataBaru, ...daftarAntrean]);
    setIsModalOpen(false);
    setFormBaru({ nama: '', telepon: '', keluhan: '', dokter: 'drg. Sari Dewi', tanggal: '2026-09-30', jam: '09:00' });
    alert(`Antrean manual untuk tanggal ${formattedDate} berhasil ditambahkan!`);
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
                <div className="px-3 py-2 bg-[#2EC4B6] text-white font-medium rounded-xl flex items-center gap-3 shadow-sm cursor-pointer">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
                  Manajemen Antrean
                </div>
                <Link href="/Admin/pencatatan-tagihan" className="px-3 py-2 rounded-xl hover:bg-white/5 hover:text-white cursor-pointer transition flex items-center gap-3">
                  <svg className="w-4 h-4 opacity-70" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"/></svg>
                  Pencatatan Tagihan
                </Link>
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
            <h1 className="text-base font-bold text-slate-900">Manajemen Antrean</h1>
            <p className="text-[11px] text-slate-500">Validasi dan kelola antrean pasien</p>
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
        <main className="p-6 space-y-5 overflow-y-auto">
          
          <div className="px-4 py-3 bg-amber-50 border border-amber-100 text-amber-700 rounded-xl text-[11px] font-semibold">
            Data contoh — manajemen antrean belum terhubung backend (belum ada endpoint antrean); data tersimpan lokal di browser.
          </div>

          <div className="flex justify-end">
            <button 
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2.5 bg-[#2EC4B6] hover:bg-[#259f93] text-white rounded-xl text-xs font-bold transition shadow-sm flex items-center gap-1.5"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/></svg>
              Tambah Manual
            </button>
          </div>

          {/* MODAL TAMBAH MANUAL */}
          {isModalOpen && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4 relative w-full">
              <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                <h3 className="text-sm font-bold text-slate-900">Tambah Antrean Manual</h3>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="text-slate-400 hover:text-slate-600 font-bold text-base"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleTambahAntrean} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-slate-500 font-semibold mb-1">Nama Pasien</label>
                    <input 
                      type="text" 
                      placeholder="Nama lengkap" 
                      value={formBaru.nama}
                      onChange={(e) => setFormBaru({...formBaru, nama: e.target.value})}
                      required
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-[#2EC4B6]"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-500 font-semibold mb-1">No. Telepon</label>
                    <input 
                      type="text" 
                      inputMode="numeric"
                      pattern="[0-9]*"
                      placeholder="08xx" 
                      value={formBaru.telepon}
                      onChange={(e) => {
                        const numericValue = e.target.value.replace(/\D/g, '');
                        setFormBaru({...formBaru, telepon: numericValue});
                      }}
                      required
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-[#2EC4B6]"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-500 font-semibold mb-1">Keluhan</label>
                    <input 
                      type="text" 
                      placeholder="Keluhan utama" 
                      value={formBaru.keluhan}
                      onChange={(e) => setFormBaru({...formBaru, keluhan: e.target.value})}
                      required
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-[#2EC4B6]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-500 font-semibold mb-1">Dokter</label>
                    <select 
                      value={formBaru.dokter}
                      onChange={(e) => setFormBaru({...formBaru, dokter: e.target.value})}
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-[#2EC4B6] bg-white"
                    >
                      <option>drg. Sari Dewi</option>
                      <option>drg. Hendra K.</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-500 font-semibold mb-1">Tanggal Kunjungan</label>
                    <input 
                      type="date" 
                      value={formBaru.tanggal}
                      onChange={(e) => setFormBaru({...formBaru, tanggal: e.target.value})}
                      required
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-[#2EC4B6]"
                    />
                  </div>
                </div>

                {/* Sesi Jam Interaktif dengan Keterangan */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-slate-500">
                      Pilih Sesi Jam <span className="text-slate-400 font-normal">— {formBaru.tanggal}</span>
                    </span>
                    <div className="flex items-center gap-4 text-[10px] text-slate-500">
                      <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 border border-slate-300 rounded-sm bg-white"></span> Tersedia</span>
                      <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-[#2EC4B6] rounded-sm"></span> Dipilih</span>
                      <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-slate-200 rounded-sm"></span> Terisi</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-5 md:grid-cols-10 gap-2 pt-1">
                    {daftarJam.map((item, idx) => {
                      const isSelected = formBaru.jam === item.jam;
                      const isTerisi = item.status === 'terisi';

                      return (
                        <button
                          key={idx}
                          type="button"
                          disabled={isTerisi}
                          onClick={() => setFormBaru({...formBaru, jam: item.jam})}
                          className={`py-2 rounded-xl text-xs font-bold transition border ${
                            isTerisi 
                              ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed' 
                              : isSelected 
                              ? 'bg-[#2EC4B6] text-white border-[#2EC4B6] shadow-sm' 
                              : 'bg-white text-slate-700 border-slate-200 hover:border-[#2EC4B6]'
                          }`}
                        >
                          {item.jam}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <button 
                  type="submit" 
                  className="w-full py-3 bg-[#2EC4B6] hover:bg-[#259f93] text-white rounded-xl text-xs font-bold transition shadow-sm mt-2"
                >
                  Tambahkan ke Antrean
                </button>
              </form>
            </div>
          )}

          {/* Tabel Manajemen Antrean */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
            
            <div className="flex flex-col md:flex-row justify-between items-center gap-3 pb-2 border-b border-slate-100">
              <div className="relative w-full md:w-96">
                <svg className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                <input 
                  type="text" 
                  placeholder="Cari nama atau nomor antrean..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-[#2EC4B6] text-xs text-slate-800"
                />
              </div>
              <span className="text-xs font-medium text-slate-400">
                {filteredAntrean.length} dari {daftarAntrean.length} antrean
              </span>
            </div>

            {/* Tabel Data */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="text-slate-400 border-b border-slate-100">
                    <th className="pb-3 font-semibold">No.</th>
                    <th className="pb-3 font-semibold">Pasien</th>
                    <th className="pb-3 font-semibold">Dokter</th>
                    <th className="pb-3 font-semibold">Tanggal & Jam</th>
                    <th className="pb-3 font-semibold">Keluhan</th>
                    <th className="pb-3 font-semibold">Status</th>
                    <th className="pb-3 font-semibold">Validasi</th>
                    <th className="pb-3 font-semibold text-left">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {filteredAntrean.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50 transition">
                      <td className="py-3.5 font-bold text-[#2EC4B6]">{item.no}</td>
                      <td className="py-3.5">
                        <p className="font-bold text-slate-900">{item.nama}</p>
                        <p className="text-[10px] text-slate-400">{item.usia}</p>
                      </td>
                      <td className="py-3.5 font-medium text-slate-600">{item.dokter}</td>
                      <td className="py-3.5 text-slate-500 font-medium">
                        <p>{item.tanggal}</p>
                        <p className="text-[10px] text-slate-400">{item.jam}</p>
                      </td>
                      <td className="py-3.5 text-slate-600">{item.keluhan}</td>
                      <td className="py-3.5">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          item.status === 'Selesai' ? 'bg-emerald-50 text-emerald-600' :
                          item.status === 'Dalam Proses' ? 'bg-blue-50 text-blue-600' : 'bg-amber-50 text-amber-600'
                        }`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="py-3.5">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          item.validasi === 'Tervalidasi' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'
                        }`}>
                          {item.validasi}
                        </span>
                      </td>
                      <td className="py-3.5 text-left">
                        {item.aksi === 'Validasi' ? (
                          <button 
                            onClick={() => handleProsesAksi(item.id, 'Validasi')}
                            className="px-3 py-1.5 bg-[#2EC4B6] hover:bg-[#259f93] text-white rounded-xl font-bold transition shadow-sm"
                          >
                            Validasi
                          </button>
                        ) : item.aksi === 'Billing' ? (
                          <button 
                            onClick={() => handleProsesAksi(item.id, 'Billing')}
                            className="px-3 py-1.5 bg-teal-50 text-[#2EC4B6] hover:bg-teal-100 rounded-xl font-bold transition"
                          >
                            Billing
                          </button>
                        ) : (
                          <span className="text-slate-400 font-medium">Selesai Dibayar</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>

        </main>
      </div>
    </div>
  );
}