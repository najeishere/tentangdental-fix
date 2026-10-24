// app/Klinik/input-tindakan/page.tsx
'use client';

import { useState } from 'react';

interface ItemTindakan {
  id: string;
  nama: string;
  kode: string;
  harga: number;
}

const opsiTindakanLangsung: ItemTindakan[] = [
  { id: '1', nama: 'Scaling & Polishing', kode: 'T001', harga: 350000 },
  { id: '2', nama: 'Tambal Komposit', kode: 'T002', harga: 280000 },
  { id: '3', nama: 'Pencabutan Gigi Susu', kode: 'T003', harga: 150000 },
  { id: '4', nama: 'Pencabutan Gigi Dewasa', kode: 'T004', harga: 300000 },
];

const opsiTindakanLab: ItemTindakan[] = [
  { id: '1', nama: 'Pembuatan Crown Zirconia', kode: 'L001', harga: 3500000 },
  { id: '2', nama: 'Pemasangan Behel Metal', kode: 'L002', harga: 5500000 },
  { id: '3', nama: 'Pemasangan Behel Ceramic', kode: 'L003', harga: 7500000 },
  { id: '4', nama: 'Implan Gigi (per unit)', kode: 'L004', harga: 12000000 },
];

export default function KlinikInputTindakanPage() {
  const [jenisTindakan, setJenisTindakan] = useState<'langsung' | 'lab'>('langsung');
  const [selectedTindakan, setSelectedTindakan] = useState<string[]>([]);
  const [nomorGigi, setNomorGigi] = useState('36');
  const [catatan, setCatatan] = useState('');
  
  // Toast Notification States
  const [showToasts, setShowToasts] = useState(false);

  const listAktif = jenisTindakan === 'langsung' ? opsiTindakanLangsung : opsiTindakanLab;

  const toggleSelect = (id: string) => {
    setSelectedTindakan((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleSimpan = (e: React.FormEvent) => {
    e.preventDefault();
    setShowToasts(true);
    setTimeout(() => {
      setShowToasts(false);
    }, 4000);
  };

  return (
    <div className="space-y-6 relative min-h-[calc(100vh-120px)]">
      <div className="p-8 bg-white rounded-3xl border border-gray-100 shadow-sm space-y-6">
        {/* Patient Detail Header Card */}
        <div className="p-4 bg-gray-50/60 rounded-2xl border border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900">
                Dewi Rahayu — <span className="text-[#25A99D]">A-040</span>
              </p>
              <p className="text-xs text-gray-400 mt-0.5">Keluhan: Gigi sensitif · drg. Sari Dewi</p>
            </div>
          </div>
          <span className="px-3.5 py-1.5 bg-blue-50 text-blue-600 rounded-full text-xs font-bold">
            → Dalam Proses
          </span>
        </div>

        {/* Option Tab Types */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => {
              setJenisTindakan('langsung');
              setSelectedTindakan([]);
            }}
            className={`p-5 rounded-2xl border text-left flex items-start gap-4 transition ${
              jenisTindakan === 'langsung'
                ? 'bg-teal-50/50 border-[#25A99D] ring-1 ring-[#25A99D]'
                : 'bg-white border-gray-100 hover:border-gray-200'
            }`}
          >
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${jenisTindakan === 'langsung' ? 'bg-[#25A99D] text-white' : 'bg-gray-100 text-gray-500'}`}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <div>
              <p className={`text-sm font-bold ${jenisTindakan === 'langsung' ? 'text-[#25A99D]' : 'text-gray-900'}`}>
                Tindakan Langsung
              </p>
              <p className="text-xs text-gray-400 mt-0.5">Scaling, Tambal, Cabut, dll.</p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => {
              setJenisTindakan('lab');
              setSelectedTindakan([]);
            }}
            className={`p-5 rounded-2xl border text-left flex items-start gap-4 transition ${
              jenisTindakan === 'lab'
                ? 'bg-teal-50/50 border-[#25A99D] ring-1 ring-[#25A99D]'
                : 'bg-white border-gray-100 hover:border-gray-200'
            }`}
          >
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${jenisTindakan === 'lab' ? 'bg-[#25A99D] text-white' : 'bg-gray-100 text-gray-500'}`}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L5.6 15.12a2 2 0 00-1.022.547l-1.01 1.01a2 2 0 00-.568 1.414V20a1 1 0 001 1h16a1 1 0 001-1v-1.909a2 2 0 00-.568-1.414l-1.01-1.01zM12 3a4 4 0 100 8 4 4 0 000-8z" />
              </svg>
            </div>
            <div>
              <p className={`text-sm font-bold ${jenisTindakan === 'lab' ? 'text-[#25A99D]' : 'text-gray-900'}`}>
                Tindakan + Lab Dental
              </p>
              <p className="text-xs text-gray-400 mt-0.5">Crown, Behel, Implan, dll.</p>
            </div>
          </button>
        </div>

        {/* Input Form Body */}
        <form onSubmit={handleSimpan} className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-2">
          {/* Sisi Kiri: Daftar Checkbox Tindakan */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">
              Pilih Tindakan
            </label>
            <div className="space-y-2.5">
              {listAktif.map((item) => {
                const isChecked = selectedTindakan.includes(item.id);
                return (
                  <div
                    key={item.id}
                    onClick={() => toggleSelect(item.id)}
                    className={`p-4 rounded-2xl border flex items-center justify-between cursor-pointer transition ${
                      isChecked
                        ? 'border-[#25A99D] bg-teal-50/20'
                        : 'border-gray-100 hover:border-gray-200'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {}}
                        className="w-4 h-4 text-[#25A99D] rounded border-gray-300 focus:ring-[#25A99D]"
                      />
                      <div>
                        <p className="text-sm font-bold text-gray-900">{item.nama}</p>
                        <p className="text-[10px] text-gray-400 font-medium">{item.kode}</p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-[#25A99D]">
                      Rp {item.harga.toLocaleString('id-ID')}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Sisi Kanan: Input Detail & Tombol Submit */}
          <div className="space-y-5 flex flex-col justify-between">
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1.5">
                  Gigi (Nomor)
                </label>
                <input
                  type="text"
                  value={nomorGigi}
                  onChange={(e) => setNomorGigi(e.target.value)}
                  placeholder="Contoh: 36, 37"
                  className="w-full px-4 py-3 rounded-2xl border border-gray-200 text-xs font-medium focus:outline-none focus:border-[#25A99D] transition"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1.5">
                  Catatan Tambahan
                </label>
                <textarea
                  rows={4}
                  value={catatan}
                  onChange={(e) => setCatatan(e.target.value)}
                  placeholder="Catatan khusus untuk billing..."
                  className="w-full px-4 py-3 rounded-2xl border border-gray-200 text-xs font-medium focus:outline-none focus:border-[#25A99D] transition resize-none"
                />
              </div>

              {/* Warning Banner Khusus Tindakan Lab */}
              {jenisTindakan === 'lab' && (
                <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200/60 flex items-start gap-3">
                  <svg className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <div>
                    <p className="text-xs font-bold text-amber-800">Memerlukan Pengiriman ke Lab</p>
                    <p className="text-[11px] text-amber-700 mt-0.5">
                      Setelah simpan, lanjutkan ke form pengiriman Lab Dental.
                    </p>
                  </div>
                </div>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-[#25A99D] hover:bg-[#1f8f84] text-white rounded-2xl text-xs font-bold transition shadow-sm mt-4"
            >
              Simpan Tindakan & Buat Draft Billing
            </button>
          </div>
        </form>
      </div>

      {/* TOAST NOTIFICATIONS (SUDUT KANAN BAWAH) */}
      {showToasts && (
        <div className="fixed bottom-6 right-6 space-y-3 z-50 animate-bounce-short">
          <div className="p-4 bg-[#E6F8F3] border border-[#25A99D]/30 rounded-2xl shadow-lg flex items-start gap-3 max-w-xs">
            <div className="w-5 h-5 rounded-full bg-[#25A99D] text-white flex items-center justify-center text-xs shrink-0 mt-0.5">
              ✓
            </div>
            <div className="flex-1">
              <p className="text-xs font-bold text-gray-900">Draft Invoice Dibuat</p>
              <p className="text-[10px] text-gray-500 mt-0.5">
                INV-939205 berhasil disimpan ke billing.
              </p>
            </div>
          </div>

          <div className="p-4 bg-[#E6F8F3] border border-[#25A99D]/30 rounded-2xl shadow-lg flex items-start gap-3 max-w-xs">
            <div className="w-5 h-5 rounded-full bg-[#25A99D] text-white flex items-center justify-center text-xs shrink-0 mt-0.5">
              ✓
            </div>
            <div className="flex-1">
              <p className="text-xs font-bold text-gray-900">Tindakan Disimpan</p>
              <p className="text-[10px] text-gray-500 mt-0.5">
                Draft invoice INV-939205 dibuat untuk Dewi Rahayu
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}