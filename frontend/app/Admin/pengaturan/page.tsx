// app/Admin/pengaturan/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { fetchApi } from '@/utils/api';

export default function PengaturanAdmin() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'profil' | 'klinik' | 'akun'>('profil');
  const [tanggalHariIni, setTanggalHariIni] = useState('');
  const [isEditingProfil, setIsEditingProfil] = useState(false);

  const [profilData, setProfilData] = useState({
    nama: 'Nadia A.',
    jabatan: 'Finance Admin',
    email: 'nadia@tentangdental.id',
    telepon: '0813-0911-2233',
    sandiLama: '',
    sandiBaru: '',
    konfirmasiSandi: '',
  });

  const [originalProfilData, setOriginalProfilData] = useState(profilData);

  const [klinikData, setKlinikData] = useState({
    namaKlinik: 'TentangDental',
    emailKlinik: 'info@tentangdental.id',
    teleponKlinik: '(021) 555-1234',
    alamat: 'Jl. Kesehatan No. 12, Jakarta Selatan',
    jamBuka: '08:00',
    jamTutup: '20:00',
  });

  useEffect(() => {
    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' };
    setTanggalHariIni(new Date().toLocaleDateString('id-ID', options));

    const load = async () => {
      try {
        const json = await fetchApi('/me');
        const u = json?.data?.user;
        if (u) {
          setProfilData((p) => ({
            ...p,
            nama: u.name ?? p.nama,
            email: u.email ?? p.email,
            jabatan: localStorage.getItem('adminJabatan') ?? p.jabatan,
          }));
          setOriginalProfilData((p) => ({
            ...p,
            nama: u.name ?? p.nama,
            email: u.email ?? p.email,
            jabatan: localStorage.getItem('adminJabatan') ?? p.jabatan,
          }));
        }
      } catch (e) {
        console.error('Gagal memuat profil', e);
      }
    };
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleMulaiEdit = () => {
    setOriginalProfilData(profilData);
    setIsEditingProfil(true);
  };

  const handleSimpanProfil = () => {
    // Validasi sederhana sandi baru jika diisi
    if (profilData.sandiBaru && profilData.sandiBaru !== profilData.konfirmasiSandi) {
      alert('Konfirmasi kata sandi baru tidak cocok!');
      return;
    }
    setOriginalProfilData(profilData);
    setIsEditingProfil(false);
    alert('Profil ditampilkan dari server, tetapi perubahan (termasuk kata sandi) belum dapat disimpan — backend belum menyediakan endpoint ubah profil/sandi akun. Perubahan hanya berlaku di sesi ini.');
  };

  const handleBatalEdit = () => {
    setProfilData(originalProfilData);
    setIsEditingProfil(false);
  };

  return (
    <div className="min-h-screen bg-[#F4F5F7] flex font-sans text-slate-800 w-full">
      
      {/* SIDEBAR KIRI */}
      <aside className="w-64 bg-[#1A1D2E] text-white flex flex-col justify-between shrink-0 h-screen sticky top-0 overflow-y-auto">
        <div>
          <div className="px-6 py-5 border-b border-white/10 flex items-center gap-3">
            <div className="w-9 h-9 bg-white rounded-xl flex items-center justify-center overflow-hidden shadow-sm">
              <Image src="/logo.png" alt="Logo" width={36} height={36} className="object-contain" />
            </div>
            <div>
              <h2 className="text-sm font-bold tracking-wide">TentangDental</h2>
              <p className="text-xs text-[#2EC4B6]">Finance Admin</p>
            </div>
          </div>

          <div className="p-4 space-y-6 text-sm">
            <div>
              <p className="text-[10px] font-bold text-slate-400 tracking-wider uppercase px-3 mb-2">Overview</p>
              <Link href="/Admin/dashboard" className="px-3 py-2.5 rounded-xl text-slate-300 hover:bg-white/5 hover:text-white cursor-pointer transition flex items-center gap-3">
                Dashboard
              </Link>
            </div>

            <div>
              <p className="text-[10px] font-bold text-slate-400 tracking-wider uppercase px-3 mb-2">Sistem</p>
              <div className="px-3 py-2.5 bg-[#2EC4B6] text-white font-medium rounded-xl flex items-center gap-3 shadow-sm cursor-pointer">
                Pengaturan
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-white/10">
          <Link href="/Admin/login" className="flex items-center gap-2.5 text-xs text-slate-400 hover:text-white transition px-3 py-2 font-medium">
            Keluar Akun
          </Link>
        </div>
      </aside>

      {/* KONTEN UTAMA */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Header Atas */}
        <header className="h-20 bg-white border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-20 w-full">
          <div>
            <h1 className="text-lg font-bold text-slate-900">Pengaturan Sistem</h1>
            <p className="text-xs text-slate-500">Konfigurasi klinik dan akun</p>
          </div>

          <div className="flex items-center gap-4">
            <div className="px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-600 flex items-center gap-2">
              <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
              {tanggalHariIni || 'Memuat...'}
            </div>

            <div className="flex items-center gap-3 pl-2 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl">
              <div className="w-8 h-8 bg-[#2EC4B6] rounded-full text-white font-bold text-xs flex items-center justify-center shadow-sm">
                {profilData.nama.charAt(0)}
              </div>
              <div className="text-left">
                <p className="text-xs font-bold text-slate-900 leading-tight">{profilData.nama}</p>
                <p className="text-[10px] text-slate-400">Admin</p>
              </div>
            </div>
          </div>
        </header>

        {/* Isi Pengaturan */}
        <main className="p-8 space-y-6 w-full">
          
          {/* Tab Navigasi */}
          <div className="bg-white p-2 rounded-2xl border border-slate-200/80 shadow-sm inline-flex gap-2">
            <button 
              onClick={() => setActiveTab('profil')} 
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition ${activeTab === 'profil' ? 'bg-[#2EC4B6] text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'}`}
            >
              Profil Saya
            </button>
            <button 
              onClick={() => setActiveTab('klinik')} 
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition ${activeTab === 'klinik' ? 'bg-[#2EC4B6] text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'}`}
            >
              Info Klinik
            </button>
            <button 
              onClick={() => setActiveTab('akun')} 
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition ${activeTab === 'akun' ? 'bg-[#2EC4B6] text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'}`}
            >
              Akun & Pengguna
            </button>
          </div>

          {/* TAB 1: PROFIL SAYA */}
          {activeTab === 'profil' && (
            <div className="space-y-6 w-full">
              <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm w-full">
                <div className="flex justify-between items-center pb-6 border-b border-slate-100">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-[#1A1D2E] text-white rounded-2xl flex items-center justify-center font-bold text-xl shadow-sm">
                      {profilData.nama.charAt(0)}
                    </div>
                    <div>
                      <h2 className="text-base font-bold text-slate-900">{profilData.nama}</h2>
                      <p className="text-xs text-slate-400">{profilData.jabatan}</p>
                    </div>
                  </div>
                  
                  {!isEditingProfil && (
                    <button 
                      onClick={handleMulaiEdit}
                      className="px-4 py-2 bg-emerald-50 text-[#2EC4B6] hover:bg-emerald-100 rounded-xl text-xs font-bold transition"
                    >
                      Edit Profil
                    </button>
                  )}
                </div>

                {!isEditingProfil ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 text-xs">
                    <div>
                      <span className="text-slate-400 block mb-1 font-medium">Nama Lengkap</span>
                      <p className="font-bold text-slate-900 text-sm">{profilData.nama}</p>
                    </div>
                    <div>
                      <span className="text-slate-400 block mb-1 font-medium">Jabatan</span>
                      <p className="font-bold text-slate-900 text-sm">{profilData.jabatan}</p>
                    </div>
                    <div>
                      <span className="text-slate-400 block mb-1 font-medium">Email</span>
                      <p className="font-bold text-slate-900 text-sm">{profilData.email}</p>
                    </div>
                    <div>
                      <span className="text-slate-400 block mb-1 font-medium">No. Telepon</span>
                      <p className="font-bold text-slate-900 text-sm">{profilData.telepon}</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6 pt-6">
                    {/* Data Utama */}
                    <div>
                      <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Informasi Pribadi</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                        <div>
                          <label className="block text-slate-500 font-semibold mb-1">Nama Lengkap</label>
                          <input type="text" value={profilData.nama} onChange={(e) => setProfilData({...profilData, nama: e.target.value})} className="w-full px-4 py-2.5 border rounded-xl outline-none focus:ring-2 focus:ring-[#2EC4B6] text-sm" />
                        </div>
                        <div>
                          <label className="block text-slate-500 font-semibold mb-1">Jabatan</label>
                          <input type="text" value={profilData.jabatan} onChange={(e) => setProfilData({...profilData, jabatan: e.target.value})} className="w-full px-4 py-2.5 border rounded-xl outline-none focus:ring-2 focus:ring-[#2EC4B6] text-sm" />
                        </div>
                        <div>
                          <label className="block text-slate-500 font-semibold mb-1">Email</label>
                          <input type="email" value={profilData.email} onChange={(e) => setProfilData({...profilData, email: e.target.value})} className="w-full px-4 py-2.5 border rounded-xl outline-none focus:ring-2 focus:ring-[#2EC4B6] text-sm" />
                        </div>
                        <div>
                          <label className="block text-slate-500 font-semibold mb-1">No. Telepon</label>
                          <input type="text" value={profilData.telepon} onChange={(e) => setProfilData({...profilData, telepon: e.target.value})} className="w-full px-4 py-2.5 border rounded-xl outline-none focus:ring-2 focus:ring-[#2EC4B6] text-sm" />
                        </div>
                      </div>
                    </div>

                    {/* Form Ubah Kata Sandi di Dalam Mode Edit */}
                    <div className="pt-4 border-t border-slate-100">
                      <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Ubah Kata Sandi</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                        <div>
                          <label className="block text-slate-500 font-semibold mb-1">Kata Sandi Lama</label>
                          <input type="password" placeholder="••••••••" value={profilData.sandiLama} onChange={(e) => setProfilData({...profilData, sandiLama: e.target.value})} className="w-full px-4 py-2.5 border rounded-xl outline-none focus:ring-2 focus:ring-[#2EC4B6]" />
                        </div>
                        <div>
                          <label className="block text-slate-500 font-semibold mb-1">Kata Sandi Baru</label>
                          <input type="password" placeholder="••••••••" value={profilData.sandiBaru} onChange={(e) => setProfilData({...profilData, sandiBaru: e.target.value})} className="w-full px-4 py-2.5 border rounded-xl outline-none focus:ring-2 focus:ring-[#2EC4B6]" />
                        </div>
                        <div>
                          <label className="block text-slate-500 font-semibold mb-1">Konfirmasi Sandi Baru</label>
                          <input type="password" placeholder="••••••••" value={profilData.konfirmasiSandi} onChange={(e) => setProfilData({...profilData, konfirmasiSandi: e.target.value})} className="w-full px-4 py-2.5 border rounded-xl outline-none focus:ring-2 focus:ring-[#2EC4B6]" />
                        </div>
                      </div>
                    </div>
                    
                    {/* Tombol Simpan / Batal */}
                    <div className="flex gap-2 pt-4">
                      <button onClick={handleSimpanProfil} className="px-5 py-2.5 bg-[#2EC4B6] text-white rounded-xl text-xs font-bold shadow-sm">Simpan Perubahan</button>
                      <button onClick={handleBatalEdit} className="px-5 py-2.5 bg-slate-100 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-200 transition">Batal</button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: INFO KLINIK */}
          {activeTab === 'klinik' && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4 w-full">
              <h3 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100">Informasi Klinik</h3>
              <div className="space-y-4 text-xs w-full">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-500 font-semibold mb-1">Nama Klinik</label>
                    <input type="text" value={klinikData.namaKlinik} onChange={(e) => setKlinikData({...klinikData, namaKlinik: e.target.value})} className="w-full px-4 py-2.5 border rounded-xl outline-none focus:ring-2 focus:ring-[#2EC4B6]" />
                  </div>
                  <div>
                    <label className="block text-slate-500 font-semibold mb-1">Email</label>
                    <input type="text" value={klinikData.emailKlinik} onChange={(e) => setKlinikData({...klinikData, emailKlinik: e.target.value})} className="w-full px-4 py-2.5 border rounded-xl outline-none focus:ring-2 focus:ring-[#2EC4B6]" />
                  </div>
                </div>
                <div>
                  <label className="block text-slate-500 font-semibold mb-1">No. Telepon</label>
                  <input type="text" value={klinikData.teleponKlinik} onChange={(e) => setKlinikData({...klinikData, teleponKlinik: e.target.value})} className="w-full px-4 py-2.5 border rounded-xl outline-none focus:ring-2 focus:ring-[#2EC4B6]" />
                </div>
                <div>
                  <label className="block text-slate-500 font-semibold mb-1">Alamat</label>
                  <input type="text" value={klinikData.alamat} onChange={(e) => setKlinikData({...klinikData, alamat: e.target.value})} className="w-full px-4 py-2.5 border rounded-xl outline-none focus:ring-2 focus:ring-[#2EC4B6]" />
                </div>
                <button onClick={() => alert('Informasi klinik berhasil disimpan!')} className="px-6 py-2.5 bg-[#2EC4B6] text-white rounded-xl text-xs font-bold shadow-sm">
                  Simpan Perubahan
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: AKUN & PENGGUNA */}
          {activeTab === 'akun' && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-6 w-full">
              <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Manajemen Akun & Pengguna</h3>
                  <p className="text-xs text-slate-500">Kelola daftar pengguna sistem dan hak akses admin klinik.</p>
                </div>
                <button 
                  onClick={() => router.push('/Admin/register')}
                  className="px-4 py-2 bg-[#2EC4B6] hover:bg-[#259f93] text-white rounded-xl text-xs font-bold transition shadow-sm flex items-center gap-1.5"
                >
                  <span>+</span> Tambah Akun
                </button>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-600 flex items-center justify-between">
                <div>
                  <p className="font-bold text-slate-900">{profilData.nama} (Aktif)</p>
                  <p className="text-[11px] text-slate-400">Finance Admin - {profilData.email}</p>
                </div>
                <span className="px-2.5 py-1 bg-emerald-100 text-emerald-700 rounded-full font-bold text-[10px]">Utama</span>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}