// app/Pasien/dashboard/page.tsx
import Link from 'next/link';
import Image from 'next/image';

// Komponen kecil untuk Menu Sidebar agar lebih rapi
function NavItem({ label, href, active = false }: { label: string; href: string; active?: boolean }) {
  return (
    <Link href={href}>
      <div className={`px-3 py-2.5 rounded-xl flex items-center gap-3 cursor-pointer transition ${active ? 'bg-[#2EC4B6] text-white' : 'text-white/65 hover:bg-white/[0.05]'}`}>
        <span className="text-sm font-medium">{label}</span>
      </div>
    </Link>
  );
}

// Komponen kecil untuk Kartu Statistik di Banner
function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-3 bg-white/15 rounded-xl flex flex-col backdrop-blur-sm">
      <span className="text-white/70 text-xs">{label}</span>
      <span className="text-lg font-bold">{value}</span>
    </div>
  );
}

// Komponen kecil untuk Baris Riwayat
function RiwayatItem({ title, date, status }: { title: string; date: string; status: string }) {
  return (
    <div className="py-3 flex justify-between items-center border-b border-[#F3F4F6] last:border-none">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 bg-[#E8F8F7] rounded-full flex items-center justify-center text-[#2EC4B6] font-bold">🦷</div>
        <div>
          <p className="text-[#1A1D2E] text-sm font-medium">{title}</p>
          <p className="text-[#9CA3AF] text-xs">{date}</p>
        </div>
      </div>
      <span className="px-2.5 py-1 bg-[#D1FAE5] text-[#059669] text-xs font-semibold rounded-full">✓ {status}</span>
    </div>
  );
}

export default function DashboardPasien() {
  // Membuat format tanggal otomatis berdasarkan waktu sistem komputer (Bahasa Indonesia)
  const tanggalHariIni = new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="w-full min-h-screen bg-[#F4F5F7] flex font-sans overflow-hidden">
      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-y-auto">
        
        <div className="p-8 flex flex-col gap-6">
          {/* Banner */}
          <div className="p-6 bg-gradient-to-r from-[#1A1D2E] to-[#2EC4B6] rounded-2xl text-white flex flex-col gap-4 shadow-sm">
            <div>
              <p className="text-white/80 text-sm">Selamat datang kembali,</p>
              <h2 className="text-2xl font-bold">Budi Santoso</h2>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <StatCard label="No. Pasien" value="P-00124" />
              <StatCard label="Total Kunjungan" value="12x" />
              <StatCard label="Antrean Aktif" value="1" />
            </div>
          </div>

          {/* Grid Informasi */}
          <div className="grid grid-cols-2 gap-6">
            <div className="p-6 bg-white rounded-2xl border border-[#F0F0F0] shadow-sm">
              <h3 className="text-[#1A1D2E] font-semibold mb-4">Kunjungan Berikutnya</h3>
              <div className="p-4 bg-[#E8F8F7] rounded-xl">
                <h4 className="text-[#1A1D2E] font-bold">16 Sep 2026</h4>
                <p className="text-[#6B7280] text-sm">Pukul 10:00 WIB — No. Antrean <strong className="text-[#1A1D2E]">A-041</strong></p>
                <p className="text-[#6B7280] text-sm mb-2">drg. Sari Dewi</p>
                <span className="text-[#2EC4B6] text-xs font-semibold bg-white/50 px-2 py-1 rounded-md">● Menunggu</span>
              </div>
            </div>

            <div className="p-6 bg-white rounded-2xl border border-[#F0F0F0] shadow-sm flex flex-col justify-between">
              <h3 className="text-[#1A1D2E] font-semibold">Tagihan Terakhir</h3>
              <p className="text-[#9CA3AF] text-sm my-auto">Belum ada tagihan</p>
            </div>
          </div>

          {/* Riwayat */}
          <div className="p-6 bg-white rounded-2xl border border-[#F0F0F0] shadow-sm">
            <h3 className="text-[#1A1D2E] font-semibold mb-2">Riwayat Kunjungan Terakhir</h3>
            <div>
              <RiwayatItem title="Scaling & Polishing" date="02 Sep 2026 · drg. Sari Dewi" status="Selesai" />
              <RiwayatItem title="Tambal Gigi Komposit" date="15 Agu 2026 · drg. Hendra K." status="Selesai" />
              <RiwayatItem title="Konsultasi" date="28 Jul 2026 · drg. Sari Dewi" status="Selesai" />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}