// app/(auth)/register/page.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Button from '@/components/Button';

export default function RegisterPage() {
  const [nama, setNama] = useState('');
  const [email, setEmail] = useState('');
  const [noTelp, setNoTelp] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const router = useRouter();

  // Handler agar input No. Telp hanya menerima angka
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ''); // Hapus semua karakter selain angka
    setNoTelp(value);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();

    if (!nama.trim() || !email.trim() || !noTelp.trim() || !password.trim()) {
      setErrorMsg('Mohon isi semua bidang pendaftaran terlebih dahulu!');
      return;
    }

    setErrorMsg('');
    router.push('/Admin/dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-[860px] bg-white rounded-3xl overflow-hidden flex flex-col md:flex-row shadow-2xl">
        {/* Banner Kiri */}
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
            <h2 className="text-2xl font-bold mb-4">Buat Akun Baru</h2>
            <p className="text-xs text-white/80 leading-relaxed">
              Daftarkan akun Anda untuk mulai mengakses sistem manajemen klinik gigi.
            </p>
          </div>
        </div>

        {/* Form Pendaftaran Kanan */}
        <div className="flex-1 p-10 bg-white flex flex-col justify-center">
          <h3 className="text-2xl font-bold text-gray-900">Daftar Akun</h3>
          <p className="text-xs text-gray-400 mb-6">Lengkapi data di bawah ini</p>

          {errorMsg && (
            <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-600 text-xs rounded-xl font-medium">
               {errorMsg}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleRegister}>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Nama Lengkap</label>
              <input 
                type="text" 
                placeholder="Nadia A." 
                value={nama}
                onChange={(e) => setNama(e.target.value)}
                className="w-full h-11 px-4 bg-gray-50/50 border border-gray-200 rounded-2xl text-xs text-gray-900 focus:outline-none focus:border-teal-500 transition" 
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Email</label>
              <input 
                type="email" 
                placeholder="nadia@tentangdental.id" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-11 px-4 bg-gray-50/50 border border-gray-200 rounded-2xl text-xs text-gray-900 focus:outline-none focus:border-teal-500 transition" 
              />
            </div>

            {/* Field No. Telepon (+62 Prefix & Hanya Angka) */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">No. Telepon</label>
              <div className="relative flex items-center">
                <span className="absolute left-4 text-xs font-semibold text-gray-500 selection:bg-none">
                  +62
                </span>
                <input 
                  type="text" 
                  inputMode="numeric"
                  placeholder="81234567890" 
                  value={noTelp}
                  onChange={handlePhoneChange}
                  className="w-full h-11 pl-13 pr-4 bg-gray-50/50 border border-gray-200 rounded-2xl text-xs text-gray-900 focus:outline-none focus:border-teal-500 transition" 
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Kata Sandi</label>
              <input 
                type="password" 
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-11 px-4 bg-gray-50/50 border border-gray-200 rounded-2xl text-xs text-gray-900 focus:outline-none focus:border-teal-500 transition" 
              />
            </div>

            <Button variant="primary" type="submit" className="w-full h-11 text-xs font-bold mt-2">
              Daftar
            </Button>
          </form>

          <p className="text-center text-xs text-gray-400 mt-6">
            Sudah punya akun? <Link href="/Auth/login" className="text-teal-500 font-semibold hover:underline">Masuk</Link>
          </p>
        </div>
      </div>
    </div>
  );
}