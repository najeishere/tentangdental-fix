// app/Admin/register/page.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function RegisterAdmin() {
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    nama: '',
    email: '',
    telepon: '',
    password: '',
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
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
    alert('Pendaftaran Admin berhasil!');
    router.push('/Admin/dashboard');
  };

  return (
    <main className="min-h-screen grid grid-cols-1 md:grid-cols-2 bg-[#F4F5F7] font-sans">
      
      {/* Sisi Kiri: Informasi Branding Klinik */}
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
          <h1 className="text-3xl font-extrabold mb-4">Portal Pendaftaran Panel Admin</h1>
          <p className="text-slate-300 text-sm leading-relaxed">
            Daftarkan akun admin baru untuk mengelola operasional klinik, jadwal dokter, dan sistem rekam medis secara terpusat.
          </p>
        </div>
        <div className="text-xs text-slate-400">
          © 2026 TentangDental. All rights reserved.
        </div>
      </div>

      {/* Sisi Kanan: Form Pendaftaran Admin */}
      <div className="p-10 flex items-center justify-center">
        <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
          <h2 className="text-2xl font-bold text-slate-800 mb-1">Buat Akun Admin</h2>
          <p className="text-sm text-slate-500 mb-6">Daftarkan diri sebagai pengelola baru</p>

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
                placeholder="admin@tentangdental.com" 
                required
                className="w-full px-4 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#2EC4B6]" 
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">No. Telepon </label>
              <input 
                type="text" 
                name="telepon"
                value={formData.telepon}
                onChange={handleChange}
                placeholder="(+62) 8" 
                required
                className="w-full px-4 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#2EC4B6]" 
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Kata Sandi</label>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"} 
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••" 
                  required
                  className="w-full px-4 py-2 pr-10 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#2EC4B6]" 
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-sm focus:outline-none"
                >
                  {showPassword ? '👁️‍🗨️' : '👁️'}
                </button>
              </div>
            </div>

            <button 
              type="submit"
              className="block text-center w-full bg-[#2EC4B6] hover:bg-[#259f93] text-white font-semibold py-2.5 rounded-lg transition duration-200 text-sm mt-4 shadow-sm"
            >
              Buat Akun & Masuk
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-4">
            Sudah punya akun admin?{' '}
            <Link href="/Admin/login" className="text-[#2EC4B6] font-semibold hover:underline">
              Masuk
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}