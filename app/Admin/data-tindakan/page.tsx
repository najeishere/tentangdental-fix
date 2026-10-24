// app/Admin/data-tindakan/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function DataTindakanAdmin() {
  const router = useRouter();
  const [tanggalHariIni, setTanggalHariIni] = useState('1 Oktober 2026');
  const [namaAdmin, setNamaAdmin] = useState('Nadia A.');
  const [jabatanAdmin, setJabatanAdmin] = useState('Admin');

  // State Tab Aktif
  const [activeTab, setActiveTab] = useState<'Tindakan Langsung' | 'Tindakan + Lab'>('Tindakan Langsung');

  // State Modal Tambah
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [formTambah, setFormTambah] = useState({
    nama: '',
    kategori: '',
    tarif: '',
    aktif: true,
  });

  // State Modal Edit
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedTindakan, setSelectedTindakan] = useState<{
    kode: string;
    nama: string;
    kategori: string;
    tarif: string;
    aktif: boolean;
  } | null>(null);

  // Data Tindakan Langsung Sesuai Figma
  const [tindakanLangsung, setTindakanLangsung] = useState([
    { kode: 'T001', nama: 'Scaling & Polishing', kategori: 'Preventif', tarif: 'Rp 350.000', aktif: true },
    { kode: 'T002', nama: 'Tambal Gigi Komposit', kategori: 'Restoratif', tarif: 'Rp 280.000', aktif: true },
    { kode: 'T003', nama: 'Pencabutan Gigi Susu', kategori: 'Bedah Minor', tarif: 'Rp 150.000', aktif: true },
    { kode: 'T004', nama: 'Pencabutan Gigi Dewasa', kategori: 'Bedah Minor', tarif: 'Rp 300.000', aktif: true },
    { kode: 'T005', nama: 'Perawatan Saluran Akar', kategori: 'Endodontik', tarif: 'Rp 750.000', aktif: true },
    { kode: 'T006', nama: 'Konsultasi', kategori: 'Umum', tarif: 'Rp 100.000', aktif: true },
    { kode: 'T007', nama: 'Pembersihan Karang Gigi', kategori: 'Preventif', tarif: 'Rp 200.000', aktif: true },
    { kode: 'T008', nama: 'Bleaching Gigi', kategori: 'Estetik', tarif: 'Rp 1.500.000', aktif: true },
  ]);

  // Data Tindakan + Lab Sesuai Figma
  const [tindakanLab, setTindakanLab] = useState([
    { kode: 'L001', nama: 'Crown Zirconia', kategori: 'Prostodontik', tarif: 'Rp 3.500.000', aktif: true },
    { kode: 'L002', nama: 'Behel Metal', kategori: 'Ortodontik', tarif: 'Rp 5.500.000', aktif: true },
    { kode: 'L003', nama: 'Behel Ceramic', kategori: 'Ortodontik', tarif: 'Rp 7.500.000', aktif: true },
    { kode: 'L004', nama: 'Implan Gigi (per unit)', kategori: 'Implantologi', tarif: 'Rp 12.000.000', aktif: true },
    { kode: 'L005', nama: 'Gigi Tiruan Sebagian (GTS)', kategori: 'Prostodontik', tarif: 'Rp 2.800.000', aktif: true },
    { kode: 'L006', nama: 'Veneer Porselen', kategori: 'Estetik', tarif: 'Rp 3.000.000', aktif: true },
  ]);

  useEffect(() => {
    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' };
    setTanggalHariIni(new Date().toLocaleDateString('id-ID', options));

    const savedNama = localStorage.getItem('adminNama');
    const savedJabatan = localStorage.getItem('adminJabatan');
    if (savedNama) setNamaAdmin(savedNama);
    if (savedJabatan) setJabatanAdmin(savedJabatan);
  }, []);

  const handleTambahSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newKode = activeTab === 'Tindakan Langsung' 
      ? `T00${tindakanLangsung.length + 1}` 
      : `L00${tindakanLab.length + 1}`;

    const formattedTarif = `Rp ${Number(formTambah.tarif).toLocaleString('id-ID')}`;

    const newItem = {
      kode: newKode,
      nama: formTambah.nama,
      kategori: formTambah.kategori || 'Umum',
      tarif: formattedTarif,
      aktif: formTambah.aktif,
    };

    if (activeTab === 'Tindakan Langsung') {
      setTindakanLangsung([...tindakanLangsung, newItem]);
    } else {
      setTindakanLab([...tindakanLab, newItem]);
    }

    setIsAddModalOpen(false);
    setFormTambah({ nama: '', kategori: '', tarif: '', aktif: true });
    alert('Tindakan baru berhasil ditambahkan!');
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTindakan) return;

    if (activeTab === 'Tindakan Langsung') {
      setTindakanLangsung(tindakanLangsung.map(item => item.kode === selectedTindakan.kode ? selectedTindakan : item));
    } else {
      setTindakanLab(tindakanLab.map(item => item.kode === selectedTindakan.kode ? selectedTindakan : item));
    }

    setIsEditModalOpen(false);
    setSelectedTindakan(null);
    alert('Perubahan tindakan berhasil disimpan!');
  };

  const currentList = activeTab === 'Tindakan Langsung' ? tindakanLangsung : tindakanLab;

  return (
    <div className="min-h-screen bg-[#F4F5F7] flex font-sans text-slate-800 w-full relative">
     
      {/* KONTEN UTAMA */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Isi Halaman */}
        <main className="p-6 space-y-6 overflow-y-auto">
          
          <div className="flex justify-between items-center">
            {/* TAB SWITCHER */}
            <div className="bg-white p-1 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-1 text-xs font-bold">
              {(['Tindakan Langsung', 'Tindakan + Lab'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-5 py-2 rounded-xl transition ${
                    activeTab === tab ? 'bg-slate-100 text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <button 
              onClick={() => setIsAddModalOpen(true)}
              className="px-4 py-2.5 bg-[#2EC4B6] hover:bg-[#259f93] text-white rounded-xl text-xs font-bold transition shadow-sm flex items-center gap-1.5"
            >
              <span>+</span> Tambah Tindakan
            </button>
          </div>

          {/* MODAL TAMBAH TINDAKAN */}
          {isAddModalOpen && (
            <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xl space-y-4 w-full max-w-lg relative animate-in fade-in zoom-in-95 duration-150">
                <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Tambah Tindakan</h3>
                    <p className="text-[11px] text-slate-400">{activeTab}</p>
                  </div>
                  <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-600 font-bold">✕</button>
                </div>

                <form onSubmit={handleTambahSubmit} className="space-y-4 text-xs">
                  <div>
                    <label className="block text-slate-500 font-semibold mb-1">Nama Tindakan</label>
                    <input 
                      type="text" 
                      placeholder="Contoh: Scaling" 
                      value={formTambah.nama}
                      onChange={(e) => setFormTambah({...formTambah, nama: e.target.value})}
                      required
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-[#2EC4B6]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-slate-500 font-semibold mb-1">Kategori</label>
                      <input 
                        type="text" 
                        placeholder="Preventif / Restoratif" 
                        value={formTambah.kategori}
                        onChange={(e) => setFormTambah({...formTambah, kategori: e.target.value})}
                        required
                        className="w-full px-4 py-2.5 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-[#2EC4B6]"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-500 font-semibold mb-1">Tarif (Rp)</label>
                      <input 
                        type="text" 
                        placeholder="350000" 
                        value={formTambah.tarif}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, '');
                          setFormTambah({...formTambah, tarif: val});
                        }}
                        required
                        className="w-full px-4 py-2.5 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-[#2EC4B6]"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <input 
                      type="checkbox" 
                      id="aktifCheck"
                      checked={formTambah.aktif}
                      onChange={(e) => setFormTambah({...formTambah, aktif: e.target.checked})}
                      className="w-4 h-4 text-[#2EC4B6] rounded border-slate-300 focus:ring-[#2EC4B6]"
                    />
                    <label htmlFor="aktifCheck" className="font-medium text-slate-700">Tindakan aktif dan dapat dipilih</label>
                  </div>

                  <div className="flex gap-3 pt-3">
                    <button type="button" onClick={() => setIsAddModalOpen(false)} className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition">
                      Batal
                    </button>
                    <button type="submit" className="flex-1 py-3 bg-[#2EC4B6] hover:bg-[#259f93] text-white rounded-xl font-bold transition shadow-sm">
                      Tambah Tindakan
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* MODAL EDIT TINDAKAN */}
          {isEditModalOpen && selectedTindakan && (
            <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xl space-y-4 w-full max-w-lg relative animate-in fade-in zoom-in-95 duration-150">
                <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Edit Tindakan</h3>
                    <p className="text-[11px] text-[#2EC4B6] font-bold">{selectedTindakan.kode}</p>
                  </div>
                  <button onClick={() => setIsEditModalOpen(false)} className="text-slate-400 hover:text-slate-600 font-bold">✕</button>
                </div>

                <form onSubmit={handleEditSubmit} className="space-y-4 text-xs">
                  <div>
                    <label className="block text-slate-500 font-semibold mb-1">Nama Tindakan</label>
                    <input 
                      type="text" 
                      value={selectedTindakan.nama}
                      onChange={(e) => setSelectedTindakan({...selectedTindakan, nama: e.target.value})}
                      required
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-[#2EC4B6]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-slate-500 font-semibold mb-1">Kategori</label>
                      <input 
                        type="text" 
                        value={selectedTindakan.kategori}
                        onChange={(e) => setSelectedTindakan({...selectedTindakan, kategori: e.target.value})}
                        required
                        className="w-full px-4 py-2.5 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-[#2EC4B6]"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-500 font-semibold mb-1">Tarif (Teks / Format Rupiah)</label>
                      <input 
                        type="text" 
                        value={selectedTindakan.tarif}
                        onChange={(e) => setSelectedTindakan({...selectedTindakan, tarif: e.target.value})}
                        required
                        className="w-full px-4 py-2.5 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-[#2EC4B6]"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <input 
                      type="checkbox" 
                      id="editAktifCheck"
                      checked={selectedTindakan.aktif}
                      onChange={(e) => setSelectedTindakan({...selectedTindakan, aktif: e.target.checked})}
                      className="w-4 h-4 text-[#2EC4B6] rounded border-slate-300 focus:ring-[#2EC4B6]"
                    />
                    <label htmlFor="editAktifCheck" className="font-medium text-slate-700">Tindakan aktif dan dapat dipilih</label>
                  </div>

                  <div className="flex gap-3 pt-3">
                    <button type="button" onClick={() => setIsEditModalOpen(false)} className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition">
                      Batal
                    </button>
                    <button type="submit" className="flex-1 py-3 bg-[#2EC4B6] hover:bg-[#259f93] text-white rounded-xl font-bold transition shadow-sm">
                      Simpan Perubahan
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Tabel Katalog Tindakan */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="text-slate-400 border-b border-slate-100">
                    <th className="pb-3 font-semibold">Kode</th>
                    <th className="pb-3 font-semibold">Nama Tindakan</th>
                    <th className="pb-3 font-semibold">Kategori</th>
                    <th className="pb-3 font-semibold">Tarif</th>
                    <th className="pb-3 font-semibold">Status</th>
                    <th className="pb-3 font-semibold text-right">Edit</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {currentList.map((item) => (
                    <tr key={item.kode} className="hover:bg-slate-50 transition">
                      <td className="py-3.5 font-bold text-[#2EC4B6]">{item.kode}</td>
                      <td className="py-3.5 font-bold text-slate-900">{item.nama}</td>
                      <td className="py-3.5">
                        <span className="px-2.5 py-1 bg-slate-100 text-slate-600 rounded-full font-medium text-[10px]">
                          {item.kategori}
                        </span>
                      </td>
                      <td className="py-3.5 font-bold text-[#2EC4B6]">{item.tarif}</td>
                      <td className="py-3.5">
                        <span className="px-2.5 py-1 bg-emerald-50 text-emerald-600 rounded-full font-bold text-[10px]">
                          {item.aktif ? 'Aktif' : 'Non-Aktif'}
                        </span>
                      </td>
                      <td className="py-3.5 text-right">
                        <button 
                          onClick={() => {
                            setSelectedTindakan(item);
                            setIsEditModalOpen(true);
                          }}
                          className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition"
                        >
                          Edit
                        </button>
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