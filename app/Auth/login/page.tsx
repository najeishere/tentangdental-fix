// app/(auth)/login/page.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Button from '@/components/Button';

export default function LoginPage() {
  const [namaInput, setNamaInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    // Validasi: Wajib isi semua field
    if (!namaInput.trim() || !passwordInput.trim()) {
      setErrorMsg('Mohon isi semua bidang terlebih dahulu!');
      return;
    }

    setErrorMsg('');
    // Jika semua sudah diisi, arahkan langsung ke Dashboard Admin
    router.push('/Admin/dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-[860px] bg-white rounded-3xl overflow-hidden flex flex-col md:flex-row shadow-2xl">
        {/* Banner Kiri Teal */}
        <div className="w-full md:w-[380px] bg-teal-500 p-10 text-white flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-10">
              <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center p-1 border border-white/20">
                <Image src="/logo.png" alt="Logo" width={32} height={32} className="object-contain" />
              </div>
              <div>
                <h1 className="text-sm font-bold">TentangDental</h1>
                <p className="text-[10px] text-white/70">TENTANG DENTAL</p>
              </div>
            </div>
            <h2 className="text-2xl font-bold mb-4">Sistem Informasi<br />Manajemen Klinik Gigi</h2>
            <p className="text-xs text-white/80 leading-relaxed">Platform terpadu untuk manajemen pasien, rekam medis, billing, dan keuangan.</p>
          </div>
        </div>

        {/* Form Kanan */}
        <div className="flex-1 p-10 bg-white flex flex-col justify-center">
          <h3 className="text-xl font-bold text-gray-900">Selamat Datang</h3>
          <p className="text-xs text-gray-400 mb-6">Masuk ke akun Anda</p>

          {/* Pesan Error jika ada input kosong */}
          {errorMsg && (
            <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-600 text-xs rounded-xl font-medium">
               {errorMsg}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleLogin}>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Nama / Email</label>
              <input 
                type="text" 
                placeholder="Nama/email anda" 
                value={namaInput}
                onChange={(e) => setNamaInput(e.target.value)}
                className="w-full h-11 px-4 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:border-teal-500 transition" 
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Kata Sandi</label>
              <div className="relative">
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  placeholder="••••••••" 
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className="w-full h-11 pl-4 pr-10 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:border-teal-500 transition" 
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)} 
                  className="absolute right-3 top-3.5 text-xs font-medium text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            <Button variant="primary" type="submit" className="w-full h-11 text-xs font-bold mt-2">
              Masuk
            </Button>
          </form>

          <p className="text-center text-xs text-gray-400 mt-6">
            Belum punya akun? <Link href="/Auth/register" className="text-teal-500 font-semibold hover:underline">Daftar</Link>
          </p>
        </div>
      </div>
    </div>
  );
}