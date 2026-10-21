// app/(admin)/layout.tsx
'use client';

import { usePathname } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';

// Daftar Judul & Subtitle berdasarkan URL
const PAGE_TITLES: Record<string, { title: string; subtitle: string }> = {
  '/Admin/dashboard': {
    title: 'Dashboard',
    subtitle: 'Ringkasan aktivitas klinik',
  },
  '/Admin/antrean': {
    title: 'Manajemen Antrean',
    subtitle: 'Daftar antrean pasien hari ini',
  },
  '/Admin/billing': {
    title: 'Pencatatan Tagihan',
    subtitle: 'Kelola tagihan dan invoice pasien',
  },
  '/Admin/pembayaran': {
    title: 'Pembayaran',
    subtitle: 'Riwayat dan transaksi pembayaran',
  },
  '/Admin/rekonsiliasi': {
    title: 'Rekonsiliasi',
    subtitle: 'Pemeriksaan dan kesesuaian kas',
  },
  '/Admin/laporan': {
    title: 'Laporan Keuangan',
    subtitle: 'Laba Rugi, Arus Kas & Neraca',
  },
  '/Admin/pengaturan': {
    title: 'Pengaturan Sistem',
    subtitle: 'Konfigurasi klinik dan akun',
  },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Ambil judul sesuai URL aktif
  const currentPage = PAGE_TITLES[pathname] || {
    title: 'Dashboard',
    subtitle: 'Ringkasan aktivitas klinik',
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar role="ADMIN" />
      <div className="flex-1 flex flex-col min-w-0">
        <Header title={currentPage.title} subtitle={currentPage.subtitle} />
        <main className="p-8 flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}