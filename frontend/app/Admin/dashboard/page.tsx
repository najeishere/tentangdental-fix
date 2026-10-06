// app/Admin/dashboard/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { fetchApi } from '@/utils/api';

type RecentVisit = {
  id: number;
  invoice_number: string;
  patient_name: string;
  doctor_name: string;
  visit_date: string;
  total: number;
  payment_status: string;
};

export default function DashboardAdmin() {
  const router = useRouter();
  const [tanggalHariIni, setTanggalHariIni] = useState('');
  const [namaAdmin, setNamaAdmin] = useState('Nadia A.');
  const [jabatanAdmin, setJabatanAdmin] = useState('Finance Admin');

  const [stats, setStats] = useState<{
    revenue: number;
    expenses: number;
    net: number;
    receivables: number;
    recentVisits: RecentVisit[];
    loading: boolean;
  }>({ revenue: 0, expenses: 0, net: 0, receivables: 0, recentVisits: [], loading: true });

  // State untuk statistik antrean dinamis yang tersinkronisasi dari Manajemen Antrean
  const [statAntrean, setStatAntrean] = useState({
    total: 6,
    pending: 3,
    proses: 1,
    selesai: 2,
  });

  useEffect(() => {
    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' };
    const formattedDate = new Date().toLocaleDateString('id-ID', options);
    setTanggalHariIni(formattedDate);

    const savedNama = localStorage.getItem('adminNama');
    const savedJabatan = localStorage.getItem('adminJabatan');
    if (savedNama) setNamaAdmin(savedNama);
    if (savedJabatan) setJabatanAdmin(savedJabatan);

    if (!localStorage.getItem('token')) {
      router.replace('/login');
      return;
    }

    // Ambil statistik keuangan dari API
    const loadStats = async () => {
      try {
        const json = await fetchApi('/dashboard');
        const d = json?.data ?? {};
        setStats({
          revenue: d.totals?.revenue ?? 0,
          expenses: d.totals?.expenses ?? 0,
          net: d.totals?.net_clinic_profit ?? 0,
          receivables: d.open_receivables ?? 0,
          recentVisits: d.recent_visits ?? [],
          loading: false,
        });
      } catch {
        setStats((s) => ({ ...s, loading: false }));
      }
    };
    loadStats();

    // Ambil data antrean dari localStorage jika ada perubahan dari Manajemen Antrean
    const savedAntrean = localStorage.getItem('daftarAntreanKlinik');
    if (savedAntrean) {
      try {
        const parsedAntrean = JSON.parse(savedAntrean);
        const total = parsedAntrean.length;
        const pending = parsedAntrean.filter((item: { status: string }) => item.status === 'Pending').length;
        const proses = parsedAntrean.filter((item: { status: string }) => item.status === 'Proses').length;
        const selesai = parsedAntrean.filter((item: { status: string }) => item.status === 'Selesai').length;

        setStatAntrean({ total, pending, proses, selesai });
      } catch (e) {
        console.error('Gagal memuat data antrean', e);
      }
    }
  }, [router]);

  const rupiah = (n: number) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n);

  return (
    <div className="min-h-screen bg-[#F4F5F7] flex font-sans text-slate-800">
      
      {/* SIDEBAR KIRI */}
      <aside className="w-64 bg-[#1A1D2E] text-white flex flex-col justify-between shrink-0 h-screen sticky top-0 overflow-y-auto">
        <div>
          {/* Logo & Brand */}
          <div className="px-6 py-4 border-b border-white/10 flex items-center gap-3">
            <div className="w-9 h-9 bg-white rounded-xl flex items-center justify-center overflow-hidden shadow-sm">
              <Image src="/logo.png" alt="Logo" width={36} height={36} className="object-contain" />
            </div>
            <div>
              <h2 className="text-sm font-bold tracking-wide">TentangDental</h2>
              <p className="text-xs text-[#2EC4B6]">Finance Admin</p>
            </div>
          </div>

          {/* Menu Navigasi */}
          <div className="p-3 space-y-4 text-xs">
            <div>
              <p className="text-[10px] font-bold text-slate-400 tracking-wider uppercase px-3 mb-1.5">Overview</p>
              <div className="px-3 py-2 bg-[#2EC4B6] text-white font-medium rounded-xl flex items-center gap-3 shadow-sm cursor-pointer">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/></svg>
                Dashboard
              </div>
            </div>

            <div>
              <p className="text-[10px] font-bold text-slate-400 tracking-wider uppercase px-3 mb-1.5">Operasional</p>
              <div className="space-y-0.5 text-slate-300">
                {[
                  { name: 'Manajemen Antrean', path: '/Admin/manajemen-antrean', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' },
                  { name: 'Pencatatan Tagihan', path: '/Admin/pencatatan-tagihan', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01' },
                  { name: 'Pembayaran', path: '/Admin/pembayaran', icon: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z' },
                  { name: 'Pengiriman Lab', path: '/Admin/pengiriman-lab', icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4' },
                  { name: 'Catatan BMHP', path: '/Admin/catatan-bmhp', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' }
                ].map((menu, i) => (
                  <Link key={i} href={menu.path} className="px-3 py-2 rounded-xl hover:bg-white/5 hover:text-white cursor-pointer transition flex items-center gap-3">
                    <svg className="w-4 h-4 opacity-70" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d={menu.icon}/></svg>
                    {menu.name}
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <p className="text-[10px] font-bold text-slate-400 tracking-wider uppercase px-3 mb-1.5">Keuangan</p>
              <div className="space-y-0.5 text-slate-300">
                {[
                  { name: 'Rekonsiliasi', path: '/Admin/rekonsiliasi', icon: 'M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3' },
                  { name: 'Laporan Keuangan', path: '/Admin/laporan-keuangan', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' }
                ].map((menu, i) => (
                  <Link key={i} href={menu.path} className="px-3 py-2 rounded-xl hover:bg-white/5 hover:text-white cursor-pointer transition flex items-center gap-3">
                    <svg className="w-4 h-4 opacity-70" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d={menu.icon}/></svg>
                    {menu.name}
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <p className="text-[10px] font-bold text-slate-400 tracking-wider uppercase px-3 mb-1.5">Data & Sistem</p>
              <div className="space-y-0.5 text-slate-300">
                <Link href="/Admin/data-pasien" className="px-3 py-2 rounded-xl hover:bg-white/5 hover:text-white cursor-pointer transition flex items-center gap-3">
                  <svg className="w-4 h-4 opacity-70" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
                  Data Pasien
                </Link>
                <Link href="/Admin/data-tindakan" className="px-3 py-2 rounded-xl hover:bg-white/5 hover:text-white cursor-pointer transition flex items-center gap-3">
                  <svg className="w-4 h-4 opacity-70" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/></svg>
                  Data Tindakan
                </Link>
                <Link href="/Admin/pengaturan" className="px-3 py-2 rounded-xl hover:bg-white/5 hover:text-white cursor-pointer transition flex items-center gap-3">
                  <svg className="w-4 h-4 opacity-70" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065zM15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                  Pengaturan
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Sidebar */}
        <div className="p-3 border-t border-white/10 space-y-3">
          <Link href="/Admin/login" className="flex items-center gap-2.5 text-xs text-slate-400 hover:text-white transition px-3 py-1.5 font-medium">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
            Keluar Akun
          </Link>
        </div>
      </aside>

      {/* KONTEN UTAMA */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Header Atas */}
        <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-20">
          <div>
            <h1 className="text-base font-bold text-slate-900">Dashboard</h1>
            <p className="text-[11px] text-slate-500">Ringkasan aktivitas dan performa keuangan klinik</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-600 flex items-center gap-2">
              <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
              {tanggalHariIni || 'Memuat...'}
            </div>

            <button className="w-9 h-9 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-center relative hover:bg-slate-100 transition text-slate-600">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>
              <span className="w-2 h-2 bg-rose-500 rounded-full absolute top-2 right-2"></span>
            </button>

            {/* Profil Langsung Klik ke Pengaturan */}
            <div 
              onClick={() => router.push('/Admin/pengaturan')}
              className="flex items-center gap-2.5 pl-2 pr-3 py-1 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl cursor-pointer transition"
            >
              <div className="w-7 h-7 bg-[#2EC4B6] rounded-full text-white font-bold text-xs flex items-center justify-center shadow-sm">
                {namaAdmin.charAt(0)}
              </div>
              <div className="text-left">
                <p className="text-xs font-bold text-slate-900 leading-tight">{namaAdmin}</p>
                <p className="text-[10px] text-slate-400">{jabatanAdmin}</p>
              </div>
            </div>

          </div>
        </header>

        {/* Isi Dashboard */}
        <main className="p-6 space-y-5 overflow-y-auto">
          
          {/* Kartu Statistik Keuangan */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { title: 'Total Revenue', amount: stats.loading ? '…' : rupiah(stats.revenue), note: 'Pendapatan bulan ini', color: 'text-[#2EC4B6]', bg: 'bg-teal-50' },
              { title: 'Total Expenses', amount: stats.loading ? '…' : rupiah(stats.expenses), note: 'Pengeluaran bulan ini', color: 'text-rose-500', bg: 'bg-rose-50' },
              { title: 'Net Profit', amount: stats.loading ? '…' : rupiah(stats.net), note: 'Laba bersih klinik', color: 'text-[#2EC4B6]', bg: 'bg-teal-50' },
              { title: 'Piutang Terbuka', amount: stats.loading ? '…' : rupiah(stats.receivables), note: 'Belum tertagih', color: 'text-blue-500', bg: 'bg-blue-50' },
            ].map((stat, idx) => (
              <div key={idx} className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
                <div className="flex justify-between items-start mb-3">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">{stat.title}</span>
                  <div className={`w-7 h-7 ${stat.bg} ${stat.color} rounded-lg flex items-center justify-center font-bold text-xs`}>•</div>
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-slate-900 mb-0.5">{stat.amount}</h3>
                  <p className={`text-[11px] font-semibold ${stat.color}`}>{stat.note}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Grafik & Profit Composition */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Revenue vs Expenses</h3>
                  <p className="text-[11px] text-slate-400">Monthly performance · Apr–Sep 2026</p>
                </div>
                <div className="flex items-center gap-3 text-xs font-medium text-slate-600">
                  <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-[#2EC4B6] rounded-full"></span> Revenue</div>
                  <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-slate-400 rounded-full"></span> Expenses</div>
                </div>
              </div>

              <div className="h-44 flex items-end justify-between gap-3 pt-3 border-b border-slate-100 px-2 pb-1">
                {['Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep'].map((bln, idx) => (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                    <div className="w-full flex items-end justify-center gap-1 h-full">
                      <div className="w-3.5 bg-[#2EC4B6] rounded-t-md transition-all" style={{ height: `${65 + idx * 5}%` }}></div>
                      <div className="w-3.5 bg-slate-400/80 rounded-t-md transition-all" style={{ height: `${35 + idx * 4}%` }}></div>
                    </div>
                    <span className="text-[11px] font-medium text-slate-500">{bln}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 mb-0.5">Profit Composition</h3>
                <p className="text-[11px] text-slate-400 mb-3">September 2026</p>

                <div className="p-3 bg-slate-50 rounded-xl mb-4 border border-slate-100">
                  <div className="flex justify-between items-center text-[11px] text-slate-500 mb-0.5">
                    <span>Net profit</span>
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-full text-[9px] font-extrabold tracking-wide">ON TRACK</span>
                  </div>
                  <div className="text-lg font-extrabold text-slate-900">Rp 53.400.000</div>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <div className="flex justify-between font-bold text-slate-700 mb-1"><span>General Dentistry</span><span>48%</span></div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mb-0.5"><div className="bg-[#2EC4B6] h-full w-[48%] rounded-full"></div></div>
                    <span className="text-[10px] text-slate-400">Rp 25.6M</span>
                  </div>
                  <div>
                    <div className="flex justify-between font-bold text-slate-700 mb-1"><span>Cosmetic Treatment</span><span>32%</span></div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mb-0.5"><div className="bg-amber-500 h-full w-[32%] rounded-full"></div></div>
                    <span className="text-[10px] text-slate-400">Rp 17.1M</span>
                  </div>
                  <div>
                    <div className="flex justify-between font-bold text-slate-700 mb-1"><span>Other Services</span><span>20%</span></div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mb-0.5"><div className="bg-blue-400 h-full w-[20%] rounded-full"></div></div>
                    <span className="text-[10px] text-slate-400">Rp 10.7M</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bagian Bawah: Transaksi Terbaru, Reconciliation, & Antrean Hari Ini */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            
            {/* Transaksi Terbaru */}
            <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-3">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Transaksi Terbaru</h3>
                  <p className="text-[11px] text-slate-400">Pergerakan kas klinik hari ini</p>
                </div>
                <Link href="/Admin/pembayaran" className="text-xs text-[#2EC4B6] font-semibold cursor-pointer hover:underline">Lihat semua →</Link>
              </div>

              <div className="divide-y divide-slate-100 text-xs">
                {stats.loading ? (
                  <div className="py-4 text-center text-slate-400">Memuat transaksi…</div>
                ) : stats.recentVisits.length === 0 ? (
                  <div className="py-4 text-center text-slate-400">Belum ada transaksi.</div>
                ) : (
                  stats.recentVisits.slice(0, 5).map((v) => (
                    <div key={v.id} className="py-2.5 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold ${v.payment_status === 'paid' ? 'bg-teal-50 text-[#2EC4B6]' : 'bg-amber-50 text-amber-500'}`}>
                          {v.payment_status === 'paid' ? '↙' : '…'}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">{v.patient_name}</p>
                          <p className="text-[10px] text-slate-400">{v.invoice_number}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-slate-900">
                          {new Date(v.visit_date).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </p>
                        <p className="text-[10px] text-slate-400">{v.doctor_name}</p>
                      </div>
                      <div className="text-right">
                        <p className={`font-bold ${v.payment_status === 'paid' ? 'text-[#2EC4B6]' : v.payment_status === 'partial' ? 'text-amber-500' : 'text-rose-500'}`}>
                          +{rupiah(v.total)}
                        </p>
                        <span
                          className={`px-2 py-0.5 rounded-md font-bold text-[9px] ${
                            v.payment_status === 'paid'
                              ? 'bg-emerald-100 text-emerald-700'
                              : v.payment_status === 'partial'
                              ? 'bg-amber-100 text-amber-700'
                              : 'bg-rose-100 text-rose-600'
                          }`}
                        >
                          {v.payment_status === 'paid' ? 'Lunas' : v.payment_status === 'partial' ? 'Sebagian' : 'Belum'}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Kolom Kanan: Reconciliation & Antrean Hari Ini */}
            <div className="space-y-5">
              
              {/* Reconciliation */}
              <div className="bg-[#1A1D2E] text-white p-5 rounded-2xl shadow-sm space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold tracking-wide">⚖️ Reconciliation</span>
                  <span className="px-2 py-0.5 bg-emerald-500/20 text-[#2EC4B6] rounded-full font-bold text-[9px]">ON TRACK</span>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400">September 2026</p>
                  <h3 className="text-lg font-extrabold text-white mt-0.5">Rp 78.650.000</h3>
                  <p className="text-[10px] text-slate-400">98.7% transaksi cocok</p>
                </div>
                <div className="grid grid-cols-2 gap-2.5 pt-1">
                  <div className="bg-white/5 p-2.5 rounded-xl border border-white/10">
                    <p className="text-sm font-extrabold text-white">124</p>
                    <p className="text-[9px] text-slate-400 uppercase">Matched</p>
                  </div>
                  <div className="bg-white/5 p-2.5 rounded-xl border border-white/10">
                    <p className="text-sm font-extrabold text-white">3</p>
                    <p className="text-[9px] text-slate-400 uppercase">Need review</p>
                  </div>
                </div>
                <button 
                  onClick={() => router.push('/Admin/rekonsiliasi')}
                  className="w-full py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition text-center"
                >
                  Review reconciliation →
                </button>
              </div>

              {/* Antrean Hari Ini (Otomatis Menyesuaikan dari Manajemen Antrean) */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 mb-3">Antrean Hari Ini</h3>
                  <div className="grid grid-cols-2 gap-2.5 mb-3 text-xs">
                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-center">
                      <p className="text-base font-extrabold text-[#2EC4B6]">{statAntrean.total}</p>
                      <p className="text-[9px] font-semibold text-slate-400 uppercase">Total</p>
                    </div>
                    <div className="bg-amber-50/50 p-2.5 rounded-xl border border-amber-100/60 text-center">
                      <p className="text-base font-extrabold text-amber-600">{statAntrean.pending}</p>
                      <p className="text-[9px] font-semibold text-slate-400 uppercase">Pending</p>
                    </div>
                    <div className="bg-blue-50/50 p-2.5 rounded-xl border border-blue-100/60 text-center">
                      <p className="text-base font-extrabold text-blue-600">{statAntrean.proses}</p>
                      <p className="text-[9px] font-semibold text-slate-400 uppercase">Proses</p>
                    </div>
                    <div className="bg-emerald-50/50 p-2.5 rounded-xl border border-emerald-100/60 text-center">
                      <p className="text-base font-extrabold text-emerald-600">{statAntrean.selesai}</p>
                      <p className="text-[9px] font-semibold text-slate-400 uppercase">Selesai</p>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => router.push('/Admin/manajemen-antrean')}
                  className="w-full py-2 bg-emerald-50 text-[#2EC4B6] hover:bg-emerald-100 rounded-xl text-xs font-bold transition text-center"
                >
                  Kelola Antrean →
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}