// app/Pasien/login/page.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8002/api';

export default function LoginPasien() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const json = await response.json();

      if (!response.ok) {
        throw new Error(json.message || 'Email atau password salah');
      }

      const token = json?.data?.token || '';
      const user = json?.data?.user;

      if (!token || !user?.name) {
        throw new Error('Respons API tidak sesuai.');
      }

      if (user.role !== 'customer') {
        throw new Error('Akun ini bukan pasien. Silakan gunakan halaman login yang sesuai.');
      }

      localStorage.setItem('token', token);
      localStorage.setItem('pasienNama', user.name);
      localStorage.setItem('pasienEmail', user.email);

      router.push('/Pasien/dashboard');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Login gagal, periksa kembali email dan kata sandi Anda.';
      setErrorMsg(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen grid grid-cols-1 md:grid-cols-2 bg-[#F4F5F7] font-sans">
      
      {/* Sisi Kiri: Informasi Branding Klinik (Warna disesuaikan dengan sidebar dashboard) */}
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

      {/* Sisi Kanan: Form Masuk Pasien */}
      <div className="p-10 flex items-center justify-center">
        <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
          <h2 className="text-2xl font-bold text-slate-800 mb-1">Selamat Datang</h2>
          <p className="text-sm text-slate-500 mb-6">Masuk ke akun Anda</p>

          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-100 text-rose-600 text-xs rounded-xl mb-4">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Email</label>
              <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                placeholder="email@tentangdental.id"
                required
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#2EC4B6]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Kata Sandi</label>
              <input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                placeholder="••••••••"
                required
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#2EC4B6]"
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="block text-center w-full bg-[#2EC4B6] hover:bg-[#259f93] text-white font-semibold py-2.5 rounded-lg transition duration-200 text-sm shadow-sm disabled:opacity-50"
            >
              {loading ? 'Memproses...' : 'Masuk'}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-6">
            Belum punya akun?{' '}
            <Link href="/Pasien/register" className="text-[#2EC4B6] font-semibold hover:underline">
              Daftar
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
