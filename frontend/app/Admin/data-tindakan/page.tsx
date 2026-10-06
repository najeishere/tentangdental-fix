// app/Admin/data-tindakan/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function DataTindakanAdmin() {
  const router = useRouter();
  const [tanggalHariIni, setTanggalHariIni] = useState('1 Oktober 2026');
  const [namaAdmin, setNamaAdmin] = useState('Nadia A.');
  const [jabatanAdmin, setJabatanAdmin] = useState('Admin');

  // State Tab Aktif
  const [activeTab, setActiveTab] = useState<'Tindakan Langsung' | 'Tindakan + Lab'>('Tindakan Langsung');

  // State Modal Tambah
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [formTambah, setFormTambah] = useState({
    nama: '',
    kategori: '',
    tarif: '',
    durasi: '',
    aktif: true,
  });

  // State Modal Edit
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedTindakan, setSelectedTindakan] = useState<{
    kode: string;
    nama: string;
    kategori: string;
    tarif: string;
    durasi: string;
    aktif: boolean;
  } | null>(null);

  // Data Tindakan Langsung Sesuai Figma
  const [tindakanLangsung, setTindakanLangsung] = useState([
    { kode: 'T001', nama: 'Scaling & Polishing', kategori: 'Preventif', tarif: 'Rp 350.000', durasi: '45 mnt', aktif: true },
    { kode: 'T002', nama: 'Tambal Gigi Komposit', kategori: 'Restoratif', tarif: 'Rp 280.000', durasi: '60 mnt', aktif: true },
    { kode: 'T003', nama: 'Pencabutan Gigi Susu', kategori: 'Bedah Minor', tarif: 'Rp 150.000', durasi: '30 mnt', aktif: true },
    { kode: 'T004', nama: 'Pencabutan Gigi Dewasa', kategori: 'Bedah Minor', tarif: 'Rp 300.000', durasi: '45 mnt', aktif: true },
    { kode: 'T005', nama: 'Perawatan Saluran Akar', kategori: 'Endodontik', tarif: 'Rp 750.000', durasi: '90 mnt', aktif: true },
    { kode: 'T006', nama: 'Konsultasi', kategori: 'Umum', tarif: 'Rp 100.000', durasi: '15 mnt', aktif: true },
    { kode: 'T007', nama: 'Pembersihan Karang Gigi', kategori: 'Preventif', tarif: 'Rp 200.000', durasi: '30 mnt', aktif: true },
    { kode: 'T008', nama: 'Bleaching Gigi', kategori: 'Estetik', tarif: 'Rp 1.500.000', durasi: '90 mnt', aktif: true },
  ]);

  // Data Tindakan + Lab Sesuai Figma
  const [tindakanLab, setTindakanLab] = useState([
    { kode: 'L001', nama: 'Crown Zirconia', kategori: 'Prostodontik', tarif: 'Rp 3.500.000', durasi: '2 minggu', aktif: true },
    { kode: 'L002', nama: 'Behel Metal', kategori: 'Ortodontik', tarif: 'Rp 5.500.000', durasi: 'Berlanjut', aktif: true },
    { kode: 'L003', nama: 'Behel Ceramic', kategori: 'Ortodontik', tarif: 'Rp 7.500.000', durasi: 'Berlanjut', aktif: true },
    { kode: 'L004', nama: 'Implan Gigi (per unit)', kategori: 'Implantologi', tarif: 'Rp 12.000.000', durasi: '3 bulan', aktif: true },
    { kode: 'L005', nama: 'Gigi Tiruan Sebagian (GTS)', kategori: 'Prostodontik', tarif: 'Rp 2.800.000', durasi: '1 minggu', aktif: true },
    { kode: 'L006', nama: 'Veneer Porselen', kategori: 'Estetik', tarif: 'Rp 3.000.000', durasi: '1 minggu', aktif: true },
  ]);

  useEffect(() => {
    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' };
    setTanggalHariIni(new Date().toLocaleDateString('id-ID', options));

    const savedNama = localStorage.getItem('adminNama');
    const savedJabatan = localStorage.getItem('adminJabatan');
    if (savedNama) setNamaAdmin(savedNama);
    if (savedJabatan) setJabatanAdmin(savedJabatan);
  }, []);

  const handleTambahSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newKode = activeTab === 'Tindakan Langsung' 
      ? `T00${tindakanLangsung.length + 1}` 
      : `L00${tindakanLab.length + 1}`;

    const formattedTarif = `Rp ${Number(formTambah.tarif).toLocaleString('id-ID')}`;

    const newItem = {
      kode: newKode,
      nama: formTambah.nama,
      kategori: formTambah.kategori || 'Umum',
      tarif: formattedTarif,
      durasi: formTambah.durasi,
      aktif: formTambah.aktif,
    };

    if (activeTab === 'Tindakan Langsung') {
      setTindakanLangsung([...tindakanLangsung, newItem]);
    } else {
      setTindakanLab([...tindakanLab, newItem]);
    }

    setIsAddModalOpen(false);
    setFormTambah({ nama: '', kategori: '', tarif: '', durasi: '', aktif: true });
    alert('Tindakan baru berhasil ditambahkan!');
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTindakan) return;

    if (activeTab === 'Tindakan Langsung') {
      setTindakanLangsung(tindakanLangsung.map(item => item.kode === selectedTindakan.kode ? selectedTindakan : item));
    } else {
      setTindakanLab(tindakanLab.map(item => item.kode === selectedTindakan.kode ? selectedTindakan : item));
    }

    setIsEditModalOpen(false);
    setSelectedTindakan(null);
    alert('Perubahan tindakan berhasil disimpan!');
  };

  const currentList = activeTab === 'Tindakan Langsung' ? tindakanLangsung : tindakanLab;

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
                <Link href="/Admin/data-pasien" className="px-3 py-2 rounded-xl hover:bg-white/5 hover:text-white cursor-pointer transition flex items-center gap-3">
                  <svg className="w-4 h-4 opacity-70" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
                  Data Pasien
                </Link>
                <div className="px-3 py-2 bg-[#2EC4B6] text-white font-medium rounded-xl flex items-center gap-3 shadow-sm cursor-pointer">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/></svg>
                  Data Tindakan
                </div>
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
            <h1 className="text-base font-bold text-slate-900">Katalog Tindakan</h1>
            <p className="text-[11px] text-slate-500">Daftar layanan dan tarif klinik</p>
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
            {/* TAB SWITCHER */}
            <div className="bg-white p-1 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-1 text-xs font-bold">
              {(['Tindakan Langsung', 'Tindakan + Lab'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-5 py-2 rounded-xl transition ${
                    activeTab === tab ? 'bg-slate-100 text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <button 
              onClick={() => setIsAddModalOpen(true)}
              className="px-4 py-2.5 bg-[#2EC4B6] hover:bg-[#259f93] text-white rounded-xl text-xs font-bold transition shadow-sm flex items-center gap-1.5"
            >
              <span>+</span> Tambah Tindakan
            </button>
          </div>

          {/* MODAL TAMBAH TINDAKAN */}
          {isAddModalOpen && (
            <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xl space-y-4 w-full max-w-lg relative animate-in fade-in zoom-in-95 duration-150">
                <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Tambah Tindakan</h3>
                    <p className="text-[11px] text-slate-400">{activeTab}</p>
                  </div>
                  <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-600 font-bold">✕</button>
                </div>

                <form onSubmit={handleTambahSubmit} className="space-y-4 text-xs">
                  <div>
                    <label className="block text-slate-500 font-semibold mb-1">Nama Tindakan</label>
                    <input 
                      type="text" 
                      placeholder="Contoh: Scaling" 
                      value={formTambah.nama}
                      onChange={(e) => setFormTambah({...formTambah, nama: e.target.value})}
                      required
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-[#2EC4B6]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-slate-500 font-semibold mb-1">Kategori</label>
                      <input 
                        type="text" 
                        placeholder="Preventif / Restoratif" 
                        value={formTambah.kategori}
                        onChange={(e) => setFormTambah({...formTambah, kategori: e.target.value})}
                        required
                        className="w-full px-4 py-2.5 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-[#2EC4B6]"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-500 font-semibold mb-1">Tarif (Rp)</label>
                      <input 
                        type="text" 
                        placeholder="350000" 
                        value={formTambah.tarif}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, '');
                          setFormTambah({...formTambah, tarif: val});
                        }}
                        required
                        className="w-full px-4 py-2.5 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-[#2EC4B6]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-500 font-semibold mb-1">Durasi Estimasi</label>
                    <input 
                      type="text" 
                      placeholder="Contoh: 45 mnt / 2 minggu" 
                      value={formTambah.durasi}
                      onChange={(e) => setFormTambah({...formTambah, durasi: e.target.value})}
                      required
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-[#2EC4B6]"
                    />
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <input 
                      type="checkbox" 
                      id="aktifCheck"
                      checked={formTambah.aktif}
                      onChange={(e) => setFormTambah({...formTambah, aktif: e.target.checked})}
                      className="w-4 h-4 text-[#2EC4B6] rounded border-slate-300 focus:ring-[#2EC4B6]"
                    />
                    <label htmlFor="aktifCheck" className="font-medium text-slate-700">Tindakan aktif dan dapat dipilih</label>
                  </div>

                  <div className="flex gap-3 pt-3">
                    <button type="button" onClick={() => setIsAddModalOpen(false)} className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition">
                      Batal
                    </button>
                    <button type="submit" className="flex-1 py-3 bg-[#2EC4B6] hover:bg-[#259f93] text-white rounded-xl font-bold transition shadow-sm">
                      Tambah Tindakan
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* MODAL EDIT TINDAKAN */}
          {isEditModalOpen && selectedTindakan && (
            <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xl space-y-4 w-full max-w-lg relative animate-in fade-in zoom-in-95 duration-150">
                <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Edit Tindakan</h3>
                    <p className="text-[11px] text-[#2EC4B6] font-bold">{selectedTindakan.kode}</p>
                  </div>
                  <button onClick={() => setIsEditModalOpen(false)} className="text-slate-400 hover:text-slate-600 font-bold">✕</button>
                </div>

                <form onSubmit={handleEditSubmit} className="space-y-4 text-xs">
                  <div>
                    <label className="block text-slate-500 font-semibold mb-1">Nama Tindakan</label>
                    <input 
                      type="text" 
                      value={selectedTindakan.nama}
                      onChange={(e) => setSelectedTindakan({...selectedTindakan, nama: e.target.value})}
                      required
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-[#2EC4B6]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-slate-500 font-semibold mb-1">Kategori</label>
                      <input 
                        type="text" 
                        value={selectedTindakan.kategori}
                        onChange={(e) => setSelectedTindakan({...selectedTindakan, kategori: e.target.value})}
                        required
                        className="w-full px-4 py-2.5 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-[#2EC4B6]"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-500 font-semibold mb-1">Tarif (Teks / Format Rupiah)</label>
                      <input 
                        type="text" 
                        value={selectedTindakan.tarif}
                        onChange={(e) => setSelectedTindakan({...selectedTindakan, tarif: e.target.value})}
                        required
                        className="w-full px-4 py-2.5 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-[#2EC4B6]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-500 font-semibold mb-1">Durasi Estimasi</label>
                    <input 
                      type="text" 
                      value={selectedTindakan.durasi}
                      onChange={(e) => setSelectedTindakan({...selectedTindakan, durasi: e.target.value})}
                      required
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-[#2EC4B6]"
                    />
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <input 
                      type="checkbox" 
                      id="editAktifCheck"
                      checked={selectedTindakan.aktif}
                      onChange={(e) => setSelectedTindakan({...selectedTindakan, aktif: e.target.checked})}
                      className="w-4 h-4 text-[#2EC4B6] rounded border-slate-300 focus:ring-[#2EC4B6]"
                    />
                    <label htmlFor="editAktifCheck" className="font-medium text-slate-700">Tindakan aktif dan dapat dipilih</label>
                  </div>

                  <div className="flex gap-3 pt-3">
                    <button type="button" onClick={() => setIsEditModalOpen(false)} className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition">
                      Batal
                    </button>
                    <button type="submit" className="flex-1 py-3 bg-[#2EC4B6] hover:bg-[#259f93] text-white rounded-xl font-bold transition shadow-sm">
                      Simpan Perubahan
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Tabel Katalog Tindakan */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="text-slate-400 border-b border-slate-100">
                    <th className="pb-3 font-semibold">Kode</th>
                    <th className="pb-3 font-semibold">Nama Tindakan</th>
                    <th className="pb-3 font-semibold">Kategori</th>
                    <th className="pb-3 font-semibold">Tarif</th>
                    <th className="pb-3 font-semibold">Durasi Est.</th>
                    <th className="pb-3 font-semibold">Status</th>
                    <th className="pb-3 font-semibold text-right">Edit</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {currentList.map((item) => (
                    <tr key={item.kode} className="hover:bg-slate-50 transition">
                      <td className="py-3.5 font-bold text-[#2EC4B6]">{item.kode}</td>
                      <td className="py-3.5 font-bold text-slate-900">{item.nama}</td>
                      <td className="py-3.5">
                        <span className="px-2.5 py-1 bg-slate-100 text-slate-600 rounded-full font-medium text-[10px]">
                          {item.kategori}
                        </span>
                      </td>
                      <td className="py-3.5 font-bold text-[#2EC4B6]">{item.tarif}</td>
                      <td className="py-3.5 text-slate-600">{item.durasi}</td>
                      <td className="py-3.5">
                        <span className="px-2.5 py-1 bg-emerald-50 text-emerald-600 rounded-full font-bold text-[10px]">
                          {item.aktif ? 'Aktif' : 'Non-Aktif'}
                        </span>
                      </td>
                      <td className="py-3.5 text-right">
                        <button 
                          onClick={() => {
                            setSelectedTindakan(item);
                            setIsEditModalOpen(true);
                          }}
                          className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition"
                        >
                          Edit
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