// app/Klinik/layout.tsx
'use client';

import { usePathname } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';

// Pemetaan Judul & Subtitle Berdasarkan Path URL
const klinikHeaderMap: Record<string, { title: string; subtitle: string }> = {
  '/Klinik/dashboard': {
    title: 'Dashboard',
    subtitle: 'Ringkasan aktivitas klinik',
  },
  '/Klinik/antrean': {
    title: 'Antrean Hari Ini',
    subtitle: 'Daftar pasien yang dijadwalkan',
  },
  '/Klinik/rekam-medis': {
    title: 'Rekam Medis',
    subtitle: 'Pencatatan diagnosa dan pemeriksaan',
  },
  '/Klinik/input-tindakan': {
    title: 'Input Tindakan',
    subtitle: 'Catat tindakan medis pasien',
  },
  '/Klinik/pengiriman-lab': {
    title: 'Pengiriman Lab',
    subtitle: 'Kelola order dan spesimen lab',
  },
  '/Klinik/catatan-bmhp': {
    title: 'Catatan BMHP',
    subtitle: 'Penggunaan bahan medis habis pakai',
  },
};

export default function KlinikLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Ambil title & subtitle sesuai URL, atau fallback default
  const currentHeader = klinikHeaderMap[pathname] || {
    title: 'Klinik Portal',
    subtitle: 'Ringkasan aktivitas dan operasional klinik',
  };

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      {/* Sidebar Role Klinik */}
      <Sidebar role="klinik" />

      {/* Area Konten Utama */}
      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        {/* Header dengan Title & Subtitle Dinamis */}
        <Header
          role="klinik"
          title={currentHeader.title}
          subtitle={currentHeader.subtitle}
        />

        {/* Isi Konten Tab/Page Aktif */}
        <main className="flex-1 p-8 space-y-6">{children}</main>
      </div>
    </div>
  );
}