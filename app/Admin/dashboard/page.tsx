// app/(admin)/dashboard/page.tsx
'use client';

import Link from 'next/link';

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* 1. TOP STATS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Revenue */}
        <div className="p-5 bg-white rounded-3xl border border-gray-100 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-400">Total Revenue</span>
            <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-500 flex items-center justify-center">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
            </div>
          </div>
          <div>
            <p className="text-xl font-bold text-gray-900">Rp 85.400.000</p>
            <p className="text-[10px] font-bold text-teal-500 mt-1">+12.4% vs bulan lalu</p>
          </div>
        </div>

        {/* Total Expenses */}
        <div className="p-5 bg-white rounded-3xl border border-gray-100 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-400">Total Expenses</span>
            <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-400 flex items-center justify-center">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" /></svg>
            </div>
          </div>
          <div>
            <p className="text-xl font-bold text-gray-900">Rp 32.000.000</p>
            <p className="text-[10px] font-bold text-rose-400 mt-1">+4.8%</p>
          </div>
        </div>

        {/* Net Profit */}
        <div className="p-5 bg-white rounded-3xl border border-gray-100 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-400">Net Profit</span>
            <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-500 flex items-center justify-center font-bold text-xs">
              $
            </div>
          </div>
          <div>
            <p className="text-xl font-bold text-gray-900">Rp 53.400.000</p>
            <p className="text-[10px] font-bold text-teal-500 mt-1">+18.2%</p>
          </div>
        </div>

        {/* Cash Balance */}
        <div className="p-5 bg-white rounded-3xl border border-gray-100 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-400">Cash Balance</span>
            <div className="w-8 h-8 rounded-xl bg-gray-100 text-gray-500 flex items-center justify-center">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8"><path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
            </div>
          </div>
          <div>
            <p className="text-xl font-bold text-gray-900">Rp 72.500.000</p>
            <p className="text-[10px] font-medium text-teal-500 mt-1">Saldo kas tersedia</p>
          </div>
        </div>
      </div>

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* SISI KIRI (8 KOLOM) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Revenue vs Expenses Chart */}
          <div className="p-6 bg-white rounded-3xl border border-gray-100 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-gray-900">Revenue vs Expenses</h3>
                <p className="text-[10px] text-gray-400 mt-0.5">Monthly performance · Apr–Sep 2026</p>
              </div>
              <div className="flex items-center gap-4 text-xs font-semibold">
                <span className="flex items-center gap-1.5 text-gray-600">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#25A99D]" /> Revenue
                </span>
                <span className="flex items-center gap-1.5 text-gray-600">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#B07D70]" /> Expenses
                </span>
              </div>
            </div>

            <div className="pt-8 pb-4 flex items-end justify-between gap-4 h-48 border-b border-gray-100 px-4">
              {[
                { month: 'Apr', rev: 60, exp: 30 },
                { month: 'Mei', rev: 70, exp: 35 },
                { month: 'Jun', rev: 65, exp: 32 },
                { month: 'Jul', rev: 75, exp: 40 },
                { month: 'Agu', rev: 78, exp: 38 },
                { month: 'Sep', rev: 85, exp: 42 },
              ].map((d) => (
                <div key={d.month} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                  <div className="flex items-end gap-1.5 w-full justify-center h-full">
                    <div className="w-1/3 bg-[#25A99D] rounded-t-lg" style={{ height: `${d.rev}%` }} />
                    <div className="w-1/3 bg-[#B07D70] rounded-t-lg" style={{ height: `${d.exp}%` }} />
                  </div>
                  <span className="text-[10px] font-bold text-gray-400">{d.month}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Transaksi Terbaru */}
          <div className="p-6 bg-white rounded-3xl border border-gray-100 shadow-sm space-y-4">
            <div>
              <h3 className="text-sm font-bold text-gray-900">Transaksi Terbaru</h3>
              <p className="text-[10px] text-gray-400 mt-0.5">Pergerakan kas klinik hari ini</p>
            </div>

            <div className="overflow-x-auto pt-2">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="text-gray-400 border-b border-gray-100 font-semibold uppercase text-[10px] tracking-wider">
                    <th className="pb-3 font-semibold">TRANSAKSI</th>
                    <th className="pb-3 font-semibold">TANGGAL</th>
                    <th className="pb-3 font-semibold">KATEGORI</th>
                    <th className="pb-3 font-semibold text-right">JUMLAH</th>
                    <th className="pb-3 font-semibold text-right w-28"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {/* Restock Kapas -> Ke Pengeluaran */}
                  <tr className="hover:bg-gray-50/50 transition cursor-pointer group">
                    <td className="py-4">
                      <Link href="/Admin/pengeluaran" className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-[#FDF2F0] text-[#B07D70] flex items-center justify-center shrink-0">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M17 7H8M17 7V16" />
                          </svg>
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 group-hover:text-teal-600 transition whitespace-nowrap">
                            Restock Kapas & Sarung Tangan
                          </p>
                          <p className="text-[10px] text-gray-400 font-medium">KAS-002</p>
                        </div>
                      </Link>
                    </td>
                    <td className="py-4 text-gray-400 font-medium whitespace-nowrap">
                      <Link href="/Admin/pengeluaran" className="block">16 Sep 2026</Link>
                    </td>
                    <td className="py-4 text-gray-500 font-medium whitespace-nowrap">
                      <Link href="/Admin/pengeluaran" className="block">Clinic supplies</Link>
                    </td>
                    <td className="py-4 text-right font-bold text-[#B07D70] whitespace-nowrap">
                      <Link href="/Admin/pengeluaran" className="block">-Rp 250.000</Link>
                    </td>
                    <td className="py-4 text-right pl-3">
                      <Link href="/Admin/pengeluaran" className="inline-block">
                        <span className="px-3 py-1 bg-[#E6F8F3] text-[#25A99D] rounded-full text-[10px] font-bold flex items-center justify-center gap-1 whitespace-nowrap shrink-0">
                          ✓ Completed
                        </span>
                      </Link>
                    </td>
                  </tr>

                  {/* Pembayaran Rina -> Ke Pembayaran */}
                  <tr className="hover:bg-gray-50/50 transition cursor-pointer group">
                    <td className="py-4">
                      <Link href="/Admin/pembayaran" className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-[#EBF7F6] text-[#25A99D] flex items-center justify-center shrink-0">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17 7L7 17M7 17H16M7 17V8" />
                          </svg>
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 group-hover:text-teal-600 transition whitespace-nowrap">
                            Pembayaran Rina Kartika
                          </p>
                          <p className="text-[10px] text-gray-400 font-medium">KAS-001</p>
                        </div>
                      </Link>
                    </td>
                    <td className="py-4 text-gray-400 font-medium whitespace-nowrap">
                      <Link href="/Admin/pembayaran" className="block">16 Sep 2026</Link>
                    </td>
                    <td className="py-4 text-gray-500 font-medium whitespace-nowrap">
                      <Link href="/Admin/pembayaran" className="block">Treatment income</Link>
                    </td>
                    <td className="py-4 text-right font-bold text-[#25A99D] whitespace-nowrap">
                      <Link href="/Admin/pembayaran" className="block">+Rp 395.000</Link>
                    </td>
                    <td className="py-4 text-right pl-3">
                      <Link href="/Admin/pembayaran" className="inline-block">
                        <span className="px-3 py-1 bg-[#E6F8F3] text-[#25A99D] rounded-full text-[10px] font-bold flex items-center justify-center gap-1 whitespace-nowrap shrink-0">
                          ✓ Completed
                        </span>
                      </Link>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* SISI KANAN (4 KOLOM) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Profit Composition */}
          <div className="p-6 bg-white rounded-3xl border border-gray-100 shadow-sm space-y-5">
            <div>
              <h3 className="text-sm font-bold text-gray-900">Profit Composition</h3>
              <p className="text-[10px] text-gray-400 mt-0.5">September 2026</p>
            </div>

            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase">Net profit</p>
              <div className="flex items-center justify-between mt-0.5">
                <p className="text-lg font-bold text-gray-900">Rp 53.400.000</p>
                <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-bold border border-emerald-100">
                  ✓ ON TRACK
                </span>
              </div>
            </div>

            <div className="space-y-4 pt-1">
              <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span className="text-gray-700 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-teal-500" /> General Dentistry
                  </span>
                  <span className="text-gray-900">48%</span>
                </div>
                <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-teal-500 rounded-full w-[48%]" />
                </div>
                <p className="text-[10px] text-gray-400 mt-1">Rp 25.6M</p>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span className="text-gray-700 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#B07D70]" /> Cosmetic Treatment
                  </span>
                  <span className="text-gray-900">32%</span>
                </div>
                <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-[#B07D70] rounded-full w-[32%]" />
                </div>
                <p className="text-[10px] text-gray-400 mt-1">Rp 17.1M</p>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span className="text-gray-700 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-gray-500" /> Other Services
                  </span>
                  <span className="text-gray-900">20%</span>
                </div>
                <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-gray-500 rounded-full w-[20%]" />
                </div>
                <p className="text-[10px] text-gray-400 mt-1">Rp 10.7M</p>
              </div>
            </div>
          </div>

          {/* Reconciliation Card */}
          <div className="p-6 bg-[#161922] text-white rounded-3xl space-y-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-teal-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M3 6l9-3 9 3m-18 6h18M5 12l-2 5h4l-2-5zm14 0l-2 5h4l-2-5zM12 3v18" /></svg>
                <span>Reconciliation</span>
              </div>
              <span className="px-2.5 py-0.5 bg-teal-500/20 border border-teal-500/30 text-teal-400 rounded-full text-[10px] font-bold uppercase">
                ✓ ON TRACK
              </span>
            </div>

            <div>
              <p className="text-[10px] text-white/40 uppercase font-bold">SEPTEMBER 2026</p>
              <p className="text-2xl font-bold mt-0.5">Rp 78.650.000</p>
              <p className="text-[10px] text-white/50 mt-1">98.7% transaksi cocok</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-white/5 border border-white/5 rounded-2xl">
                <p className="text-lg font-bold text-white">124</p>
                <p className="text-[10px] text-white/40">Matched</p>
              </div>
              <div className="p-3 bg-white/5 border border-white/5 rounded-2xl">
                <p className="text-lg font-bold text-amber-400">3</p>
                <p className="text-[10px] text-white/40">Need review</p>
              </div>
            </div>

            <Link
              href="/Admin/rekonsiliasi"
              className="w-full py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 border border-white/10"
            >
              <span>Review reconciliation</span>
              <span>→</span>
            </Link>
          </div>

          {/* Antrean Hari Ini */}
          <div className="p-6 bg-white rounded-3xl border border-gray-100 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-gray-900">Antrean Hari Ini</h3>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 bg-teal-50/40 rounded-2xl border border-teal-100/40 text-center">
                <p className="text-xl font-bold text-teal-600">6</p>
                <p className="text-[10px] font-medium text-gray-400">Total</p>
              </div>

              <div className="p-4 bg-amber-50/40 rounded-2xl border border-amber-100/40 text-center">
                <p className="text-xl font-bold text-amber-500">3</p>
                <p className="text-[10px] font-medium text-gray-400">Pending</p>
              </div>

              <div className="p-4 bg-blue-50/40 rounded-2xl border border-blue-100/40 text-center">
                <p className="text-xl font-bold text-blue-600">1</p>
                <p className="text-[10px] font-medium text-gray-400">Proses</p>
              </div>

              <div className="p-4 bg-emerald-50/40 rounded-2xl border border-emerald-100/40 text-center">
                <p className="text-xl font-bold text-emerald-600">2</p>
                <p className="text-[10px] font-medium text-gray-400">Selesai</p>
              </div>
            </div>

            <Link
              href="/Admin/antrean"
              className="w-full py-3 bg-[#EAF7FB] hover:bg-[#E2F3F8] text-[#25A99D] rounded-2xl text-xs font-bold transition block text-center border border-teal-100/50"
            >
              Kelola Antrean ›
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}