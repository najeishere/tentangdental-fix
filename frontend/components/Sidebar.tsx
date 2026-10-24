'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export type UserRole = 'admin' | 'klinik' | 'pasien';

const menus: Record<UserRole, { label: string; href: string }[]> = {
  admin: [
    { label: 'Dashboard', href: '/Admin/dashboard' }, { label: 'Manajemen Antrean', href: '/Admin/manajemen-antrean' },
    { label: 'Pencatatan Tagihan', href: '/Admin/pencatatan-tagihan' }, { label: 'Pembayaran', href: '/Admin/pembayaran' },
    { label: 'Rekonsiliasi', href: '/Admin/rekonsiliasi' }, { label: 'Laporan Keuangan', href: '/Admin/laporan-keuangan' },
    { label: 'Data Pasien', href: '/Admin/data-pasien' }, { label: 'Data Tindakan', href: '/Admin/data-tindakan' }, { label: 'Pengaturan', href: '/Admin/pengaturan' }, { label: 'Database', href: '/Admin/database' },
  ],
  klinik: [
    { label: 'Dashboard', href: '/Klinik/dashboard' }, { label: 'Antrean Hari Ini', href: '/Admin/manajemen-antrean' },
    { label: 'Data Pasien', href: '/Admin/data-pasien' }, { label: 'Catatan BMHP', href: '/Klinik/catatan-bmhp' }, { label: 'Profil', href: '/Klinik/profil' },
  ],
  pasien: [{ label: 'Dashboard', href: '/Pasien/dashboard' }],
};

export default function Sidebar({ role = 'admin' }: { role?: UserRole | string }) {
  const pathname = usePathname();
  const current = menus[(role.toLowerCase() as UserRole)] || menus.admin;
  return (
    <aside className="flex h-screen w-64 shrink-0 flex-col bg-[#161922] text-white">
      <div className="border-b border-white/10 px-6 py-5"><div className="text-sm font-bold tracking-wide">TentangDental</div><div className="mt-1 text-xs text-teal-400">{role === 'klinik' ? 'Tim Klinik' : 'Finance Admin'}</div></div>
      <nav className="flex-1 space-y-1 overflow-y-auto p-3" aria-label="Navigasi utama">
        {current.map((item) => <Link key={item.href} href={item.href} className={`block rounded-xl px-3 py-2.5 text-sm transition ${pathname === item.href ? 'bg-teal-500 font-medium text-white' : 'text-slate-300 hover:bg-white/5 hover:text-white'}`}>{item.label}</Link>)}
      </nav>
      <div className="border-t border-white/10 p-3"><Link href="/login" className="block px-3 py-2 text-xs text-slate-400 hover:text-white">Keluar Akun</Link></div>
    </aside>
  );
}
