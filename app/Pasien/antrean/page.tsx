// app/Pasien/antrean/page.tsx
'use client';

import { useState } from 'react';

interface AntreanPasien {
  id: string;
  noAntrean: string;
  tanggal: string;
  jam: string;
  dokter: string;
  keluhan: string;
  catatanStatus: string;
  status: 'Menunggu' | 'Dalam Proses' | 'Selesai';
}

const daftarSesiJam = [
  { jam: '07:30', available: true },
  { jam: '08:00', available: true },
  { jam: '08:30', available: true },
  { jam: '09:00', available: true },
  { jam: '09:30', available: true },
  { jam: '10:00', available: true },
  { jam: '10:30', available: true },
  { jam: '11:00', available: false }, // Slot Penuh / Disdisabled
  { jam: '11:30', available: true },
  { jam: '12:00', available: false }, // Slot Penuh / Disdisabled
];

export default function PasienAntreanPage() {
  const [showForm, setShowForm] = useState(false);

  // Form State
  const [dokter, setDokter] = useState('drg. Sari Dewi');
  const [tanggalKunjungan, setTanggalKunjungan] = useState('');
  const [selectedJam, setSelectedJam] = useState('');
  const [keluhan, setKeluhan] = useState('');

  // List Antrean Pasien
  const [antreanList, setAntreanList] = useState<AntreanPasien[]>([
    {
      id: '1',
      noAntrean: 'A-041',
      tanggal: '16 Sep 2026',
      jam: '10:00 WIB',
      dokter: 'drg. Sari Dewi',
      keluhan: 'Scaling rutin',
      catatanStatus: 'Menunggu validasi admin',
      status: 'Menunggu',
    },
  ]);

  const formatTanggalIndo = (dateStr: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(date);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tanggalKunjungan || !selectedJam || !keluhan.trim()) return;

    const newAntrean: AntreanPasien = {
      id: Date.now().toString(),
      noAntrean: `A-0${Math.floor(42 + Math.random() * 10)}`,
      tanggal: formatTanggalIndo(tanggalKunjungan),
      jam: `${selectedJam} WIB`,
      dokter: dokter,
      keluhan: keluhan,
      catatanStatus: 'Menunggu validasi admin',
      status: 'Menunggu',
    };

    setAntreanList([newAntrean, ...antreanList]);
    setTanggalKunjungan('');
    setSelectedJam('');
    setKeluhan('');
    setShowForm(false);
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-5 py-2.5 bg-[#25A99D] hover:bg-[#1f8f84] text-white rounded-2xl text-xs font-bold transition flex items-center gap-2 shadow-sm"
        >
          <span>+</span>
          <span>Daftar Kunjungan</span>
        </button>
      </div>

      {/* FORMULIR PENDAFTARAN KUNJUNGAN */}
      {showForm && (
        <div className="p-6 bg-white rounded-3xl border border-gray-100 shadow-sm space-y-5 animate-fade-in">
          <h3 className="text-sm font-bold text-gray-900">Formulir Pendaftaran Kunjungan</h3>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* 1. Pilih Dokter */}
              <div>
                <label className="text-[11px] font-bold text-gray-400 block mb-1.5">
                  Pilih Dokter
                </label>
                <div className="relative">
                  <select
                    value={dokter}
                    onChange={(e) => setDokter(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl border border-gray-200 text-xs font-medium text-gray-800 bg-white focus:outline-none focus:border-[#25A99D] appearance-none cursor-pointer"
                  >
                    <option value="drg. Sari Dewi">drg. Sari Dewi</option>
                    <option value="drg. Hendra K.">drg. Hendra K.</option>
                  </select>
                  <div className="absolute right-4 top-3.5 pointer-events-none text-gray-400 text-xs">
                    ▼
                  </div>
                </div>
              </div>

              {/* 2. Tanggal Kunjungan (Kalender Wajib Pertama) */}
              <div>
                <label className="text-[11px] font-bold text-gray-400 block mb-1.5">
                  Tanggal Kunjungan <span className="text-rose-500">*</span>
                </label>
                <input
                  type="date"
                  required
                  value={tanggalKunjungan}
                  onChange={(e) => {
                    setTanggalKunjungan(e.target.value);
                    setSelectedJam(''); // Reset pilihan jam ketika tanggal berubah
                  }}
                  className="w-full px-4 py-3 rounded-2xl border border-gray-200 text-xs font-medium text-gray-800 bg-white focus:outline-none focus:border-[#25A99D] cursor-pointer"
                />
              </div>
            </div>

            {/* 3. SESI PILIH JAM (MUNCUL SETELAH TANGGAL DIPILIH) */}
            {tanggalKunjungan && (
              <div className="space-y-2 pt-1 animate-fade-in">
                <p className="text-xs font-bold text-gray-700">
                  Pilih Sesi Jam — <span className="font-medium text-gray-400">{tanggalKunjungan}</span>
                </p>

                <div className="p-4 bg-gray-50/50 rounded-2xl border border-gray-100 flex flex-wrap gap-2.5 items-center">
                  {daftarSesiJam.map((sesi, idx) => {
                    const isSelected = selectedJam === sesi.jam;
                    return (
                      <button
                        key={idx}
                        type="button"
                        disabled={!sesi.available}
                        onClick={() => setSelectedJam(sesi.jam)}
                        className={`px-4 py-2 rounded-full text-xs font-bold border transition duration-150 ${
                          !sesi.available
                            ? 'bg-gray-100/80 border-gray-100 text-gray-300 cursor-not-allowed'
                            : isSelected
                            ? 'bg-[#25A99D] border-[#25A99D] text-white shadow-sm'
                            : 'bg-white border-[#25A99D]/40 text-[#25A99D] hover:bg-teal-50/50'
                        }`}
                      >
                        {sesi.jam}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Keluhan / Tujuan */}
            <div>
              <label className="text-[11px] font-bold text-gray-400 block mb-1.5">
                Keluhan / Tujuan
              </label>
              <textarea
                rows={3}
                required
                value={keluhan}
                onChange={(e) => setKeluhan(e.target.value)}
                placeholder="Tuliskan keluhan..."
                className="w-full px-4 py-3 rounded-2xl border border-gray-200 text-xs font-medium text-gray-800 focus:outline-none focus:border-[#25A99D] resize-none"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 pt-2">
              <button
                type="submit"
                disabled={!tanggalKunjungan || !selectedJam}
                className={`px-6 py-2.5 rounded-2xl text-xs font-bold transition ${
                  !tanggalKunjungan || !selectedJam
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-[#25A99D] hover:bg-[#1f8f84] text-white shadow-sm'
                }`}
              >
                Daftarkan
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-2xl text-xs font-bold transition"
              >
                Batal
              </button>
            </div>
          </form>
        </div>
      )}

      {/* LIST KARTU ANTREAN PASIEN */}
      <div className="space-y-4">
        {antreanList.map((item) => (
          <div
            key={item.id}
            className="p-6 bg-white rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between gap-4 transition hover:shadow-md"
          >
            <div className="flex items-center gap-5">
              <div className="w-16 h-14 rounded-2xl bg-[#EAF7FB] text-[#25A99D] font-bold text-sm flex items-center justify-center shrink-0">
                {item.noAntrean}
              </div>

              <div className="space-y-1">
                <h3 className="text-sm font-bold text-gray-900">
                  {item.tanggal} · {item.jam}
                </h3>
                <p className="text-xs text-gray-400 font-medium">
                  {item.dokter} · {item.keluhan}
                </p>
                <div className="flex items-center gap-1.5 text-[11px] font-medium text-amber-500 pt-0.5">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{item.catatanStatus}</span>
                </div>
              </div>
            </div>

            <div className="shrink-0">
              <span className="px-3.5 py-1.5 bg-amber-50 text-amber-600 rounded-full text-xs font-bold inline-flex items-center gap-1">
                ⏱ Menunggu
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}