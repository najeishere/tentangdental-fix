'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import { fetchApi } from '@/utils/api';

type Visit = {
  id: number;
  invoice_number: string;
  patient_name?: string;
  doctor_name?: string;
  visit_date: string;
  total: number;
  payment_status: string;
};

const rupiah = (value: number | string) => new Intl.NumberFormat('id-ID', {
  style: 'currency', currency: 'IDR', maximumFractionDigits: 0,
}).format(Number(value) || 0);

export default function DashboardAdmin() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [data, setData] = useState({ revenue: 0, expenses: 0, profit: 0, receivables: 0, visits: [] as Visit[] });

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      router.replace('/login');
      return;
    }
    fetchApi('/dashboard')
      .then((json) => {
        const value = json?.data ?? {};
        setData({
          revenue: value.totals?.revenue ?? 0,
          expenses: value.totals?.expenses ?? 0,
          profit: value.totals?.net_clinic_profit ?? 0,
          receivables: value.open_receivables ?? 0,
          visits: value.recent_visits ?? [],
        });
      })
      .catch((err) => setError(err instanceof Error ? err.message : 'Gagal memuat dashboard.'))
      .finally(() => setLoading(false));
  }, [router]);

  const cards = [
    { label: 'Total Revenue', value: data.revenue, tone: 'text-teal-600', bg: 'bg-teal-50', icon: '↗' },
    { label: 'Total Expenses', value: data.expenses, tone: 'text-rose-500', bg: 'bg-rose-50', icon: '↘' },
    { label: 'Net Profit', value: data.profit, tone: 'text-indigo-600', bg: 'bg-indigo-50', icon: '◆' },
    { label: 'Piutang Terbuka', value: data.receivables, tone: 'text-amber-600', bg: 'bg-amber-50', icon: '◷' },
  ];

  return (
    <div className="flex min-h-screen bg-[#f7f9f9] text-slate-800">
      <Sidebar role="admin" />
      <div className="min-w-0 flex-1">
        <Header title="Dashboard" subtitle="Ringkasan aktivitas dan performa keuangan klinik" role="admin" />
        <main className="space-y-6 p-5 sm:p-8">
          {error && <div className="rounded-2xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div>}
          <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {cards.map((card) => (
              <article key={card.label} className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-400">{card.label}</span>
                  <span className={`flex h-9 w-9 items-center justify-center rounded-xl text-sm font-bold ${card.bg} ${card.tone}`}>{card.icon}</span>
                </div>
                <p className="mt-5 text-xl font-bold tracking-tight text-slate-900">{loading ? 'Memuat...' : rupiah(card.value)}</p>
                <p className={`mt-1 text-[11px] font-semibold ${card.tone}`}>{card.label === 'Piutang Terbuka' ? 'Belum tertagih' : 'Data dari server'}</p>
              </article>
            ))}
          </section>

          <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1.6fr_1fr]">
            <article className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
              <div className="flex items-start justify-between">
                <div><h2 className="text-sm font-bold text-slate-900">Transaksi Terbaru</h2><p className="mt-1 text-xs text-slate-400">Kunjungan dan invoice dari backend</p></div>
                <Link href="/Admin/pencatatan-tagihan" className="rounded-xl bg-teal-50 px-3 py-2 text-xs font-bold text-teal-700 hover:bg-teal-100">Lihat billing</Link>
              </div>
              <div className="mt-5 overflow-x-auto">
                <table className="w-full min-w-[580px] text-left text-xs">
                  <thead className="border-b border-slate-100 text-[10px] uppercase tracking-wider text-slate-400"><tr><th className="pb-3">Invoice</th><th className="pb-3">Pasien</th><th className="pb-3">Tanggal</th><th className="pb-3 text-right">Total</th><th className="pb-3 text-right">Status</th></tr></thead>
                  <tbody className="divide-y divide-slate-50">
                    {data.visits.map((visit) => <tr key={visit.id} className="hover:bg-slate-50"><td className="py-4 font-bold text-teal-700">{visit.invoice_number}</td><td className="py-4 font-semibold text-slate-700">{visit.patient_name ?? 'Pasien'}</td><td className="py-4 text-slate-400">{new Date(visit.visit_date).toLocaleDateString('id-ID')}</td><td className="py-4 text-right font-bold">{rupiah(visit.total)}</td><td className="py-4 text-right"><span className="rounded-full bg-amber-50 px-2.5 py-1 text-[10px] font-bold text-amber-600">{visit.payment_status}</span></td></tr>)}
                  </tbody>
                </table>
                {!loading && data.visits.length === 0 && <p className="py-10 text-center text-sm text-slate-400">Belum ada transaksi.</p>}
              </div>
            </article>

            <article className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
              <h2 className="text-sm font-bold text-slate-900">Aksi Cepat</h2>
              <p className="mt-1 text-xs text-slate-400">Kelola operasional klinik</p>
              <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
                <Link href="/Admin/pencatatan-tagihan" className="rounded-2xl border border-teal-100 bg-teal-50 p-4 text-sm font-bold text-teal-800 hover:bg-teal-100">+ Buat tagihan</Link>
                <Link href="/Admin/pembayaran" className="rounded-2xl border border-indigo-100 bg-indigo-50 p-4 text-sm font-bold text-indigo-800 hover:bg-indigo-100">Catat pembayaran</Link>
                <Link href="/Admin/data-tindakan" className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm font-bold text-slate-700 hover:bg-slate-100">Kelola tindakan</Link>
                <Link href="/Admin/laporan-keuangan" className="rounded-2xl border border-amber-100 bg-amber-50 p-4 text-sm font-bold text-amber-800 hover:bg-amber-100">Buka laporan</Link>
              </div>
            </article>
          </section>
        </main>
      </div>
    </div>
  );
}
