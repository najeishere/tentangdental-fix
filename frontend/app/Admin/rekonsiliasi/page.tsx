// app/Admin/rekonsiliasi/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function RekonsiliasiAdmin() {
  const router = useRouter();
  const [tanggalHariIni, setTanggalHariIni] = useState('29 September 2026');
  const [namaAdmin, setNamaAdmin] = useState('Nadia A.');
  const [jabatanAdmin, setJabatanAdmin] = useState('Admin');

  // State navigasi detail alokasi
  const [activeDetail, setActiveDetail] = useState<string | null>(null);

  const totalKasMasuk = 85400000;
  const totalAlokasi = 76500000;
  const labaBersih = 8900000;

  // Data Rincian Lengkap untuk SETIAP Sub Bab
  const detailData: Record<string, { title: string; desc: string; color: string; totalAlokasi: string; totalRealisasiNum: number; items: { no: number; nama: string; ket: string; tgl: string; jumlah: string; rawJumlah: number }[] }> = {
    'Beban BMHP': {
      title: 'Beban BMHP',
      desc: 'Restock bahan dental',
      color: 'bg-[#B4846C]',
      totalAlokasi: 'Rp 12.750.000',
      totalRealisasiNum: 11500000,
      items: [
        { no: 1, nama: 'Polishing Paste', ket: 'Tube 100g × 20 pcs', tgl: '03 Sep 2026', jumlah: 'Rp 1.800.000', rawJumlah: 1800000 },
        { no: 2, nama: 'Sarung Tangan Latex M', ket: 'Box 100 × 8 box', tgl: '03 Sep 2026', jumlah: 'Rp 1.600.000', rawJumlah: 1600000 },
        { no: 3, nama: 'Sarung Tangan Latex S', ket: 'Box 100 × 4 box', tgl: '03 Sep 2026', jumlah: 'Rp 800.000', rawJumlah: 800000 },
        { no: 4, nama: 'Masker Medis 3-ply', ket: 'Box 50 × 10 box', tgl: '05 Sep 2026', jumlah: 'Rp 750.000', rawJumlah: 750000 },
        { no: 5, nama: 'Kapas Gulungan', ket: '250g × 12 rol', tgl: '05 Sep 2026', jumlah: 'Rp 420.000', rawJumlah: 420000 },
        { no: 6, nama: 'Jarum Suntik Dental', ket: 'Pcs × 200 pcs', tgl: '10 Sep 2026', jumlah: 'Rp 1.000.000', rawJumlah: 1000000 },
        { no: 7, nama: 'Dental Bibs', ket: 'Pack × 10 pack', tgl: '12 Sep 2026', jumlah: 'Rp 450.000', rawJumlah: 450000 },
        { no: 8, nama: 'Eugenol Liquid', ket: 'Botol 15ml', tgl: '15 Sep 2026', jumlah: 'Rp 350.000', rawJumlah: 350000 },
        { no: 9, nama: 'Glass Ionomer Cement', ket: 'Set restorasi gigi', tgl: '18 Sep 2026', jumlah: 'Rp 2.100.000', rawJumlah: 2100000 },
        { no: 10, nama: 'Composite Resin', ket: 'Syringe 4g', tgl: '20 Sep 2026', jumlah: 'Rp 1.480.000', rawJumlah: 1480000 },
        { no: 11, nama: 'Etching Gel', ket: 'Syringe 3ml', tgl: '22 Sep 2026', jumlah: 'Rp 250.000', rawJumlah: 250000 },
        { no: 12, nama: 'Boning Agent', ket: 'Botol 5ml', tgl: '25 Sep 2026', jumlah: 'Rp 1.250.000', rawJumlah: 1250000 },
      ]
    },
    'Biaya Lab': {
      title: 'Biaya Lab',
      desc: 'Bayar tagihan vendor lab',
      color: 'bg-purple-600',
      totalAlokasi: 'Rp 15.300.000',
      totalRealisasiNum: 15300000,
      items: [
        { no: 1, nama: 'Behel Metal Pasien', ket: 'INV-LAB-091', tgl: '02 Sep 2026', jumlah: 'Rp 1.200.000', rawJumlah: 1200000 },
        { no: 2, nama: 'Crown Porcelain (PFM)', ket: 'INV-LAB-087', tgl: '05 Sep 2026', jumlah: 'Rp 2.800.000', rawJumlah: 2800000 },
        { no: 3, nama: 'Gigi Tiruan Lepasan', ket: 'INV-LAB-088', tgl: '08 Sep 2026', jumlah: 'Rp 1.750.000', rawJumlah: 1750000 },
        { no: 4, nama: 'Study Model + Artikulasi', ket: 'INV-LAB-092', tgl: '10 Sep 2026', jumlah: 'Rp 450.000', rawJumlah: 450000 },
        { no: 5, nama: 'Bleaching Tray Custom', ket: 'INV-LAB-093', tgl: '12 Sep 2026', jumlah: 'Rp 600.000', rawJumlah: 600000 },
        { no: 6, nama: 'Inlay / Onlay Porcelain', ket: 'INV-LAB-095', tgl: '15 Sep 2026', jumlah: 'Rp 3.200.000', rawJumlah: 3200000 },
        { no: 7, nama: 'Night Guard / Retainer', ket: 'INV-LAB-096', tgl: '18 Sep 2026', jumlah: 'Rp 1.500.000', rawJumlah: 1500000 },
        { no: 8, nama: 'Bridge Porcelain 3 Unit', ket: 'INV-LAB-098', tgl: '20 Sep 2026', jumlah: 'Rp 3.800.000', rawJumlah: 3800000 },
      ]
    },
    'Bagi Hasil Dokter': {
      title: 'Bagi Hasil Dokter',
      desc: 'Jasa medis dokter gigi',
      color: 'bg-[#2EC4B6]',
      totalAlokasi: 'Rp 29.750.000',
      totalRealisasiNum: 29750000,
      items: [
        { no: 1, nama: 'drg. Sari Dewi', ket: 'Scaling & Polishing × 18 pasien', tgl: '30 Sep 2026', jumlah: 'Rp 12.600.000', rawJumlah: 12600000 },
        { no: 2, nama: 'drg. Sari Dewi', ket: 'Tambal Komposit × 9 pasien', tgl: '30 Sep 2026', jumlah: 'Rp 5.400.000', rawJumlah: 5400000 },
        { no: 3, nama: 'drg. Sari Dewi', ket: 'Konsultasi & Pemeriksaan × 12 pasien', tgl: '30 Sep 2026', jumlah: 'Rp 2.400.000', rawJumlah: 2400000 },
        { no: 4, nama: 'drg. Hendra K.', ket: 'Pemasangan Behel Baru × 3 pasien', tgl: '30 Sep 2026', jumlah: 'Rp 4.200.000', rawJumlah: 4200000 },
        { no: 5, nama: 'drg. Hendra K.', ket: 'Pencabutan Gigi Bedah × 5 pasien', tgl: '30 Sep 2026', jumlah: 'Rp 3.150.000', rawJumlah: 3150000 },
        { no: 6, nama: 'drg. Hendra K.', ket: 'Kontrol & Adjust Ortho × 7 pasien', tgl: '30 Sep 2026', jumlah: 'Rp 2.000.000', rawJumlah: 2000000 },
      ]
    },
    'Bagi Hasil Perawat': {
      title: 'Bagi Hasil Perawat',
      desc: 'Jasa perawat asisten',
      color: 'bg-teal-400',
      totalAlokasi: 'Rp 4.250.000',
      totalRealisasiNum: 4250000,
      items: [
        { no: 1, nama: 'Rina (Perawat)', ket: 'Asistensi Scaling & Polishing × 18 tindakan', tgl: '30 Sep 2026', jumlah: 'Rp 1.800.000', rawJumlah: 1800000 },
        { no: 2, nama: 'Rina (Perawat)', ket: 'Asistensi Tambal Komposit × 9 tindakan', tgl: '30 Sep 2026', jumlah: 'Rp 900.000', rawJumlah: 900000 },
        { no: 3, nama: 'Rina (Perawat)', ket: 'Asistensi Pemasangan Behel × 3 tindakan', tgl: '30 Sep 2026', jumlah: 'Rp 750.000', rawJumlah: 750000 },
        { no: 4, nama: 'Dewi (Perawat)', ket: 'Sterilisasi Alat & Persiapan Klinik', tgl: '30 Sep 2026', jumlah: 'Rp 800.000', rawJumlah: 800000 },
      ]
    },
    'Gaji Staf': {
      title: 'Gaji Staf',
      desc: 'Resepsionis & admin',
      color: 'bg-blue-500',
      totalAlokasi: 'Rp 8.500.000',
      totalRealisasiNum: 8500000,
      items: [
        { no: 1, nama: 'Nadia A.', ket: 'Finance Admin — Gaji Pokok', tgl: '28 Sep 2026', jumlah: 'Rp 3.500.000', rawJumlah: 3500000 },
        { no: 2, nama: 'Dani Setiawan', ket: 'Resepsionis — Gaji Pokok', tgl: '28 Sep 2026', jumlah: 'Rp 2.800.000', rawJumlah: 2800000 },
        { no: 3, nama: 'Nadia A.', ket: 'Finance Admin — Tunjangan Transport', tgl: '28 Sep 2026', jumlah: 'Rp 300.000', rawJumlah: 300000 },
        { no: 4, nama: 'Dani Setiawan', ket: 'Resepsionis — Tunjangan Transport', tgl: '28 Sep 2026', jumlah: 'Rp 300.000', rawJumlah: 300000 },
        { no: 5, nama: 'Nadia A.', ket: 'Finance Admin — Tunjangan Makan', tgl: '28 Sep 2026', jumlah: 'Rp 600.000', rawJumlah: 600000 },
        { no: 6, nama: 'Dani Setiawan', ket: 'Resepsionis — Tunjangan Makan', tgl: '28 Sep 2026', jumlah: 'Rp 600.000', rawJumlah: 600000 },
        { no: 7, nama: 'Tim Kebersihan', ket: 'Jasa Cleaning Service Bulanan', tgl: '28 Sep 2026', jumlah: 'Rp 400.000', rawJumlah: 400000 },
      ]
    },
    'Utilitas': {
      title: 'Utilitas',
      desc: 'Listrik, air, internet',
      color: 'bg-amber-500',
      totalAlokasi: 'Rp 3.400.000',
      totalRealisasiNum: 3400000,
      items: [
        { no: 1, nama: 'PLN — Listrik', ket: 'Daya 13.200 VA — No. Pel. 512340001', tgl: '05 Sep 2026', jumlah: 'Rp 1.850.000', rawJumlah: 1850000 },
        { no: 2, nama: 'PDAM — Air', ket: 'Penggunaan 28 m³ — No. Pel. 89210', tgl: '05 Sep 2026', jumlah: 'Rp 420.000', rawJumlah: 420000 },
        { no: 3, nama: 'Biznet — Internet', ket: 'Paket 100 Mbps dedicated — Inv. BN-Sep', tgl: '03 Sep 2026', jumlah: 'Rp 850.000', rawJumlah: 850000 },
        { no: 4, nama: 'Telkom — Telepon', ket: 'Line PSTN klinik + pulsa bisnis', tgl: '07 Sep 2026', jumlah: 'Rp 280.000', rawJumlah: 280000 },
      ]
    },
    'Maintenance Alat': {
      title: 'Maintenance Alat',
      desc: 'Autoclave, dental chair service',
      color: 'bg-rose-500',
      totalAlokasi: 'Rp 2.550.000',
      totalRealisasiNum: 2550000,
      items: [
        { no: 1, nama: 'Autoclave Tuttnauer', ket: 'Servis berkala + penggantian gasket', tgl: '08 Sep 2026', jumlah: 'Rp 850.000', rawJumlah: 850000 },
        { no: 2, nama: 'Dental Chair Unit #1', ket: 'Kalibrasi & pelumasan hidrolik', tgl: '10 Sep 2026', jumlah: 'Rp 600.000', rawJumlah: 600000 },
        { no: 3, nama: 'Dental Chair Unit #2', ket: 'Penggantian headrest cover + servis pompa', tgl: '10 Sep 2026', jumlah: 'Rp 450.000', rawJumlah: 450000 },
        { no: 4, nama: 'X-Ray Dental (Intraoral)', ket: 'Kalibrasi dosis + pemeriksaan kondisi sensor', tgl: '15 Sep 2026', jumlah: 'Rp 400.000', rawJumlah: 400000 },
        { no: 5, nama: 'Kompresor Udara', ket: 'Pembersihan filter + cek tekanan', tgl: '22 Sep 2026', jumlah: 'Rp 250.000', rawJumlah: 250000 },
      ]
    }
  };

  useEffect(() => {
    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' };
    const todayStr = new Date().toLocaleDateString('id-ID', options);
    setTanggalHariIni(todayStr);
    const savedNama = localStorage.getItem('adminNama');
    const savedJabatan = localStorage.getItem('adminJabatan');
    if (savedNama) setNamaAdmin(savedNama);
    if (savedJabatan) setJabatanAdmin(savedJabatan);
  }, []);

  const currentDetail = activeDetail ? detailData[activeDetail] : null;

  return (
    <div className="min-h-screen bg-[#F4F5F7] flex font-sans text-slate-800 w-full relative">
      
      {/* SIDEBAR KIRI */}
      <aside className="w-64 bg-[#1A1D2E] text-white flex flex-col justify-between shrink-0 h-screen sticky top-0 overflow-y-auto">
        <div>
          <div className="px-6 py-4 border-b border-white/10 flex items-center gap-3">
            <div className="w-9 h-9 bg-white rounded-xl flex items-center justify-center overflow-hidden shadow-sm">
              <Image src="/logo.png" alt="Logo" width={36} height={36} className="object-contain" />
            </div>
            <div>
              <h2 className="text-sm font-bold tracking-wide">TentangDental</h2>
              <p className="text-xs text-[#2EC4B6]">Finance Admin</p>
            </div>
          </div>

          <div className="p-3 space-y-4 text-xs">
            <div>
              <p className="text-[10px] font-bold text-slate-400 tracking-wider uppercase px-3 mb-1.5">Overview</p>
              <Link href="/Admin/dashboard" className="px-3 py-2 rounded-xl text-slate-300 hover:bg-white/5 hover:text-white cursor-pointer transition flex items-center gap-3">
                <svg className="w-4 h-4 opacity-70" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/></svg>
                Dashboard
              </Link>
            </div>

            <div>
              <p className="text-[10px] font-bold text-slate-400 tracking-wider uppercase px-3 mb-1.5">Operasional</p>
              <div className="space-y-0.5 text-slate-300">
                <Link href="/Admin/manajemen-antrean" className="px-3 py-2 rounded-xl hover:bg-white/5 hover:text-white cursor-pointer transition flex items-center gap-3">
                  <svg className="w-4 h-4 opacity-70" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
                  Manajemen Antrean
                </Link>
                <Link href="/Admin/pencatatan-tagihan" className="px-3 py-2 rounded-xl hover:bg-white/5 hover:text-white cursor-pointer transition flex items-center gap-3">
                  <svg className="w-4 h-4 opacity-70" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"/></svg>
                  Pencatatan Tagihan
                </Link>
                <Link href="/Admin/pembayaran" className="px-3 py-2 rounded-xl hover:bg-white/5 hover:text-white cursor-pointer transition flex items-center gap-3">
                  <svg className="w-4 h-4 opacity-70" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/></svg>
                  Pembayaran
                </Link>
                {[
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
                <div className="px-3 py-2 bg-[#2EC4B6] text-white font-medium rounded-xl flex items-center gap-3 shadow-sm cursor-pointer">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"/></svg>
                  Rekonsiliasi
                </div>
                <Link href="/Admin/laporan-keuangan" className="px-3 py-2 rounded-xl hover:bg-white/5 hover:text-white cursor-pointer transition flex items-center gap-3">
                  <svg className="w-4 h-4 opacity-70" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>
                  Laporan Keuangan
                </Link>
               </div>
            </div>

            <div>
              <p className="text-[10px] font-bold text-slate-400 tracking-wider uppercase px-3 mb-1.5">Data & Sistem</p>
              <div className="space-y-0.5 text-slate-300">
                {[
                    { name: 'Data Pasien', path: '/Admin/data-pasien', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' },
                    { name: 'Data Tindakan', path: '/Admin/data-tindakan', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4' },
                    { name: 'Pengaturan', path: '/Admin/pengaturan', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065zM15 12a3 3 0 11-6 0 3 3 0 016 0z' }
                ].map((menu, i) => (
                    <Link key={i} href={menu.path} className="px-3 py-2 rounded-xl hover:bg-white/5 hover:text-white cursor-pointer transition flex items-center gap-3">
                        <svg className="w-4 h-4 opacity-70" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d={menu.icon}/></svg>
                        {menu.name}
                    </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

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
            <h1 className="text-base font-bold text-slate-900">Rekonsiliasi Keuangan</h1>
            <p className="text-[11px] text-slate-500">Alokasi kas masuk ke pengeluaran</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-600 flex items-center gap-2">
              <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
              {tanggalHariIni}
            </div>

            <button className="w-9 h-9 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-center relative hover:bg-slate-100 transition text-slate-600">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>
              <span className="w-2 h-2 bg-rose-500 rounded-full absolute top-2 right-2"></span>
            </button>

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

        {/* Isi Halaman */}
        <main className="p-6 space-y-6 overflow-y-auto">
          
          <div className="px-4 py-3 bg-amber-50 border border-amber-100 text-amber-700 rounded-xl text-[11px] font-semibold">
            Data contoh — halaman ini belum terhubung backend (belum ada endpoint anggaran/alokasi kas).
          </div>

          {currentDetail ? (
            /* HALAMAN DETAIL KATEGORI ALOKASI */
            <div className="space-y-6">
              <button 
                onClick={() => setActiveDetail(null)}
                className="text-xs font-bold text-[#2EC4B6] hover:underline flex items-center gap-1.5"
              >
                ← Kembali ke Rekonsiliasi
              </button>

              {/* Kartu Header Detail */}
              <div className={`${currentDetail.color} text-white p-8 rounded-3xl shadow-sm space-y-6 relative overflow-hidden`}>
                <div className="flex justify-between items-start relative z-10">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center text-xl">📋</div>
                    <div>
                      <h2 className="text-lg font-bold">{currentDetail.title}</h2>
                      <p className="text-xs text-white/80">{currentDetail.desc}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] uppercase tracking-wider text-white/80">Alokasi Bulan Ini</p>
                    <p className="text-2xl font-bold">{currentDetail.totalAlokasi}</p>
                  </div>
                </div>
              </div>

              {/* Tiga Kartu Ringkasan Detail */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-1">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Alokasi</p>
                  <p className="text-lg font-bold text-slate-900">{currentDetail.totalAlokasi}</p>
                  <p className="text-[10px] text-slate-400">Ditetapkan</p>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-1">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Realisasi</p>
                  <p className="text-lg font-bold text-slate-900">Rp {currentDetail.totalRealisasiNum.toLocaleString('id-ID')}</p>
                  <p className="text-[10px] text-slate-400">{currentDetail.items.length} transaksi</p>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-1">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Selisih</p>
                  <p className="text-lg font-bold text-[#2EC4B6]">Rp 0</p>
                  <p className="text-[10px] text-slate-400">Sisa Anggaran</p>
                </div>
              </div>

              {/* Rincian Transaksi */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
                <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Rincian Transaksi — {currentDetail.title}</h3>
                  <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-[10px] font-bold">{currentDetail.items.length} item</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="text-slate-400 border-b border-slate-100">
                        <th className="pb-3 font-semibold w-10">#</th>
                        <th className="pb-3 font-semibold">Nama / Deskripsi</th>
                        <th className="pb-3 font-semibold">Keterangan</th>
                        <th className="pb-3 font-semibold">Tanggal</th>
                        <th className="pb-3 font-semibold text-right">Jumlah</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      {currentDetail.items.map((item) => (
                        <tr key={item.no} className="hover:bg-slate-50 transition">
                          <td className="py-3.5 font-bold text-slate-400">
                            <span className="w-6 h-6 bg-slate-100 rounded-full inline-flex items-center justify-center text-[10px]">{item.no}</span>
                          </td>
                          <td className="py-3.5 font-bold text-slate-900">{item.nama}</td>
                          <td className="py-3.5 text-slate-600">{item.ket}</td>
                          <td className="py-3.5 text-slate-500">{item.tgl}</td>
                          <td className="py-3.5 font-bold text-right text-slate-900">{item.jumlah}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* GRAND TOTAL DI BAGIAN BAWAH TABEL DETAIL */}
                <div className="pt-4 border-t border-slate-200 flex justify-between items-center bg-slate-50 px-4 py-3 rounded-xl">
                  <span className="text-xs font-bold text-slate-900 uppercase">Total Keseluruhan (Grand Total)</span>
                  <span className="text-sm font-bold text-[#2EC4B6]">Rp {currentDetail.totalRealisasiNum.toLocaleString('id-ID')}</span>
                </div>

              </div>
            </div>
          ) : (
            /* HALAMAN UTAMA REKONSILIASI */
            <>
              {/* KARTU RINGKASAN TIGA ATAS */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-1">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#2EC4B6]"></span> Total Kas Masuk
                  </p>
                  <p className="text-2xl font-bold text-[#2EC4B6]">Rp {totalKasMasuk.toLocaleString('id-ID')}</p>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-1">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-500"></span> Total Alokasi
                  </p>
                  <p className="text-2xl font-bold text-amber-600">Rp {totalAlokasi.toLocaleString('id-ID')}</p>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-1">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Laba Bersih
                  </p>
                  <p className="text-2xl font-bold text-emerald-600">Rp {labaBersih.toLocaleString('id-ID')}</p>
                </div>
              </div>

              {/* TABEL UTAMA ALOKASI KAS */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-6">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Alokasi Kas — September 2026</h3>

                <div className="space-y-4">
                  {[
                    { name: 'Beban BMHP', desc: 'Restock bahan dental', nominal: 'Rp 12.750.000', pct: '15%', barColor: 'bg-[#B4846C]', w: 'w-[15%]' },
                    { name: 'Biaya Lab', desc: 'Bayar tagihan vendor lab', nominal: 'Rp 15.300.000', pct: '18%', barColor: 'bg-purple-600', w: 'w-[18%]' },
                    { name: 'Bagi Hasil Dokter', desc: 'Jasa medis dokter gigi', nominal: 'Rp 29.750.000', pct: '35%', barColor: 'bg-[#2EC4B6]', w: 'w-[35%]' },
                    { name: 'Bagi Hasil Perawat', desc: 'Jasa perawat asisten', nominal: 'Rp 4.250.000', pct: '5%', barColor: 'bg-teal-400', w: 'w-[5%]' },
                    { name: 'Gaji Staf', desc: 'Resepsionis & admin', nominal: 'Rp 8.500.000', pct: '10%', barColor: 'bg-blue-500', w: 'w-[10%]' },
                    { name: 'Utilitas', desc: 'Listrik, air, internet', nominal: 'Rp 3.400.000', pct: '4%', barColor: 'bg-amber-500', w: 'w-[4%]' },
                    { name: 'Maintenance Alat', desc: 'Autoclave, dental chair service', nominal: 'Rp 2.550.000', pct: '3%', barColor: 'bg-rose-500', w: 'w-[3%]' },
                  ].map((item, idx) => (
                    <div key={idx} className="p-4 bg-slate-50/50 hover:bg-slate-50 rounded-2xl transition border border-slate-100 space-y-3">
                      <div className="flex justify-between items-center">
                        <div className="space-y-0.5">
                          <p className="text-xs font-bold text-slate-900">{item.name}</p>
                          <p className="text-[10px] text-slate-400">{item.desc}</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="text-xs font-bold text-slate-900">{item.nominal}</p>
                            <p className="text-[10px] text-slate-400">{item.pct}</p>
                          </div>
                          <button 
                            onClick={() => setActiveDetail(item.name)}
                            className="px-4 py-2 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-xl text-xs font-bold transition shadow-sm"
                          >
                            Detail ›
                          </button>
                        </div>
                      </div>
                      <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                        <div className={`${item.barColor} h-full ${item.w}`}></div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Footer Laba & Tombol Aksi */}
                <div className="pt-4 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4">
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Laba Bersih</p>
                    <p className="text-lg font-bold text-emerald-600">Rp {labaBersih.toLocaleString('id-ID')}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button onClick={() => alert('Alokasi berhasil disimpan!')} className="px-6 py-3 bg-[#2EC4B6] hover:bg-[#259f93] text-white rounded-xl text-xs font-bold transition shadow-sm">
                      Simpan Alokasi
                    </button>
                    <button onClick={() => alert('Export Jurnal PDF/Excel')} className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition">
                      Export Jurnal
                    </button>
                  </div>
                </div>

              </div>
            </>
          )}

        </main>
      </div>
    </div>
  );
}