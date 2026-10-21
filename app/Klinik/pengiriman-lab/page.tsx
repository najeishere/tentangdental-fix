// app/Admin/pengiriman-lab/page.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function PengirimanLabPage() {
  // Tanggal otomatis untuk header
  const today = new Date();
  const formattedHeaderDate = today.toLocaleDateString('id-ID', { 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric' 
  });

  // State untuk form input
  const [pasien, setPasien] = useState('Reza Pratama — A-043');
  const [jenisPekerjaan, setJenisPekerjaan] = useState('Behel Metal');
  const [vendorLab, setVendorLab] = useState('PT Dental Pro Lab');
  const [tanggalKirim, setTanggalKirim] = useState('2026-10-06');
  const [estimasiSelesai, setEstimasiSelesai] = useState('');
  const [biayaLab, setBiayaLab] = useState('');
  const [instruksi, setInstruksi] = useState('Cetakan: Rahang atas & bawah. Warna: A2. Oklusi: kelas I...');

  // State riwayat pengiriman lab
  const [riwayatList] = useState([
    {
      id: 1,
      pasien: 'Siti Nurhaliza',
      jenisPekerjaan: 'Crown Zirconia',
      vendor: 'PT Dental Pro Lab',
      tanggalKirim: '10 Sep 2026',
      estSelesai: '20 Sep 2026',
      status: 'Terkirim',
    },
    {
      id: 2,
      pasien: 'Agus Setiawan',
      jenisPekerjaan: 'Behel Ceramic',
      vendor: 'CV Mitra Gigi Sehat',
      tanggalKirim: '05 Sep 2026',
      estSelesai: '12 Sep 2026',
      status: 'Selesai',
    },
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Formulir pengiriman lab berhasil disimpan/dikirim!');
  };

  return (
    <div className="min-h-screen bg-[#F4F5F7] flex font-sans text-slate-800">

      {/* MAIN CONTAINER */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* BODY CONTENT */}
        <main className="p-8 space-y-8 overflow-y-auto">
          
          {/* FORM CARD */}
          <div className="bg-white p-8 rounded-2xl border border-slate-200/80 shadow-sm">
            <form onSubmit={handleSubmit} className="space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Pasien */}
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Pasien</label>
                  <input 
                    type="text" 
                    value={pasien} 
                    onChange={(e) => setPasien(e.target.value)} 
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-[#2EC4B6]"
                  />
                </div>

                {/* Jenis Pekerjaan Lab */}
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Jenis Pekerjaan Lab</label>
                  <select 
                    value={jenisPekerjaan} 
                    onChange={(e) => setJenisPekerjaan(e.target.value)} 
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-[#2EC4B6] bg-white"
                  >
                    <option value="Behel Metal">Behel Metal</option>
                    <option value="Crown Zirconia">Crown Zirconia</option>
                    <option value="Behel Ceramic">Behel Ceramic</option>
                    <option value="Denture Akrilik">Denture Akrilik</option>
                  </select>
                </div>

                {/* Vendor Lab */}
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Vendor Lab</label>
                  <select 
                    value={vendorLab} 
                    onChange={(e) => setVendorLab(e.target.value)} 
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-[#2EC4B6] bg-white"
                  >
                    <option value="PT Dental Pro Lab">PT Dental Pro Lab</option>
                    <option value="CV Mitra Gigi Sehat">CV Mitra Gigi Sehat</option>
                    <option value="Laboratorium Gigi Prima">Laboratorium Gigi Prima</option>
                  </select>
                </div>

                {/* Tanggal Kirim */}
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Tanggal Kirim</label>
                  <input 
                    type="date" 
                    value={tanggalKirim} 
                    onChange={(e) => setTanggalKirim(e.target.value)} 
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-[#2EC4B6]"
                  />
                </div>

                {/* Estimasi Selesai */}
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Estimasi Selesai</label>
                  <input 
                    type="date" 
                    value={estimasiSelesai} 
                    onChange={(e) => setEstimasiSelesai(e.target.value)} 
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-[#2EC4B6]"
                  />
                </div>

                {/* Biaya Lab */}
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Biaya Lab (Perkiraan)</label>
                  <input 
                    type="text" 
                    value={biayaLab} 
                    onChange={(e) => setBiayaLab(e.target.value)} 
                    placeholder="Rp 0" 
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-[#2EC4B6]"
                  />
                </div>

              </div>

              {/* Instruksi Teknis */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Instruksi / Spesifikasi Teknis</label>
                <textarea 
                  rows={3}
                  value={instruksi} 
                  onChange={(e) => setInstruksi(e.target.value)} 
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-[#2EC4B6]"
                ></textarea>
              </div>

              {/* Lampiran */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Lampiran Foto/Cetakan</label>
                <div className="border-2 border-dashed border-slate-200 rounded-2xl p-6 text-center hover:bg-slate-50/50 transition cursor-pointer">
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <p className="text-xs text-slate-500">Drag & drop atau klik untuk upload foto/file cetakan</p>
                  </div>
                </div>
              </div>

              {/* Tombol Aksi */}
              <div className="flex items-center gap-3 pt-2">
                <button 
                  type="submit"
                  className="px-6 py-2.5 bg-[#2EC4B6] hover:bg-[#259f93] text-white rounded-xl text-xs font-bold transition shadow-sm"
                >
                  Kirim ke Lab
                </button>
                <button 
                  type="button"
                  className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-xs font-bold transition"
                >
                  Simpan Draft
                </button>
              </div>

            </form>
          </div>

          {/* TABLE RIWAYAT */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">Riwayat Pengiriman Lab</h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 uppercase font-semibold border-b border-slate-100">
                  <tr>
                    <th className="px-6 py-3">Pasien</th>
                    <th className="px-6 py-3">Jenis Pekerjaan</th>
                    <th className="px-6 py-3">Vendor</th>
                    <th className="px-6 py-3">Tanggal Kirim</th>
                    <th className="px-6 py-3">Est. Selesai</th>
                    <th className="px-6 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {riwayatList.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/50 transition">
                      <td className="px-6 py-4 font-semibold">{item.pasien}</td>
                      <td className="px-6 py-4">{item.jenisPekerjaan}</td>
                      <td className="px-6 py-4">{item.vendor}</td>
                      <td className="px-6 py-4">{item.tanggalKirim}</td>
                      <td className="px-6 py-4">{item.estSelesai}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${
                          item.status === 'Selesai' 
                            ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' 
                            : 'bg-amber-50 text-amber-600 border border-amber-100'
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