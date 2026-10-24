// app/Pasien/layout.tsx
'use client';

import { usePathname } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';

// Mapping Title & Subtitle Khusus Pasien Portal
const pasienHeaderMap: Record<string, { title: string; subtitle: string }> = {
  '/Pasien/dashboard': {
    title: 'Dashboard',
    subtitle: 'Ringkasan aktivitas klinik',
  },
  '/Pasien/antrean': {
    title: 'Antrean Saya',
    subtitle: 'Informasi dan status antrean aktif Anda',
  },
  '/Pasien/riwayat': {
    title: 'Riwayat Kunjungan',
    subtitle: 'Catatan rekam medis dan perawatan sebelumnya',
  },
  '/Pasien/tagihan': {
    title: 'Tagihan & Invoice',
    subtitle: 'Rincian pembayaran dan riwayat transaksi',
  },
};

export default function PasienLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const currentHeader = pasienHeaderMap[pathname] || {
    title: 'Dashboard',
    subtitle: 'Ringkasan aktivitas klinik',
  };

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      {/* Sidebar Role Pasien */}
      <Sidebar role="pasien" />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        {/* Header Khusus Pasien */}
        <Header
          role="pasien"
          title={currentHeader.title}
          subtitle={currentHeader.subtitle}
        />

        {/* Dynamic Page Component */}
        <main className="flex-1 p-8 space-y-6">{children}</main>
      </div>
    </div>
  );
}