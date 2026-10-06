// app/Admin/data-pasien/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function DataPasienAdmin() {
  const router = useRouter();
  const [tanggalHariIni, setTanggalHariIni] = useState('1 Oktober 2026');
  const [namaAdmin, setNamaAdmin] = useState('Nadia A.');
  const [jabatanAdmin, setJabatanAdmin] = useState('Admin');
  const [searchQuery, setSearchQuery] = useState('');

  // State Modal Pasien Baru
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formPasien, setFormPasien] = useState({
    nama: '',
    usia: '',
    telepon: '',
    email: '',
    alamat: '',
    status: 'Aktif',
  });

  // Daftar Data Pasien Sesuai Figma
  const [daftarPasien, setDaftarPasien] = useState([
    { id: 'P-00124', inisial: 'B', nama: 'Budi Santoso', usia: '31 th', telepon: '0812-3456-7890', kunjungan: '16 Sep 2026', total: '12x', status: 'Aktif' },
    { id: 'P-00123', inisial: 'S', nama: 'Siti Nurhaliza', usia: '27 th', telepon: '0813-2345-6789', kunjungan: '12 Sep 2026', total: '5x', status: 'Aktif' },
    { id: 'P-00122', inisial: 'R', nama: 'Reza Pratama', usia: '24 th', telepon: '0814-3456-7890', kunjungan: '16 Sep 2026', total: '3x', status: 'Aktif' },
    { id: 'P-00121', inisial: 'S', nama: 'Sri Wahyuni', usia: '55 th', telepon: '0815-4567-8901', kunjungan: '16 Sep 2026', total: '8x', status: 'Aktif' },
    { id: 'P-00120', inisial: 'D', nama: 'Dewi Rahayu', usia: '42 th', telepon: '0816-5678-9012', kunjungan: '16 Sep 2026', total: '6x', status: 'Aktif' },
    { id: 'P-00119', inisial: 'F', nama: 'Farhan Maulana', usia: '35 th', telepon: '0817-6789-0123', kunjungan: '16 Sep 2026', total: '4x', status: 'Aktif' },
    { id: 'P-00118', inisial: 'R', nama: 'Rina Kartika', usia: '28 th', telepon: '0818-7890-1234', kunjungan: '16 Sep 2026', total: '7x', status: 'Aktif' },
    { id: 'P-00117', inisial: 'A', nama: 'Agus Setiawan', usia: '45 th', telepon: '0819-8901-2345', kunjungan: '05 Sep 2026', total: '10x', status: 'Aktif' },
  ]);

  useEffect(() => {
    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' };
    setTanggalHariIni(new Date().toLocaleDateString('id-ID', options));

    const savedNama = localStorage.getItem('adminNama');
    const savedJabatan = localStorage.getItem('adminJabatan');
    if (savedNama) setNamaAdmin(savedNama);
    if (savedJabatan) setJabatanAdmin(savedJabatan);
  }, []);

  const filteredPasien = daftarPasien.filter(p => 
    p.nama.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.telepon.includes(searchQuery)
  );

  const handleTambahPasien = (e: React.FormEvent) => {
    e.preventDefault();
    const idBaru = `P-001${daftarPasien.length + 25}`;
    const inisialBaru = formPasien.nama.charAt(0).toUpperCase();

    const pasienBaru = {
      id: idBaru,
      inisial: inisialBaru,
      nama: formPasien.nama,
      usia: `${formPasien.usia} th`,
      telepon: formPasien.telepon,
      kunjungan: 'Baru saja',
      total: '1x',
      status: formPasien.status,
    };

    setDaftarPasien([pasienBaru, ...daftarPasien]);
    setIsModalOpen(false);
    setFormPasien({ nama: '', usia: '', telepon: '', email: '', alamat: '', status: 'Aktif' });
    alert('Pasien baru berhasil didaftarkan!');
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
                <Link href="/Admin/pembayaran" className="px-3 py-2 rounded-xl hover:bg-white/5 hover:text-white cursor-pointer transition flex items-center gap-3">
                  <svg className="w-4 h-4 opacity-70" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/></svg>
                  Pembayaran
                </Link>
                {[
                  { name: 'Pengiriman Lab', path: '#', icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4' },
                  { name: 'Catatan BMHP', path: '#', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' }
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
                <div className="px-3 py-2 bg-[#2EC4B6] text-white font-medium rounded-xl flex items-center gap-3 shadow-sm cursor-pointer">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
                  Data Pasien
                </div>
                <Link href="#" className="px-3 py-2 rounded-xl hover:bg-white/5 hover:text-white cursor-pointer transition flex items-center gap-3">Data Tindakan</Link>
                <Link href="/Admin/pengaturan" className="px-3 py-2 rounded-xl hover:bg-white/5 hover:text-white cursor-pointer transition flex items-center gap-3">Pengaturan</Link>
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
            <h1 className="text-base font-bold text-slate-900">Data Pasien</h1>
            <p className="text-[11px] text-slate-500">Daftar seluruh pasien terdaftar</p>
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
          
          <div className="flex justify-between items-center">
            <p className="text-xs font-bold text-slate-500">{filteredPasien.length} pasien terdaftar</p>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2.5 bg-[#2EC4B6] hover:bg-[#259f93] text-white rounded-xl text-xs font-bold transition shadow-sm flex items-center gap-1.5"
            >
              <span>+</span> Pasien Baru
            </button>
          </div>

          {/* MODAL TAMBAH PASIEN BARU */}
          {isModalOpen && (
            <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xl space-y-4 w-full max-w-lg relative animate-in fade-in zoom-in-95 duration-150">
                <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Tambah Pasien Baru</h3>
                    <p className="text-[11px] text-slate-400">Lengkapi informasi pasien di bawah ini.</p>
                  </div>
                  <button 
                    onClick={() => setIsModalOpen(false)}
                    className="text-slate-400 hover:text-slate-600 font-bold text-base"
                  >
                    ✕
                  </button>
                </div>

                <form onSubmit={handleTambahPasien} className="space-y-4 text-xs">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-slate-500 font-semibold mb-1">Nama Lengkap</label>
                      <input 
                        type="text" 
                        placeholder="Nama pasien" 
                        value={formPasien.nama}
                        onChange={(e) => setFormPasien({...formPasien, nama: e.target.value})}
                        required
                        className="w-full px-4 py-2.5 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-[#2EC4B6]"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-500 font-semibold mb-1">Usia (Tahun)</label>
                      <input 
                        type="number" 
                        placeholder="0" 
                        value={formPasien.usia}
                        onChange={(e) => setFormPasien({...formPasien, usia: e.target.value})}
                        required
                        className="w-full px-4 py-2.5 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-[#2EC4B6]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-slate-500 font-semibold mb-1">Nomor Telepon</label>
                      <input 
                        type="text" 
                        placeholder="08xxxxxxxxxx" 
                        value={formPasien.telepon}
                        onChange={(e) => setFormPasien({...formPasien, telepon: e.target.value})}
                        required
                        className="w-full px-4 py-2.5 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-[#2EC4B6]"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-500 font-semibold mb-1">Email</label>
                      <input 
                        type="email" 
                        placeholder="nama@email.com" 
                        value={formPasien.email}
                        onChange={(e) => setFormPasien({...formPasien, email: e.target.value})}
                        className="w-full px-4 py-2.5 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-[#2EC4B6]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-500 font-semibold mb-1">Alamat</label>
                    <textarea 
                      rows={3}
                      placeholder="Alamat lengkap pasien" 
                      value={formPasien.alamat}
                      onChange={(e) => setFormPasien({...formPasien, alamat: e.target.value})}
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-[#2EC4B6]"
                    ></textarea>
                  </div>

                  <div>
                    <label className="block text-slate-500 font-semibold mb-1">Status</label>
                    <select 
                      value={formPasien.status}
                      onChange={(e) => setFormPasien({...formPasien, status: e.target.value})}
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-[#2EC4B6] bg-white"
                    >
                      <option>Aktif</option>
                      <option>Non-Aktif</option>
                    </select>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button 
                      type="button" 
                      onClick={() => setIsModalOpen(false)}
                      className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition"
                    >
                      Batal
                    </button>
                    <button 
                      type="submit" 
                      className="flex-1 py-3 bg-[#2EC4B6] hover:bg-[#259f93] text-white rounded-xl font-bold transition shadow-sm"
                    >
                      Tambah Pasien
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Tabel Data Pasien */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
            
            <div className="relative w-full">
              <svg className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
              <input 
                type="text" 
                placeholder="Cari nama, ID, atau nomor telepon..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-[#2EC4B6] text-xs text-slate-800"
              />
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="text-slate-400 border-b border-slate-100">
                    <th className="pb-3 font-semibold">ID Pasien</th>
                    <th className="pb-3 font-semibold">Nama</th>
                    <th className="pb-3 font-semibold">Usia</th>
                    <th className="pb-3 font-semibold">Telepon</th>
                    <th className="pb-3 font-semibold">Kunjungan Terakhir</th>
                    <th className="pb-3 font-semibold">Total Kunjungan</th>
                    <th className="pb-3 font-semibold">Status</th>
                    <th className="pb-3 font-semibold text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {filteredPasien.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50 transition">
                      <td className="py-3.5 font-bold text-[#2EC4B6]">{p.id}</td>
                      <td className="py-3.5 flex items-center gap-2.5">
                        <div className="w-7 h-7 bg-teal-50 text-[#2EC4B6] rounded-full flex items-center justify-center font-bold text-xs shadow-sm">
                          {p.inisial}
                        </div>
                        <span className="font-bold text-slate-900">{p.nama}</span>
                      </td>
                      <td className="py-3.5 text-slate-600">{p.usia}</td>
                      <td className="py-3.5 text-slate-600">{p.telepon}</td>
                      <td className="py-3.5 text-slate-600">{p.kunjungan}</td>
                      <td className="py-3.5">
                        <span className="px-2.5 py-0.5 bg-teal-50 text-[#2EC4B6] rounded-full font-bold text-[10px]">
                          {p.total}
                        </span>
                      </td>
                      <td className="py-3.5">
                        <span className="px-2.5 py-1 bg-emerald-50 text-emerald-600 rounded-full font-bold text-[10px] flex items-center gap-1 w-fit">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> {p.status}
                        </span>
                      </td>
                      <td className="py-3.5 text-right">
                        <button 
                          onClick={() => alert(`Melihat detail pasien: ${p.nama}`)}
                          className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition"
                        >
                          Detail
                        </button>
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