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
      {/* MAIN CONTAINER */}
      <div className="flex-1 flex flex-col min-w-0">
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