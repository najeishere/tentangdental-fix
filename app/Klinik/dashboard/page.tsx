// app/klinik/dashboard/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function DashboardTimKlinik() {
  const router = useRouter();
  const [namaDokter, setNamaDokter] = useState('drg. Sari Dewi');
  const [tanggalHariIni, setTanggalHariIni] = useState('16 September 2026');

  useEffect(() => {
    const savedNama = localStorage.getItem('klinikNama');
    if (savedNama) setNamaDokter(savedNama);
  }, []);

  const daftarAntrean = [
    { no: 'A-038', nama: 'Rina Kartika', usia: '28 tahun', keluhan: 'Sakit gigi geraham', jam: '08:30', dokter: 'drg. Sari Dewi', status: 'Selesai' },
    { no: 'A-039', nama: 'Farhan Maulana', usia: '35 tahun', keluhan: 'Tambal gigi berlubang', jam: '09:00', dokter: 'drg. Sari Dewi', status: 'Selesai' },
    { no: 'A-040', nama: 'Dewi Rahayu', usia: '42 tahun', keluhan: 'Gigi sensitif', jam: '09:30', dokter: 'drg. Sari Dewi', status: 'Dalam Proses' },
    { no: 'A-041', nama: 'Budi Santoso', usia: '31 tahun', keluhan: 'Scaling rutin', jam: '10:00', dokter: 'drg. Hendra K.', status: 'Menunggu' },
    { no: 'A-042', nama: 'Sri Wahyuni', usia: '55 tahun', keluhan: 'Gigi goyang', jam: '10:30', dokter: 'drg. Hendra K.', status: 'Menunggu' },
    { no: 'A-043', nama: 'Reza Pratama', usia: '24 tahun', keluhan: 'Konsultasi kawat gigi', jam: '11:00', dokter: 'drg. Hendra K.', status: 'Menunggu' },
  ];

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
                Dashboard[cite: 3]
              </div>
            </div>

            <div>
              <p className="text-[10px] font-bold text-slate-400 tracking-wider uppercase px-3 mb-2">Medis</p>
              <div className="space-y-1 text-slate-300">
                <Link href="#" className="px-3 py-2.5 rounded-xl hover:bg-white/5 hover:text-white transition flex items-center gap-3">
                  Antrean Hari Ini[cite: 3]
                </Link>
                <Link href="#" className="px-3 py-2.5 rounded-xl hover:bg-white/5 hover:text-white transition flex items-center gap-3">
                  Rekam Medis[cite: 3]
                </Link>
                <Link href="#" className="px-3 py-2.5 rounded-xl hover:bg-white/5 hover:text-white transition flex items-center gap-3">
                  Input Tindakan[cite: 3]
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-white/10 space-y-4">
          <Link href="/klinik/login" className="flex items-center gap-2.5 text-xs text-slate-400 hover:text-white transition px-3 py-2 font-medium">
            Keluar[cite: 3]
          </Link>

          <div className="p-3.5 bg-[#2EC4B6]/10 rounded-2xl border border-[#2EC4B6]/20">
            <p className="text-xs font-semibold text-white mb-1">Butuh Bantuan?</p>
            <p className="text-[11px] text-slate-300 mb-2">Kunjungi panduan atau hubungi support kami[cite: 3].</p>
            <span className="text-xs font-semibold text-[#2EC4B6] cursor-pointer hover:underline">Buka pusat bantuan →[cite: 3]</span>
          </div>
        </div>
      </aside>

      {/* KONTEN UTAMA */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-20 bg-white border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-20 w-full">
          <div>
            <h1 className="text-lg font-bold text-slate-900">Dashboard</h1>
            <p className="text-xs text-slate-500">Ringkasan aktivitas klinik[cite: 3]</p>
          </div>

          <div className="flex items-center gap-4">
            <div className="px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-600">
              📅 {tanggalHariIni}[cite: 3]
            </div>

            {/* Profil Diklik ke Halaman Profil */}
            <div 
              onClick={() => router.push('/klinik/profil')}
              className="flex items-center gap-3 pl-2 pr-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl cursor-pointer transition"
            >
              <div className="w-8 h-8 bg-[#2EC4B6] rounded-full text-white font-bold text-xs flex items-center justify-center shadow-sm">
                {namaDokter.charAt(0)}
              </div>
              <div className="text-left">
                <p className="text-xs font-bold text-slate-900 leading-tight">{namaDokter}[cite: 3]</p>
                <p className="text-[10px] text-slate-400">Dokter Gigi Umum[cite: 3]</p>
              </div>
            </div>
          </div>
        </header>

        <main className="p-8 space-y-6 w-full">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Total Antrean</span>
              <div>
                <h3 className="text-2xl font-extrabold text-slate-900 mb-1">6[cite: 3]</h3>
                <p className="text-xs font-semibold text-[#2EC4B6]">Hari ini[cite: 3]</p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Selesai Ditangani</span>
              <div>
                <h3 className="text-2xl font-extrabold text-slate-900 mb-1">2 <span className="text-xs font-normal text-slate-400">dari 6</span>[cite: 3]</h3>
                <p className="text-xs font-semibold text-emerald-600">Pasien selesai</p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Dalam Proses</span>
              <div>
                <h3 className="text-2xl font-extrabold text-slate-900 mb-1">1[cite: 3]</h3>
                <p className="text-xs font-semibold text-amber-500">Sedang berjalan[cite: 3]</p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Menunggu</span>
              <div>
                <h3 className="text-2xl font-extrabold text-slate-900 mb-1">3[cite: 3]</h3>
                <p className="text-xs font-semibold text-blue-500">Belum ditangani[cite: 3]</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4 w-full">
            <h3 className="text-sm font-bold text-slate-900 pb-3 border-b border-slate-100">Antrean Hari Ini — Semua Dokter[cite: 3]</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="text-slate-400 border-b border-slate-100">
                    <th className="pb-3 font-semibold">No.</th>
                    <th className="pb-3 font-semibold">Nama Pasien</th>
                    <th className="pb-3 font-semibold">Keluhan</th>
                    <th className="pb-3 font-semibold">Jam</th>
                    <th className="pb-3 font-semibold">Dokter</th>
                    <th className="pb-3 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {daftarAntrean.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 transition">
                      <td className="py-3.5 font-bold text-[#2EC4B6]">{item.no}</td>
                      <td className="py-3.5">
                        <p className="font-bold text-slate-900">{item.nama}</p>
                        <p className="text-[11px] text-slate-400">{item.usia}</p>
                      </td>
                      <td className="py-3.5 font-medium">{item.keluhan}</td>
                      <td className="py-3.5 text-slate-500">{item.jam}</td>
                      <td className="py-3.5 font-medium">{item.dokter}</td>
                      <td className="py-3.5">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          item.status === 'Selesai' ? 'bg-emerald-100 text-emerald-700' :
                          item.status === 'Dalam Proses' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600'
                        }`}>
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}