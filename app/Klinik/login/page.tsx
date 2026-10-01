// app/Klinik/login/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

export default function LoginKlinik() {
  const router = useRouter();
  const [nama, setNama] = useState('drg. Sari Dewi');
  const [password, setPassword] = useState('123456');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simpan data login sementara ke localStorage
    localStorage.setItem('klinikNama', nama);
    router.push('/Klinik/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#F4F5F7] flex font-sans text-slate-800">
      
      {/* Kolom Kiri: Informasi Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#25A99D] text-white p-12 flex-col justify-between relative overflow-hidden">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center overflow-hidden shadow-sm">
            <Image src="/logo.png" alt="Logo" width={40} height={40} className="object-contain" />
          </div>
          <div>
            <h2 className="text-base font-bold tracking-wide">TentangDental</h2>
            <p className="text-xs text-[#2EC4B6]">Tim Klinik</p>
          </div>
        </div>

        <div className="space-y-4 max-w-lg z-10">
          <h1 className="text-3xl font-extrabold leading-tight">Sistem Informasi Manajemen Klinik Gigi</h1>
          <p className="text-slate-300 text-sm leading-relaxed">
            Platform terpadu untuk manajemen pasien, rekam medis, billing, dan keuangan klinik Anda.
          </p>
        </div>

        <div className="text-xs text-slate-500">
          © 2026 TentangDental. Hak cipta dilindungi.
        </div>
      </div>

      {/* Kolom Kanan: Form Login */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white lg:bg-[#F4F5F7]">
        <div className="w-full max-w-md bg-white p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-6">
          
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 mb-1">Selamat Datang</h2>
            <p className="text-xs text-slate-500">Masuk ke akun Anda</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-500 font-semibold mb-1">Nama</label>
              <input 
                type="text" 
                value={nama} 
                onChange={(e) => setNama(e.target.value)} 
                required
                className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-[#2EC4B6] text-sm text-slate-800" 
                placeholder="Nama Lengkap" 
              />
            </div>

            <div>
              <label className="block text-slate-500 font-semibold mb-1">Kata Sandi</label>
              <input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required
                className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-[#2EC4B6] text-sm text-slate-800" 
                placeholder="••••••••" 
              />
            </div>

            <button 
              type="submit" 
              className="w-full py-3 bg-[#2EC4B6] hover:bg-[#259f93] text-white rounded-xl text-xs font-bold transition shadow-sm"
            >
              Masuk
            </button>
          </form>

          <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-100">
            Belum punya akun?{' '}
            <Link href="/Klinik/register" className="text-[#2EC4B6] font-bold hover:underline">
              Daftar
            </Link>
          </div>

        </div>
      </div>

    </div>
  );
}