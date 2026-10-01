// app/Admin/login/page.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function LoginAdmin() {
  const router = useRouter();
  const [nama, setNama] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
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
          <h1 className="text-3xl font-extrabold mb-4">Portal Panel Admin Klinik</h1>
          <p className="text-slate-300 text-sm leading-relaxed">
            Kelola data pasien, antrean, jadwal dokter, serta laporan keuangan klinik dengan mudah dan terpusat.
          </p>
        </div>
        <div className="text-xs text-slate-400">
          © 2026 TentangDental. All rights reserved.
        </div>
      </div>

      {/* Sisi Kanan: Form Masuk Admin */}
      <div className="p-10 flex items-center justify-center">
        <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
          <h2 className="text-2xl font-bold text-slate-800 mb-1">Login Admin</h2>
          <p className="text-sm text-slate-500 mb-6">Masukkan nama pengguna dan kata sandi admin</p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Nama</label>
              <input 
                type="text" 
                value={nama} 
                onChange={(e) => setNama(e.target.value)} 
                placeholder="Nama Pengguna"
                required
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#2EC4B6]" 
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Kata Sandi</label>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"} 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  placeholder="••••••••"
                  required
                  className="w-full px-4 py-2.5 pr-10 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#2EC4B6]" 
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
              className="block text-center w-full bg-[#2EC4B6] hover:bg-[#259f93] text-white font-semibold py-2.5 rounded-lg transition duration-200 text-sm shadow-sm mt-4"
            >
              Masuk sebagai Admin
            </button>
          </form>

          {/* Tautan untuk beralih ke halaman register admin */}
          <p className="text-center text-sm text-slate-500 mt-6">
            Belum punya akun admin?{' '}
            <Link href="/Admin/register" className="text-[#2EC4B6] font-semibold hover:underline">
              Daftar
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}