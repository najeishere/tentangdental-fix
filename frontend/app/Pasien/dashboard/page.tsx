// app/Pasien/dashboard/page.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { fetchApi } from '@/utils/api';

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
  const selesai = status === 'Selesai' || status === 'Lunas';
  return (
    <div className="py-3 flex justify-between items-center border-b border-[#F3F4F6] last:border-none">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 bg-[#E8F8F7] rounded-full flex items-center justify-center text-[#2EC4B6] font-bold">🦷</div>
        <div>
          <p className="text-[#1A1D2E] text-sm font-medium">{title}</p>
          <p className="text-[#9CA3AF] text-xs">{date}</p>
        </div>
      </div>
      <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${selesai ? 'bg-[#D1FAE5] text-[#059669]' : 'bg-[#FEF3C7] text-[#B45309]'}`}>
        {selesai ? '✓ ' : '● '}{status}
      </span>
    </div>
  );
}

type InvoiceRow = {
  id: number;
  invoice_number: string;
  visit_date: string;
  payment_status: string;
  total: number;
  complaint?: string | null;
  status?: string;
  doctor?: { name: string } | null;
  items?: { tarif_name: string }[];
};

const rupiah = (n: number | string) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(Number(n));

const tgl = (d: string) =>
  new Date(d).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });

const labelStatus = (s: string) =>
  s === 'paid' ? 'Lunas' : s === 'partial' ? 'Bayar Sebagian' : 'Belum Bayar';

export default function DashboardPasien() {
  const router = useRouter();
  const [namaPasien, setNamaPasien] = useState('Pasien');
  const [emailPasien, setEmailPasien] = useState('Pasien');
  const [invoices, setInvoices] = useState<InvoiceRow[]>([]);
  const [totalOutstanding, setTotalOutstanding] = useState(0);
  const [loading, setLoading] = useState(true);

  // Membuat format tanggal otomatis berdasarkan waktu sistem komputer (Bahasa Indonesia)
  const tanggalHariIni = new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      router.replace('/login');
      return;
    }

    const savedNama = localStorage.getItem('pasienNama');
    const savedEmail = localStorage.getItem('pasienEmail');
    if (savedNama) setNamaPasien(savedNama);
    if (savedEmail) setEmailPasien(savedEmail);

    const load = async () => {
      try {
        const [invJson, outJson] = await Promise.all([
          fetchApi('/customer/invoices?per_page=25'),
          fetchApi('/customer/outstanding'),
        ]);
        setInvoices(invJson?.data?.invoices?.data ?? []);
        setTotalOutstanding(outJson?.data?.total_outstanding ?? 0);
      } catch (e) {
        console.error('Gagal memuat data pasien', e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [router]);

  const berikutnya = invoices.find((v) => v.status !== 'completed') ?? invoices[0] ?? null;
  const tagihanTerakhir = invoices[0] ?? null;
  const jumlahLunas = invoices.filter((v) => v.payment_status === 'paid').length;

  return (
    <div className="w-full min-h-screen bg-[#F4F5F7] flex font-sans overflow-hidden">
      
      {/* Sidebar */}
      <aside className="w-[240px] bg-[#1A1D2E] flex flex-col justify-between shrink-0">
        <div>
          <div className="px-6 py-5 border-b border-white/[0.08] flex items-center gap-3">
            <div className="w-9 h-9 bg-white rounded-lg flex items-center justify-center overflow-hidden">
              <Image src="/logo.png" alt="Logo" width={36} height={36} className="object-contain" />
            </div>
            <div>
              <span className="text-white text-sm font-bold block">TentangDental</span>
              <span className="text-[#2EC4B6] text-xs">Pasien</span>
            </div>
          </div>

          <div className="p-3">
            <p className="text-white/30 text-xs font-semibold px-3 pt-4 pb-1 tracking-wider">OVERVIEW</p>
            <NavItem label="Dashboard" href="/Pasien/dashboard" active />
            
            <p className="text-white/30 text-xs font-semibold px-3 pt-6 pb-1 tracking-wider">LAYANAN</p>
            <NavItem label="Tagihan & Invoice" href="/Pasien/dashboard" />
            <NavItem label="Riwayat Kunjungan" href="/Pasien/dashboard" />
          </div>
        </div>

        <div className="p-4">
          <Link href="/Pasien/login" className="text-white/40 hover:text-white text-sm block mb-4 transition">← Keluar</Link>
          <div className="p-4 bg-[#2EC4B6]/[0.12] rounded-2xl border border-[#2EC4B6]/20">
            <p className="text-[#2EC4B6] font-bold text-xs mb-1"> Butuh Bantuan?</p>
            <p className="text-white/45 text-xs mb-2">Hubungi support kami.</p>
            <a href="#" className="text-[#2EC4B6] text-xs font-semibold hover:underline">Pusat bantuan →</a>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-y-auto">
        <header className="px-8 py-4 bg-white border-b border-[#E5E7EB] flex justify-between items-center shrink-0">
          <div>
            <h1 className="text-[#1A1D2E] text-lg font-bold">Dashboard</h1>
            <p className="text-[#6B7280] text-sm">Ringkasan aktivitas klinik</p>
          </div>
          <div className="flex items-center gap-4">
            {/* Tanggal sekarang otomatis tampil */}
            <div className="px-3 py-2 rounded-xl border border-[#E5E7EB] text-[#6B7280] text-sm">
              📅 {tanggalHariIni}
            </div>

            {/* Bagian Profil yang bisa diklik untuk menuju halaman profil */}
            <Link href="/Pasien/profil" className="flex items-center gap-2 cursor-pointer group hover:opacity-80 transition">
              <div className="w-9 h-9 bg-[#2EC4B6] rounded-full flex items-center justify-center text-white font-bold">
                {namaPasien.charAt(0)}
              </div>
              <div>
                <span className="text-[#1A1D2E] text-sm font-semibold block leading-tight group-hover:underline">{namaPasien}</span>
                <span className="text-[#9CA3AF] text-xs">{emailPasien}</span>
              </div>
            </Link>
          </div>
        </header>

        <div className="p-8 flex flex-col gap-6">
          {/* Banner */}
          <div className="p-6 bg-gradient-to-r from-[#1A1D2E] to-[#2EC4B6] rounded-2xl text-white flex flex-col gap-4 shadow-sm">
            <div>
              <p className="text-white/80 text-sm">Selamat datang kembali,</p>
              <h2 className="text-2xl font-bold">{namaPasien}</h2>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <StatCard label="Total Kunjungan" value={loading ? '…' : `${invoices.length}x`} />
              <StatCard label="Tagihan Belum Bayar" value={loading ? '…' : rupiah(totalOutstanding)} />
              <StatCard label="Kunjungan Lunas" value={loading ? '…' : `${jumlahLunas}x`} />
            </div>
          </div>

          {/* Grid Informasi */}
          <div className="grid grid-cols-2 gap-6">
            <div className="p-6 bg-white rounded-2xl border border-[#F0F0F0] shadow-sm">
              <h3 className="text-[#1A1D2E] font-semibold mb-4">Kunjungan Terakhir</h3>
              {loading ? (
                <p className="text-[#9CA3AF] text-sm">Memuat…</p>
              ) : berikutnya ? (
                <div className="p-4 bg-[#E8F8F7] rounded-xl">
                  <h4 className="text-[#1A1D2E] font-bold">{tgl(berikutnya.visit_date)}</h4>
                  <p className="text-[#6B7280] text-sm">
                    {berikutnya.invoice_number} — <strong className="text-[#1A1D2E]">{rupiah(berikutnya.total)}</strong>
                  </p>
                  <p className="text-[#6B7280] text-sm mb-2">{berikutnya.doctor?.name ?? '—'}</p>
                  <span className="text-[#2EC4B6] text-xs font-semibold bg-white/50 px-2 py-1 rounded-md">
                    ● {labelStatus(berikutnya.payment_status)}
                  </span>
                </div>
              ) : (
                <div className="p-4 bg-[#E8F8F7] rounded-xl">
                  <p className="text-[#6B7280] text-sm">Belum ada kunjungan.</p>
                </div>
              )}
            </div>

            <div className="p-6 bg-white rounded-2xl border border-[#F0F0F0] shadow-sm flex flex-col justify-between">
              <h3 className="text-[#1A1D2E] font-semibold">Tagihan Terakhir</h3>
              {loading ? (
                <p className="text-[#9CA3AF] text-sm my-auto">Memuat…</p>
              ) : tagihanTerakhir ? (
                <div className="my-auto">
                  <p className="text-[#1A1D2E] font-bold text-lg">{rupiah(tagihanTerakhir.total)}</p>
                  <p className="text-[#6B7280] text-sm">{tagihanTerakhir.invoice_number}</p>
                  <span
                    className={`text-xs font-semibold px-2 py-1 rounded-md mt-2 inline-block ${
                      tagihanTerakhir.payment_status === 'paid'
                        ? 'bg-[#D1FAE5] text-[#059669]'
                        : 'bg-[#FEF3C7] text-[#B45309]'
                    }`}
                  >
                    {labelStatus(tagihanTerakhir.payment_status)}
                  </span>
                </div>
              ) : (
                <p className="text-[#9CA3AF] text-sm my-auto">Belum ada tagihan</p>
              )}
            </div>
          </div>

          {/* Riwayat */}
          <div className="p-6 bg-white rounded-2xl border border-[#F0F0F0] shadow-sm">
            <h3 className="text-[#1A1D2E] font-semibold mb-2">Riwayat Kunjungan Terakhir</h3>
            <div>
              {loading ? (
                <p className="text-[#9CA3AF] text-sm py-3">Memuat riwayat…</p>
              ) : invoices.length === 0 ? (
                <p className="text-[#9CA3AF] text-sm py-3">Belum ada riwayat kunjungan.</p>
              ) : (
                invoices.slice(0, 5).map((v) => (
                  <RiwayatItem
                    key={v.id}
                    title={v.items?.[0]?.tarif_name ?? v.complaint ?? 'Kunjungan'}
                    date={`${tgl(v.visit_date)} · ${v.doctor?.name ?? '—'}`}
                    status={v.payment_status === 'paid' ? 'Selesai' : labelStatus(v.payment_status)}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}