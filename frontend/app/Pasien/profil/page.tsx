// app/Pasien/profil/page.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

function NavItem({ label, href, active = false }: { label: string; href: string; active?: boolean }) {
  return (
    <Link href={href}>
      <div className={`px-3 py-2.5 rounded-xl flex items-center gap-3 transition ${active ? 'bg-[#2EC4B6] text-white' : 'hover:bg-white/[0.05] text-white/60'}`}>
        <span className="text-sm font-medium">{label}</span>
      </div>
    </Link>
  );
}

export default function ProfilPasien() {
  const [isEditing, setIsEditing] = useState(false);

  const [profil, setProfil] = useState({
    nama: 'Budi Santoso',
    telepon: '0812-3456-7890',
    email: 'budi.santoso@email.com',
    alamat: 'Jl. Merdeka No. 12, Jakarta Selatan',
    tanggalLahir: '15 Maret 1995',
    jenisKelamin: 'Laki-laki',
    golDarah: 'O+',
    nik: '320197654823674',
  });

  const tanggalHariIni = new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Khusus NIK, batasi hanya angka dan maksimal 16 digit
    if (name === 'nik') {
      const numericValue = value.replace(/\D/g, '').slice(0, 16);
      setProfil({ ...profil, [name]: numericValue });
      return;
    }

    setProfil({ ...profil, [name]: value });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (profil.nik.length < 16) {
      alert('NIK harus pas 16 digit!');
      return;
    }
    setIsEditing(false);
  };

  return (
    <div className="w-full min-h-screen bg-[#F4F5F7] flex font-sans overflow-hidden">
      
      {/* Sidebar Sisi Kiri */}
      <aside className="w-[240px] bg-[#1A1D2E] flex flex-col justify-between shrink-0">
        <div>
          {/* Logo & Brand */}
          <div className="px-6 py-5 border-b border-white/[0.08] flex items-center gap-3">
            <div className="w-9 h-9 bg-white rounded-lg flex justify-center items-center overflow-hidden">
              <Image src="/logo.png" alt="Logo" width={36} height={36} className="object-contain" />
            </div>
            <div>
              <span className="text-white text-sm font-bold block">TentangDental</span>
              <span className="text-[#2EC4B6] text-xs">Pasien</span>
            </div>
          </div>

          {/* Menu Navigasi */}
          <div className="p-3 flex flex-col gap-1">
            <p className="text-white/30 text-xs font-semibold px-3 pt-4 pb-1 tracking-wider">OVERVIEW</p>
            <NavItem label="Dashboard" href="/Pasien/dashboard" />
            
            <p className="text-white/30 text-xs font-semibold px-3 pt-6 pb-1 tracking-wider">LAYANAN</p>
            <NavItem label="Tagihan & Invoice" href="/Pasien/dashboard" />
            <NavItem label="Riwayat Kunjungan" href="/Pasien/dashboard" />
            <NavItem label="Tagihan & Invoice" href="/Pasien/dashboard" />
          </div>
        </div>

        {/* Footer Sidebar */}
        <div className="p-4 flex flex-col gap-4">
          <Link href="/Pasien/login" className="px-3 py-2 rounded-xl flex items-center gap-2 text-white/40 hover:text-white text-sm transition">
            <span>←</span> Keluar
          </Link>

          <div className="p-4 bg-teal-400/10 rounded-2xl border border-teal-400/20 flex flex-col gap-1">
            <div className="text-white text-xs font-semibold">❓ Butuh Bantuan?</div>
            <div className="text-white/40 text-xs leading-4">Kunjungi panduan atau hubungi support kami.</div>
            <div className="text-teal-400 text-xs font-semibold cursor-pointer hover:underline mt-1">Buka pusat bantuan →</div>
          </div>
        </div>
      </aside>

      {/* Konten Utama */}
      <main className="flex-1 flex flex-col h-screen overflow-y-auto">
        
        {/* Header Atas */}
        <header className="px-8 py-4 bg-white border-b border-gray-200 flex justify-between items-center shrink-0">
          <div>
            <h1 className="text-gray-900 text-lg font-bold">Profil Saya</h1>
            <p className="text-gray-500 text-sm">Informasi akun Anda</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="px-3 py-2 rounded-xl border border-gray-200 text-gray-500 text-sm">
              📅 {tanggalHariIni}
            </div>
            <div className="p-2.5 relative rounded-xl border border-gray-200 flex items-center justify-center">
              <span className="text-gray-500">🔔</span>
              <div className="w-2 h-2 absolute top-1.5 right-1.5 bg-red-500 rounded-full" />
            </div>
            <div className="flex items-center gap-2 max-w-[200px]">
              <div className="w-9 h-9 bg-teal-400 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0">
                {profil.nama.charAt(0)}
              </div>
              <div className="truncate">
                <span className="text-gray-900 text-sm font-semibold block leading-tight truncate">{profil.nama}</span>
                <span className="text-gray-400 text-xs">P-00124</span>
              </div>
            </div>
          </div>
        </header>

        {/* Konten Profil */}
        <div className="p-8 flex flex-col gap-6">
          {isEditing ? (
            /* Form Edit Profil Lengkap */
            <form onSubmit={handleSave} className="p-6 bg-white rounded-2xl shadow-sm border border-zinc-100 space-y-4">
              <h3 className="text-gray-900 text-lg font-bold mb-4">Edit Informasi Profil</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">Nama Lengkap</label>
                  <input 
                    type="text" 
                    name="nama" 
                    value={profil.nama} 
                    onChange={handleChange} 
                    className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-400" 
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">No. Telepon</label>
                  <input 
                    type="text" 
                    name="telepon" 
                    value={profil.telepon} 
                    onChange={handleChange} 
                    className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-400" 
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">Email</label>
                  <input 
                    type="email" 
                    name="email" 
                    value={profil.email} 
                    onChange={handleChange} 
                    className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-400" 
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">NIK (Wajib 16 Digit)</label>
                  <input 
                    type="text" 
                    name="nik" 
                    value={profil.nik} 
                    onChange={handleChange} 
                    maxLength={16}
                    placeholder="Masukkan 16 digit NIK"
                    className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-400 tracking-wider" 
                  />
                  <span className="text-[11px] text-gray-400 mt-1 block">{profil.nik.length}/16 digit</span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">Tanggal Lahir</label>
                  <input 
                    type="text" 
                    name="tanggalLahir" 
                    value={profil.tanggalLahir} 
                    onChange={handleChange} 
                    className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-400" 
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">Jenis Kelamin</label>
                  <select 
                    name="jenisKelamin" 
                    value={profil.jenisKelamin} 
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-400 bg-white"
                  >
                    <option value="Laki-laki">Laki-laki</option>
                    <option value="Perempuan">Perempuan</option>
                  </select>
                </div>

                {/* Golongan Darah diubah menjadi input teks biasa */}
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">Golongan Darah</label>
                  <input 
                    type="text" 
                    name="golDarah" 
                    value={profil.golDarah} 
                    onChange={handleChange} 
                    maxLength={2}
                    placeholder="Contoh: O+, A, B"
                    className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-400" 
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">Alamat (Maks. 100 Karakter)</label>
                <input 
                  type="text" 
                  name="alamat" 
                  value={profil.alamat} 
                  onChange={handleChange} 
                  maxLength={100}
                  className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-400" 
                />
                <span className="text-[11px] text-gray-400 mt-1 block">{profil.alamat.length}/100 karakter</span>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setIsEditing(false)} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-xl text-sm font-semibold hover:bg-gray-300 transition">Batal</button>
                <button type="submit" className="px-4 py-2 bg-teal-400 text-white rounded-xl text-sm font-semibold hover:bg-teal-500 transition">Simpan</button>
              </div>
            </form>
          ) : (
            /* Tampilan Kartu Profil Biasa */
            <div className="p-6 bg-white rounded-2xl shadow-sm border border-zinc-100 flex flex-col gap-6">
              
              {/* Bagian Atas Profil */}
              <div className="pb-6 border-b border-gray-100 flex justify-between items-center">
                <div className="flex items-center gap-6">
                  <div className="w-20 h-20 bg-teal-400 rounded-2xl flex justify-center items-center text-white text-2xl font-bold shrink-0">
                    {profil.nama.charAt(0)}
                  </div>
                  <div className="max-w-[400px]">
                    <h2 className="text-gray-900 text-xl font-bold truncate">{profil.nama}</h2>
                    <p className="text-gray-500 text-sm">No. Pasien: P-00124</p>
                  </div>
                </div>
                
                <button 
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 bg-emerald-50 rounded-xl flex items-center gap-2 hover:bg-emerald-100 transition shrink-0"
                >
                  <span className="text-teal-500 text-sm font-semibold">Edit Profil</span>
                </button>
              </div>

              {/* Detail Informasi */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-gray-100 rounded-lg flex justify-center items-center shrink-0">📞</div>
                  <div className="truncate">
                    <p className="text-gray-400 text-xs">Telepon</p>
                    <p className="text-gray-900 text-sm font-medium truncate">{profil.telepon}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-gray-100 rounded-lg flex justify-center items-center shrink-0">✉️</div>
                  <div className="truncate">
                    <p className="text-gray-400 text-xs">Email</p>
                    <p className="text-gray-900 text-sm font-medium truncate">{profil.email}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-gray-100 rounded-lg flex justify-center items-center shrink-0">📍</div>
                  <div className="truncate">
                    <p className="text-gray-400 text-xs">Alamat</p>
                    <p className="text-gray-900 text-sm font-medium truncate">{profil.alamat}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-gray-100 rounded-lg flex justify-center items-center shrink-0">📅</div>
                  <div className="truncate">
                    <p className="text-gray-400 text-xs">Tanggal Lahir & Jenis Kelamin</p>
                    <p className="text-gray-900 text-sm font-medium truncate">{profil.tanggalLahir} · {profil.jenisKelamin}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-gray-100 rounded-lg flex justify-center items-center shrink-0">🩸</div>
                  <div className="truncate">
                    <p className="text-gray-400 text-xs">Golongan Darah</p>
                    <p className="text-gray-900 text-sm font-medium truncate">{profil.golDarah}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-gray-100 rounded-lg flex justify-center items-center shrink-0">🆔</div>
                  <div className="truncate">
                    <p className="text-gray-400 text-xs">NIK</p>
                    <p className="text-gray-900 text-sm font-medium truncate tracking-wide">{profil.nik}</p>
                  </div>
                </div>
              </div>

            </div>
          )}
        </div>
      </main>
    </div>
  );
}