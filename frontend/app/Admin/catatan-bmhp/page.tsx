// app/Admin/bmhp/page.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function CatatanBmhpPage() {
  const router = useRouter();

  // Tanggal otomatis untuk header
  const today = new Date();
  const formattedHeaderDate = today.toLocaleDateString('id-ID', { 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric' 
  });

  // State daftar item BMHP dengan kuantitas masing-masing
  const [items, setItems] = useState([
    { id: 'B001', name: 'Kapas Pellet', desc: 'Stok: 500 buah · Rp 200/buah', price: 200, qty: 1 },
    { id: 'B002', name: 'Komposit Nanofill (per syringe)', desc: 'Stok: 12 unit · Rp 125.000/unit', price: 125000, qty: 1 },
    { id: 'B003', name: 'Bonding Agent (per ml)', desc: 'Stok: 30 ml · Rp 15.000/ml', price: 15000, qty: 1 },
    { id: 'B004', name: 'Anastesi Lidocaine 2%', desc: 'Stok: 45 ampul · Rp 8.500/ampul', price: 8500, qty: 1 },
    { id: 'B005', name: 'Polishing Paste', desc: 'Stok: 200 gram · Rp 2.500/gram', price: 2500, qty: 1 },
    { id: 'B006', name: 'Sarung Tangan Latex S', desc: 'Stok: 80 pasang · Rp 1.500/pasang', price: 1500, qty: 1 },
  ]);

  // Fungsi mengubah kuantitas (tambah / kurang)
  const handleUpdateQty = (id: string, delta: number) => {
    setItems(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(0, item.qty + delta);
        return { ...item, qty: newQty };
      }
      return item;
    }));
  };

  // Hitung total harga keseluruhan BMHP sesi ini
  const totalBmhp = items.reduce((sum, item) => sum + (item.price * item.qty), 0);

  const handleSimpanBilling = () => {
    alert(`Berhasil! Total Rp ${totalBmhp.toLocaleString('id-ID')} ditambahkan ke billing.`);
    // Mengarahkan ke halaman Pencatatan Tagihan
    router.push('/Admin/pencatatan-tagihan');
  };

  return (
    <div className="min-h-screen bg-[#F4F5F7] flex font-sans text-slate-800">
      
      {/* SIDEBAR */}
      <aside className="w-64 bg-[#1E293B] text-slate-300 flex flex-col justify-between hidden lg:flex select-none">
        <div>
          <div className="p-6 flex items-center gap-3 border-b border-slate-800">
            <div className="w-9 h-9 bg-[#2EC4B6] rounded-xl flex items-center justify-center text-white font-bold text-base shadow-sm">
              TD
            </div>
            <div>
              <h2 className="text-sm font-bold text-white tracking-wide">TentangDental</h2>
              <p className="text-[11px] text-[#2EC4B6]">Finance Admin</p>
            </div>
          </div>

          <div className="p-4 space-y-6 text-xs">
            <div className="space-y-1">
              <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">Overview</p>
              <Link href="/Admin/dashboard" className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-800/60 transition text-slate-400 hover:text-white">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
                Dashboard
              </Link>
            </div>

            <div className="space-y-1">
              <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">Operasional</p>
              <Link href="/Admin/antrean" className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-800/60 transition text-slate-400 hover:text-white">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                Manajemen Antrean
              </Link>
              <Link href="/Admin/pencatatan-tagihan" className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-800/60 transition text-slate-400 hover:text-white">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
                Pencatatan Tagihan
              </Link>
              <Link href="/Admin/pembayaran" className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-800/60 transition text-slate-400 hover:text-white">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
                Pembayaran
              </Link>
              <Link href="/Admin/pengiriman-lab" className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-800/60 transition text-slate-400 hover:text-white">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M10 2v7.31M14 9.31V2M8.5 2h7M14 22v-4.19M10 17.81V22M9.5 22h5M5 14h14M4 10h16"/></svg>
                Pengiriman Lab
              </Link>
              <Link href="/Admin/bmhp" className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-[#2EC4B6] text-white font-medium shadow-sm">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>
                Catatan BMHP
              </Link>
            </div>

            <div className="space-y-1">
              <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">Keuangan</p>
              <Link href="/Admin/rekonsiliasi" className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-800/60 transition text-slate-400 hover:text-white">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg>
                Rekonsiliasi
              </Link>
              <Link href="/Admin/laporan" className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-800/60 transition text-slate-400 hover:text-white">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
                Laporan Keuangan
              </Link>
            </div>

            <div className="space-y-1">
              <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">Data</p>
              <Link href="/Admin/pasien" className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-800/60 transition text-slate-400 hover:text-white">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                Data Pasien
              </Link>
              <Link href="/Admin/tindakans" className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-800/60 transition text-slate-400 hover:text-white">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
                Data Tindakan
              </Link>
            </div>

            <div className="space-y-1">
              <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">Sistem</p>
              <Link href="/Admin/pengaturan" className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-800/60 transition text-slate-400 hover:text-white">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
                Pengaturan
              </Link>
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-slate-800">
          <Link href="/Admin/login" className="flex items-center gap-3 px-3 py-2.5 text-xs text-rose-400 hover:bg-rose-500/10 rounded-xl transition font-medium">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
            Keluar
          </Link>
        </div>
      </aside>

      {/* MAIN CONTAINER */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* HEADER */}
        <header className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-20">
          <div>
            <h1 className="text-sm font-bold text-slate-900">Catatan BMHP</h1>
            <p className="text-[11px] text-slate-500">Bahan Medis Habis Pakai per tindakan</p>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl text-xs text-slate-600">
              <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
              <span>{formattedHeaderDate}</span>
            </div>
            
            <button className="relative p-2 text-slate-400 hover:text-slate-600 bg-slate-50 border border-slate-200 rounded-xl transition">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
              </svg>
            </button>

            <div className="flex items-center gap-3 pl-2 border-l border-slate-200">
              <div className="w-8 h-8 rounded-full bg-[#2EC4B6] text-white flex items-center justify-center font-bold text-xs shadow-sm">
                N
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-xs font-bold text-slate-800 leading-none">Nadia A.</p>
                <p className="text-[10px] text-slate-500 mt-0.5">Admin</p>
              </div>
            </div>
          </div>
        </header>

        {/* BODY CONTENT */}
        <main className="p-8 space-y-8 overflow-y-auto">
          
          <div className="bg-white p-8 rounded-2xl border border-slate-200/80 shadow-sm space-y-6">
            
            <div className="flex items-center gap-4 p-4 bg-slate-50 border border-slate-100 rounded-2xl">
              <div className="w-10 h-10 bg-[#2EC4B6]/10 text-[#2EC4B6] rounded-xl flex items-center justify-center font-bold">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                </svg>
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-900">Sesi: Dewi Rahayu — A-040</h3>
                <p className="text-[11px] text-slate-500">Tindakan: Gigi sensitif — 16 Sep 2026</p>
              </div>
            </div>

            <div className="divide-y divide-slate-100 border border-slate-100 rounded-2xl overflow-hidden">
              {items.map((item) => (
                <div key={item.id} className="p-4 flex items-center justify-between hover:bg-slate-50/50 transition">
                  <div className="flex items-center gap-4">
                    <span className="px-2.5 py-1 bg-slate-100 text-slate-600 font-bold text-[10px] rounded-lg">
                      {item.id}
                    </span>
                    <div>
                      <h4 className="text-xs font-bold text-slate-800">{item.name}</h4>
                      <p className="text-[11px] text-slate-400">{item.desc}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl">
                      <button 
                        onClick={() => handleUpdateQty(item.id, -1)}
                        className="text-slate-400 hover:text-slate-700 font-bold transition"
                      >
                        -
                      </button>
                      <span className="text-xs font-bold w-4 text-center">{item.qty}</span>
                      <button 
                        onClick={() => handleUpdateQty(item.id, 1)}
                        className="w-6 h-6 bg-[#2EC4B6] text-white rounded-lg flex items-center justify-center font-bold hover:bg-[#259f93] transition"
                      >
                        +
                      </button>
                    </div>

                    <div className="w-24 text-right font-bold text-xs text-slate-800">
                      Rp {(item.price * item.qty).toLocaleString('id-ID')}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <div>
                <p className="text-[11px] text-slate-400">Total BMHP sesi ini</p>
                <h3 className="text-lg font-extrabold text-slate-900">
                  Rp {totalBmhp.toLocaleString('id-ID')}
                </h3>
              </div>

              <button 
                onClick={handleSimpanBilling}
                className="px-6 py-3 bg-[#2EC4B6] hover:bg-[#259f93] text-white rounded-xl text-xs font-bold transition shadow-sm"
              >
                Simpan & Masukkan ke Billing
              </button>
            </div>

          </div>

        </main>
      </div>

    </div>
  );
}