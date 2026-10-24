'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

export type UserRole = 'admin' | 'klinik' | 'pasien';

interface HeaderProps {
  title?: string;
  subtitle?: string;
  settingsHref?: string;
  role?: UserRole | string;
}

const defaults: Record<UserRole, { name: string; title: string; settings: string }> = {
  admin: { name: 'Nadia A.', title: 'Finance Admin', settings: '/Admin/pengaturan' },
  klinik: { name: 'drg. Sari Dewi', title: 'Dokter Gigi Umum', settings: '/Klinik/profil' },
  pasien: { name: 'Budi Santoso', title: 'Pasien Portal', settings: '/Pasien/dashboard' },
};

export default function Header({ title = 'Dashboard', subtitle = 'Ringkasan aktivitas klinik', settingsHref, role = 'admin' }: HeaderProps) {
  const config = defaults[(role.toLowerCase() as UserRole)] || defaults.admin;
  const [name, setName] = useState(config.name);
  const [date, setDate] = useState('');

  useEffect(() => {
    setDate(new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date()));
    const update = () => setName(
      localStorage.getItem('user_nama') ||
      localStorage.getItem('adminNama') ||
      localStorage.getItem('klinikNama') ||
      localStorage.getItem('pasienNama') ||
      config.name,
    );
    update();
    window.addEventListener('user-updated', update);
    return () => window.removeEventListener('user-updated', update);
  }, [config.name]);

  return (
    <header className="flex h-20 shrink-0 items-center justify-between border-b border-gray-100 bg-white px-8 py-4">
      <div><h1 className="text-lg font-bold leading-tight text-gray-900">{title}</h1><p className="mt-0.5 text-xs text-gray-400">{subtitle}</p></div>
      <div className="flex items-center gap-4">
        <div className="hidden items-center gap-2 rounded-xl border border-gray-200/80 bg-gray-50/50 px-3 py-2 text-xs text-gray-500 sm:flex">{date}</div>
        <button type="button" aria-label="Notifikasi" className="relative rounded-xl border border-gray-200/80 bg-gray-50/50 p-2.5 text-gray-400 hover:text-gray-600">●<span className="absolute right-2 top-2 h-2 w-2 rounded-full border-2 border-white bg-rose-500" /></button>
        <Link href={settingsHref || config.settings} className="flex max-w-[220px] items-center gap-2.5 border-l border-gray-100 pl-2 hover:opacity-80">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-teal-500 text-xs font-semibold text-white">{name.charAt(0).toUpperCase()}</span>
          <span className="min-w-0"><span className="block truncate text-xs font-semibold text-gray-900">{name}</span><span className="mt-0.5 block truncate text-[10px] text-gray-400">{config.title}</span></span>
        </Link>
      </div>
    </header>
  );
}
