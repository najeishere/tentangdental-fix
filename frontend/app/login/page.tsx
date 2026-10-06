// app/login/page.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8002/api';

const DASHBOARD_BY_ROLE: Record<string, string> = {
  admin: '/Admin/dashboard',
  doctor: '/Klinik/dashboard',
  customer: '/Pasien/dashboard',
};

export default function LoginGeneral() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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

      const role = user.role || 'customer';

      localStorage.setItem('token', token);
      localStorage.setItem('userRole', role);
      localStorage.setItem('userNama', user.name);

      // Sesuaikan kunci yang dibaca tiap area dashboard
      localStorage.setItem('adminNama', user.name);
      localStorage.setItem('adminJabatan', user.specialist || 'Administrator');
      localStorage.setItem('klinikNama', user.name);
      localStorage.setItem('pasienNama', user.name);
      localStorage.setItem('pasienEmail', user.email || '');

      router.push(DASHBOARD_BY_ROLE[role] || '/Pasien/dashboard');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Login gagal, periksa kembali email dan kata sandi Anda.';
      setErrorMsg(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F5F7] flex font-sans text-slate-800">
      {/* Kolom Kiri: Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#25A99D] text-white p-12 flex-col justify-between relative overflow-hidden">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center overflow-hidden shadow-sm">
            <Image src="/logo.png" alt="Logo" width={40} height={40} className="object-contain" />
          </div>
          <div>
            <h2 className="text-base font-bold tracking-wide">TentangDental</h2>
            <p className="text-xs text-[#2EC4B6]">Satu pintu untuk semua peran</p>
          </div>
        </div>

        <div className="space-y-4 max-w-lg z-10">
          <h1 className="text-3xl font-extrabold leading-tight">Sistem Informasi Manajemen Klinik Gigi</h1>
          <p className="text-slate-300 text-sm leading-relaxed">
            Masuk dengan akun Anda — admin, kasir, dokter, maupun pasien. Anda akan diarahkan ke
            dashboard sesuai peran masing-masing.
          </p>
        </div>

        <div className="text-xs text-slate-500">
          © 2026 TentangDental. Hak cipta dilindungi.
        </div>
      </div>

      {/* Kolom Kanan: Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white lg:bg-[#F4F5F7]">
        <div className="w-full max-w-md bg-white p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-6">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 mb-1">Selamat Datang</h2>
            <p className="text-xs text-slate-500">Masuk ke akun Anda</p>
          </div>

          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-100 text-rose-600 text-xs rounded-xl">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-500 font-semibold mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-[#2EC4B6] text-sm text-slate-800"
                placeholder="email@tentangdental.id"
              />
            </div>

            <div>
              <label className="block text-slate-500 font-semibold mb-1">Kata Sandi</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 pr-10 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-[#2EC4B6] text-sm text-slate-800"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm"
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#2EC4B6] hover:bg-[#259f93] text-white rounded-xl text-xs font-bold transition shadow-sm disabled:opacity-50"
            >
              {loading ? 'Memproses...' : 'Masuk'}
            </button>
          </form>

          <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-100 space-y-1">
            <p>
              Akun demo — admin: <span className="font-semibold">admin@tentangdental.id</span> · dokter:{' '}
              <span className="font-semibold">sari@tentangdental.id</span> · pasien:{' '}
              <span className="font-semibold">budi@example.com</span> (sandi: <span className="font-semibold">password</span>)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
