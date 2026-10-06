// app/Klinik/dashboard/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8002/api';

type RecentVisit = {
  id: number;
  invoice_number: string;
  patient_name: string;
  doctor_name: string;
  visit_date: string;
  total: number;
  payment_status: string;
};

type DashboardStats = {
  visits_today: number;
  visits_this_month: number;
  open_receivables: number;
  patients: number;
  recent_visits: RecentVisit[];
};

export default function DashboardTimKlinik() {
  const router = useRouter();
  const [namaDokter, setNamaDokter] = useState('drg. Sari Dewi');
  const [tanggalHariIni, setTanggalHariIni] = useState('');
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const savedNama = localStorage.getItem('klinikNama');
    if (savedNama) setNamaDokter(savedNama);

    setTanggalHariIni(
      new Date().toLocaleDateString('id-ID', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    );

    const token = localStorage.getItem('token');
    if (!token) {
      router.replace('/Klinik/login');
      return;
    }

    const load = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/dashboard`, {
          headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
        });
        if (res.status === 401) {
          router.replace('/Klinik/login');
          return;
        }
        const json = await res.json();
        const d = json?.data ?? {};
        setStats({
          visits_today: d.daily?.visits_today ?? 0,
          visits_this_month: d.visits_this_month ?? 0,
          open_receivables: d.open_receivables ?? 0,
          patients: d.patients ?? 0,
          recent_visits: d.recent_visits ?? [],
        });
      } catch {
        setError('Gagal memuat data dashboard.');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [router]);

  const handleLogout = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        await fetch(`${API_BASE_URL}/auth/logout`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
        });
      } catch {
        // abaikan error logout
      }
    }
    localStorage.removeItem('token');
    localStorage.removeItem('klinikNama');
    localStorage.removeItem('klinikRole');
    router.push('/Klinik/login');
  };

  const formatRupiah = (n: number) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n);

  return (
    <div className="min-h-screen bg-[#F4F5F7] flex font-sans text-slate-800 w-full">
      {/* SIDEBAR KIRI */}
      <aside className="w-64 bg-[#1A1D2E] text-white flex flex-col justify-between shrink-0 h-screen sticky top-0 overflow-y-auto">
        <div>
          <div className="px-6 py-5 border-b border-white/10 flex items-center gap-3">
            <div className="w-9 h-9 bg-white rounded-xl flex items-center justify-center overflow-hidden shadow-sm">
              <Image src="/logo.png" alt="Logo" width={36} height={36} className="object-contain" />
            </div>
            <div>
              <h2 className="text-sm font-bold tracking-wide">TentangDental</h2>
              <p className="text-xs text-[#2EC4B6]">Tim Klinik</p>
            </div>
          </div>

          <div className="p-4 space-y-6 text-sm">
            <div>
              <p className="text-[10px] font-bold text-slate-400 tracking-wider uppercase px-3 mb-2">Overview</p>
              <div className="px-3 py-2.5 bg-[#2EC4B6] text-white font-medium rounded-xl flex items-center gap-3 shadow-sm cursor-pointer">
                Dashboard
              </div>
            </div>

            <div>
              <p className="text-[10px] font-bold text-slate-400 tracking-wider uppercase px-3 mb-2">Medis</p>
              <div className="space-y-1 text-slate-300">
                <Link href="/Admin/manajemen-antrean" className="px-3 py-2.5 rounded-xl hover:bg-white/5 hover:text-white transition flex items-center gap-3">
                  Antrean Hari Ini
                </Link>
                <Link href="/Admin/data-pasien" className="px-3 py-2.5 rounded-xl hover:bg-white/5 hover:text-white transition flex items-center gap-3">
                  Rekam Medis
                </Link>
                <Link href="/Admin/pencatatan-tagihan" className="px-3 py-2.5 rounded-xl hover:bg-white/5 hover:text-white transition flex items-center gap-3">
                  Input Tindakan
                </Link>
              </div>
            </div>

            <div>
              <p className="text-[10px] font-bold text-slate-400 tracking-wider uppercase px-3 mb-2">Akun</p>
              <Link href="/Klinik/profil" className="px-3 py-2.5 rounded-xl text-slate-300 hover:bg-white/5 hover:text-white transition flex items-center gap-3">
                Profil Saya
              </Link>
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-white/10 space-y-4">
          <button
            onClick={handleLogout}
            className="w-full text-left flex items-center gap-2.5 text-xs text-slate-400 hover:text-white transition px-3 py-2 font-medium"
          >
            Keluar
          </button>

          <div className="p-3.5 bg-[#2EC4B6]/10 rounded-2xl border border-[#2EC4B6]/20">
            <p className="text-xs font-semibold text-white mb-1">Butuh Bantuan?</p>
            <p className="text-[11px] text-slate-300 mb-2">Kunjungi panduan atau hubungi support kami.</p>
            <span className="text-xs font-semibold text-[#2EC4B6] cursor-pointer hover:underline">Buka pusat bantuan →</span>
          </div>
        </div>
      </aside>

      {/* KONTEN UTAMA */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-20 bg-white border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-20 w-full">
          <div>
            <h1 className="text-lg font-bold text-slate-900">Dashboard</h1>
            <p className="text-xs text-slate-500">Ringkasan aktivitas klinik</p>
          </div>

          <div className="flex items-center gap-4">
            <div className="px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-600">
              📅 {tanggalHariIni}
            </div>

            <div
              onClick={() => router.push('/Klinik/profil')}
              className="flex items-center gap-3 pl-2 pr-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl cursor-pointer transition"
            >
              <div className="w-8 h-8 bg-[#2EC4B6] rounded-full text-white font-bold text-xs flex items-center justify-center shadow-sm">
                {namaDokter.charAt(0)}
              </div>
              <div className="text-left">
                <p className="text-xs font-bold text-slate-900 leading-tight">{namaDokter}</p>
                <p className="text-[10px] text-slate-400">Tim Klinik</p>
              </div>
            </div>
          </div>
        </header>

        <main className="p-8 space-y-6 w-full">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-100 text-rose-600 text-xs rounded-xl">{error}</div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Kunjungan Hari Ini</span>
              <div>
                <h3 className="text-2xl font-extrabold text-slate-900 mb-1">{loading ? '…' : stats?.visits_today ?? 0}</h3>
                <p className="text-xs font-semibold text-[#2EC4B6]">Hari ini</p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Kunjungan Bulan Ini</span>
              <div>
                <h3 className="text-2xl font-extrabold text-slate-900 mb-1">{loading ? '…' : stats?.visits_this_month ?? 0}</h3>
                <p className="text-xs font-semibold text-emerald-600">Bulan berjalan</p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Piutang Terbuka</span>
              <div>
                <h3 className="text-2xl font-extrabold text-slate-900 mb-1">{loading ? '…' : formatRupiah(stats?.open_receivables ?? 0)}</h3>
                <p className="text-xs font-semibold text-amber-500">Belum tertagih</p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Total Pasien</span>
              <div>
                <h3 className="text-2xl font-extrabold text-slate-900 mb-1">{loading ? '…' : stats?.patients ?? 0}</h3>
                <p className="text-xs font-semibold text-blue-500">Terdaftar</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4 w-full">
            <h3 className="text-sm font-bold text-slate-900 pb-3 border-b border-slate-100">Kunjungan Terbaru</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="text-slate-400 border-b border-slate-100">
                    <th className="pb-3 font-semibold">No. Invoice</th>
                    <th className="pb-3 font-semibold">Nama Pasien</th>
                    <th className="pb-3 font-semibold">Dokter</th>
                    <th className="pb-3 font-semibold">Tanggal</th>
                    <th className="pb-3 font-semibold text-right">Total</th>
                    <th className="pb-3 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="py-6 text-center text-slate-400">Memuat data…</td>
                    </tr>
                  ) : (stats?.recent_visits?.length ?? 0) === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-6 text-center text-slate-400">Belum ada kunjungan.</td>
                    </tr>
                  ) : (
                    stats?.recent_visits?.map((v) => (
                      <tr key={v.id} className="hover:bg-slate-50 transition">
                        <td className="py-3.5 font-bold text-[#2EC4B6]">{v.invoice_number}</td>
                        <td className="py-3.5 font-bold text-slate-900">{v.patient_name}</td>
                        <td className="py-3.5 font-medium">{v.doctor_name}</td>
                        <td className="py-3.5 text-slate-500">
                          {new Date(v.visit_date).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </td>
                        <td className="py-3.5 text-right font-semibold">{formatRupiah(v.total)}</td>
                        <td className="py-3.5">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                              v.payment_status === 'paid'
                                ? 'bg-emerald-100 text-emerald-700'
                                : v.payment_status === 'partial'
                                ? 'bg-amber-100 text-amber-700'
                                : 'bg-rose-100 text-rose-700'
                            }`}
                          >
                            {v.payment_status === 'paid' ? 'Lunas' : v.payment_status === 'partial' ? 'Sebagian' : 'Belum Bayar'}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
