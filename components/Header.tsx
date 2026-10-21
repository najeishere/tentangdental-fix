// components/shared/Header.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export type UserRole = 'admin' | 'klinik' | 'pasien';

interface HeaderProps {
  title?: string;
  subtitle?: string;
  settingsHref?: string;
  role?: UserRole | string; // Tambahkan prop role di sini
}

// Data default berdasarkan role (fallback jika localStorage belum terisi)
const roleDefaults: Record<UserRole, { name: string; title: string; settings: string }> = {
  admin: {
    name: 'Nadia A.',
    title: 'Admin Keuangan',
    settings: '/Admin/pengaturan',
  },
  klinik: {
    name: 'drg. Sari Dewi',
    title: 'Dokter Gigi Umum',
    settings: '/Klinik/pengaturan',
  },
  pasien: {
    name: 'Budi Santoso',
    title: 'Pasien Portal',
    settings: '/Pasien/pengaturan',
  },
};

export default function Header({
  title = 'Dashboard',
  subtitle = 'Ringkasan aktivitas klinik',
  settingsHref,
  role = 'admin',
}: HeaderProps) {
  // Normalisasi role
  const normalizedRole = (role?.toLowerCase() || 'admin') as UserRole;
  const currentRoleConfig = roleDefaults[normalizedRole] || roleDefaults.admin;

  const [userName, setUserName] = useState(currentRoleConfig.name);
  const [currentDate, setCurrentDate] = useState('');

  // Tentukan href settings (sesuai prop atau default per role)
  const finalSettingsHref = settingsHref || currentRoleConfig.settings;

  useEffect(() => {
    // Tanggal
    const now = new Date();
    setCurrentDate(
      new Intl.DateTimeFormat('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }).format(now)
    );

    // Ambil nama tersimpan di localStorage jika ada
    const savedName = localStorage.getItem('user_nama');
    if (savedName) {
      setUserName(savedName);
    } else {
      setUserName(currentRoleConfig.name);
    }

    // Listener update nama dari Pengaturan
    const handleUserUpdate = () => {
      const updatedName = localStorage.getItem('user_nama');
      if (updatedName) setUserName(updatedName);
    };

    window.addEventListener('user-updated', handleUserUpdate);
    return () => window.removeEventListener('user-updated', handleUserUpdate);
  }, [currentRoleConfig.name]);

  return (
    <header className="w-full h-20 px-8 py-4 bg-white border-b border-gray-100 flex items-center justify-between shrink-0">
      <div>
        <h1 className="text-lg font-bold text-gray-900 leading-tight">{title}</h1>
        <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>
      </div>

      <div className="flex items-center gap-4">
        {/* Tanggal */}
        <div className="hidden sm:flex px-3 py-2 rounded-xl border border-gray-200/80 items-center gap-2 text-xs text-gray-500 bg-gray-50/50">
          <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span className="whitespace-nowrap">{currentDate || '16 September 2026'}</span>
        </div>

        {/* Notifikasi */}
        <button className="p-2.5 rounded-xl border border-gray-200/80 text-gray-400 hover:text-gray-600 bg-gray-50/50 relative transition shrink-0">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          <span className="w-2 h-2 bg-rose-500 rounded-full absolute top-2 right-2 border-2 border-white" />
        </button>

        {/* Profil Akun Dinamis Berdasarkan Role */}
        <Link
          href={finalSettingsHref}
          className="flex items-center gap-2.5 pl-2 border-l border-gray-100 hover:opacity-80 transition group cursor-pointer shrink-0 max-w-[220px]"
        >
          <div className="w-9 h-9 rounded-full bg-teal-500 text-white font-semibold flex items-center justify-center text-xs shadow-sm shrink-0 group-hover:ring-2 group-hover:ring-teal-500/30 transition">
            {userName.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-gray-900 leading-tight truncate group-hover:text-teal-600 transition" title={userName}>
              {userName}
            </p>
            {/* Subtitle Role Dinamis */}
            <p className="text-[10px] text-gray-400 mt-0.5 truncate">
              {currentRoleConfig.title}
            </p>
          </div>
        </Link>
      </div>
    </header>
  );
}