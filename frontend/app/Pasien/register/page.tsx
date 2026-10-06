// app/Pasien/register/page.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function RegisterPasien() {
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    nama: '',
    email: '',
    telepon: '',
    nik: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Khusus NIK: Hanya angka dan dibatasi maksimal 16 digit
    if (name === 'nik') {
      const numericValue = value.replace(/\D/g, '').slice(0, 16);
      setFormData({ ...formData, [name]: numericValue });
      return;
    }

    // Khusus Telepon: Hanya boleh angka saja
    if (name === 'telepon') {
      const numericValue = value.replace(/\D/g, '');
      setFormData({ ...formData, [name]: numericValue });
      return;
    }

    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.nik.length < 16) {
      alert('NIK harus pas 16 digit!');
      return;
    }
    router.push('/Pasien/dashboard');
  };

  return (
    <main className="min-h-screen grid grid-cols-1 md:grid-cols-2 bg-[#F4F5F7] font-sans">
      <div className="bg-[#25A99D] text-white p-10 flex flex-col justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 bg-white rounded-lg flex items-center justify-center overflow-hidden">
            <Image 
              src="/logo.png" 
              alt="Logo Tentang Dental" 
              width={36} 
              height={36} 
              className="object-contain"
            />
          </div>
          <h2 className="text-xl font-bold tracking-wider">TentangDental</h2>
        </div>
        <div>
          <h1 className="text-3xl font-extrabold mb-4">Sistem Informasi Manajemen Klinik Gigi</h1>
          <p className="text-slate-300 text-sm leading-relaxed">
            Platform terpadu untuk manajemen pasien, rekam medis, billing, dan keuangan klinik Anda.
          </p>
        </div>
        <div className="text-xs text-slate-400">
          © 2026 TentangDental. All rights reserved.
        </div>
      </div>

      <div className="p-10 flex items-center justify-center">
        <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
          <h2 className="text-2xl font-bold text-slate-800 mb-1">Buat Akun Baru</h2>
          <p className="text-sm text-slate-500 mb-6">Daftarkan diri sebagai pasien baru</p>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Nama Lengkap</label>
              <input 
                type="text" 
                name="nama"
                value={formData.nama}
                onChange={handleChange}
                placeholder="Nama Lengkap" 
                required
                className="w-full px-4 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#2EC4B6]" 
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Alamat Email</label>
              <input 
                type="email" 
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="@email.com" 
                required
                className="w-full px-4 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#2EC4B6]" 
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">No. Telepon (Hanya Angka)</label>
              <input 
                type="text" 
                name="telepon"
                value={formData.telepon}
                onChange={handleChange}
                placeholder="+62" 
                required
                className="w-full px-4 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#2EC4B6]" 
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">NIK (Wajib 16 Digit)</label>
              <input 
                type="text" 
                name="nik"
                value={formData.nik}
                onChange={handleChange}
                maxLength={16}
                placeholder="16 angka" 
                required
                className="w-full px-4 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#2EC4B6] tracking-wider" 
              />
              <span className="text-[10px] text-slate-400 mt-0.5 block">{formData.nik.length}/16 digit</span>
            </div>

            <button 
              type="submit"
              className="block text-center w-full bg-[#2EC4B6] hover:bg-[#259f93] text-white font-semibold py-2.5 rounded-lg transition duration-200 text-sm mt-4 shadow-sm"
            >
              Buat Akun & Masuk
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-4">
            Sudah punya akun?{' '}
            <Link href="/Pasien/login" className="text-[#2EC4B6] font-semibold hover:underline">
              Masuk
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}