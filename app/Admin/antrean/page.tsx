// app/(admin)/antrean/page.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import Badge from '@/components/Badge';
import Button from '@/components/Button';

interface AntreanItem {
  id: string;
  nomor: string;
  nama: string;
  umur: number;
  dokter: string;
  jam: string;
  keluhan: string;
  status: 'Dalam Proses' | 'Tervalidasi' | 'Menunggu' | 'Selesai';
  validasi: boolean;
}

export default function AntreanPage() {
  const [search, setSearch] = useState('');
  const [showFormManual, setShowFormManual] = useState(false);

  // State Form Tambah Manual
  const [nama, setNama] = useState('');
  const [noTelp, setNoTelp] = useState('');
  const [keluhan, setKeluhan] = useState('');
  const [dokter, setDokter] = useState('drg. Sari Dewi');
  const [tanggal, setTanggal] = useState('');
  const [selectedJam, setSelectedJam] = useState('');

  const slotJam = [
    { jam: '07:30', status: 'tersedia' },
    { jam: '08:00', status: 'tersedia' },
    { jam: '08:30', status: 'tersedia' },
    { jam: '09:00', status: 'tersedia' },
    { jam: '09:30', status: 'tersedia' },
    { jam: '10:00', status: 'tersedia' },
    { jam: '10:30', status: 'tersedia' },
    { jam: '11:00', status: 'terisi' },
    { jam: '11:30', status: 'tersedia' },
    { jam: '12:00', status: 'terisi' },
  ];

  const [antreanList, setAntreanList] = useState<AntreanItem[]>([
    { id: '1', nomor: 'A-040', nama: 'Dewi Rahayu', umur: 42, dokter: 'drg. Sari Dewi', jam: '09:30', keluhan: 'Gigi sensitif', status: 'Dalam Proses', validasi: true },
    { id: '2', nomor: 'A-041', nama: 'Reza Pratama', umur: 24, dokter: 'drg. Hendra K.', jam: '11:00', keluhan: 'Konsultasi kawat gigi', status: 'Tervalidasi', validasi: true },
    { id: '3', nomor: 'A-042', nama: 'Sri Wahyuni', umur: 55, dokter: 'drg. Hendra K.', jam: '10:30', keluhan: 'Gigi goyang', status: 'Menunggu', validasi: false },
    { id: '4', nomor: 'A-043', nama: 'Budi Santoso', umur: 31, dokter: 'drg. Sari Dewi', jam: '10:00', keluhan: 'Scaling rutin', status: 'Menunggu', validasi: false },
    { id: '5', nomor: 'A-038', nama: 'Rina Kartika', umur: 28, dokter: 'drg. Sari Dewi', jam: '08:30', keluhan: 'Sakit gigi geraham', status: 'Selesai', validasi: true },
    { id: '6', nomor: 'A-039', nama: 'Farhan Maulana', umur: 35, dokter: 'drg. Sari Dewi', jam: '09:00', keluhan: 'Tambal gigi berlubang', status: 'Selesai', validasi: true },
  ]);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNoTelp(e.target.value.replace(/\D/g, ''));
  };

  const handleValidasi = (id: string) => {
    setAntreanList(
      antreanList.map((item) =>
        item.id === id ? { ...item, validasi: true, status: 'Tervalidasi' } : item
      )
    );
  };

  const handleDelete = (id: string) => {
    setAntreanList(antreanList.filter((item) => item.id !== id));
  };

  const handleSubmitManual = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nama || !noTelp || !tanggal || !selectedJam) return;

    const newAntrean: AntreanItem = {
      id: Date.now().toString(),
      nomor: `A-0${antreanList.length + 40}`,
      nama,
      umur: 30,
      dokter,
      jam: selectedJam,
      keluhan: keluhan || '-',
      status: 'Menunggu',
      validasi: false,
    };

    setAntreanList([newAntrean, ...antreanList]);
    setShowFormManual(false);
    setNama('');
    setNoTelp('');
    setKeluhan('');
    setTanggal('');
    setSelectedJam('');
  };

  const filteredAntrean = antreanList.filter(
    (item) =>
      item.nama.toLowerCase().includes(search.toLowerCase()) ||
      item.nomor.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header Action */}
      <div className="flex justify-end">
        <Button
          variant="primary"
          onClick={() => setShowFormManual(!showFormManual)}
          className="text-xs font-bold flex items-center gap-1.5"
        >
          <span>+</span> Tambah Manual
        </Button>
      </div>

      {/* FORM TAMBAH ANTREAN MANUAL */}
      {showFormManual && (
        <div className="p-6 bg-white rounded-3xl border border-gray-100 shadow-sm relative transition animate-fade-in">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-sm font-bold text-gray-900">Tambah Antrean Manual</h3>
            <button
              onClick={() => setShowFormManual(false)}
              className="text-gray-400 hover:text-gray-600 text-sm font-bold"
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleSubmitManual} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Nama Pasien</label>
                <input
                  type="text"
                  placeholder="Nama lengkap"
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                  className="w-full h-10 px-3 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:border-teal-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">No. Telepon</label>
                <div className="relative flex items-center">
                  <span className="absolute left-3 text-xs font-semibold text-gray-500">+62</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder="8xx"
                    value={noTelp}
                    onChange={handlePhoneChange}
                    className="w-full h-10 pl-11 pr-3 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:border-teal-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Keluhan</label>
                <input
                  type="text"
                  placeholder="Keluhan utama"
                  value={keluhan}
                  onChange={(e) => setKeluhan(e.target.value)}
                  className="w-full h-10 px-3 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:border-teal-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Dokter</label>
                <select
                  value={dokter}
                  onChange={(e) => setDokter(e.target.value)}
                  className="w-full h-10 px-3 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:border-teal-500"
                >
                  <option value="drg. Sari Dewi">drg. Sari Dewi</option>
                  <option value="drg. Hendra K.">drg. Hendra K.</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Tanggal Kunjungan</label>
                <input
                  type="date"
                  value={tanggal}
                  onChange={(e) => setTanggal(e.target.value)}
                  className="w-full h-10 px-3 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:border-teal-500"
                  required
                />
              </div>
            </div>

            <div className="pt-2">
              <div className="flex items-center justify-between mb-3">
                <label className="text-xs font-semibold text-gray-700">
                  Pilih Sesi Jam {tanggal && <span className="text-gray-400 font-normal">— {tanggal}</span>}
                </label>

                <div className="flex items-center gap-4 text-[10px] font-medium text-gray-500">
                  <span className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded border border-teal-500 bg-teal-50 inline-block" /> Tersedia
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded bg-teal-500 inline-block" /> Dipilih
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded bg-gray-200 inline-block" /> Terisi
                  </span>
                </div>
              </div>

              {!tanggal ? (
                <div className="p-8 border border-dashed border-gray-200 rounded-2xl text-center text-xs text-gray-400 flex flex-col items-center gap-2">
                  <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>Pilih tanggal kunjungan terlebih dahulu</span>
                </div>
              ) : (
                <div className="p-4 bg-gray-50/50 border border-gray-100 rounded-2xl flex flex-wrap gap-2">
                  {slotJam.map((slot) => {
                    const isSelected = selectedJam === slot.jam;
                    const isTerisi = slot.status === 'terisi';

                    return (
                      <button
                        key={slot.jam}
                        type="button"
                        disabled={isTerisi}
                        onClick={() => setSelectedJam(slot.jam)}
                        className={`px-3.5 py-2 rounded-xl text-xs font-bold transition ${
                          isTerisi
                            ? 'bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed'
                            : isSelected
                            ? 'bg-teal-500 text-white shadow-md shadow-teal-500/20'
                            : 'bg-white text-teal-600 border border-teal-400/60 hover:bg-teal-50'
                        }`}
                      >
                        {slot.jam}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <Button
              variant="primary"
              type="submit"
              disabled={!nama || !noTelp || !tanggal || !selectedJam}
              className="w-full h-11 text-xs font-bold mt-4 disabled:opacity-50"
            >
              Tambahkan ke Antrean
            </Button>
          </form>
        </div>
      )}

      {/* TABEL DAFTAR ANTREAN */}
      <div className="p-6 bg-white rounded-3xl border border-gray-100 shadow-sm space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <svg className="w-4 h-4 text-gray-400 absolute left-3.5 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Cari nama atau nomor antrean..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-9 pl-9 pr-4 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:border-teal-500"
            />
          </div>
          <span className="text-xs text-gray-400 font-medium">
            {filteredAntrean.length} dari {antreanList.length} antrean
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="text-gray-400 border-b border-gray-100 font-semibold uppercase">
                <th className="pb-3">No.</th>
                <th className="pb-3">Pasien</th>
                <th className="pb-3">Dokter</th>
                <th className="pb-3">Jam</th>
                <th className="pb-3">Keluhan</th>
                <th className="pb-3">Status</th>
                <th className="pb-3">Validasi</th>
                <th className="pb-3 text center">Aksi </th>
                <th className="pb-3 w-10"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredAntrean.map((item) => {
                const isSelesai = item.status === 'Selesai';

                return (
                  <tr key={item.id} className="hover:bg-gray-50/50 transition">
                    <td className="py-3.5 font-bold text-teal-600">{item.nomor}</td>
                    <td className="py-3.5">
                      <p className="font-bold text-gray-900">{item.nama}</p>
                      <p className="text-[10px] text-gray-400">{item.umur} tahun</p>
                    </td>
                    <td className="py-3.5 text-gray-600 font-medium">{item.dokter}</td>
                    <td className="py-3.5 font-bold text-gray-900">{item.jam}</td>
                    <td className="py-3.5 text-gray-500">{item.keluhan}</td>
                    <td className="py-3.5">
                      <Badge
                        variant={
                          item.status === 'Selesai'
                            ? 'success'
                            : item.status === 'Dalam Proses' || item.status === 'Tervalidasi'
                            ? 'info'
                            : 'warning'
                        }
                      >
                        {item.status}
                      </Badge>
                    </td>
                    <td className="py-3.5 font-semibold">
                      {item.validasi ? (
                        <span className="text-teal-600 flex items-center gap-1">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                          Tervalidasi
                        </span>
                      ) : (
                        <span className="text-amber-500 flex items-center gap-1">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                          Belum
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 text-right">
                      <div className="flex items-center justify-center gap-2">
                        {/* 1. Tombol Aksi Utama: Validasi vs Billing */}
                        {!isSelesai && (
                          !item.validasi ? (
                            <button
                              onClick={() => handleValidasi(item.id)}
                              className="px-3 py-1.5 bg-teal-500 hover:bg-teal-600 text-white font-semibold rounded-xl text-xs shadow-sm transition"
                            >
                              Validasi
                            </button>
                          ) : (
                            <Link
                              href={`/admin/billing?id=${item.nomor}`}
                              className="px-3 py-1.5 bg-teal-50 hover:bg-teal-100 border border-teal-200 text-teal-600 font-semibold rounded-xl text-xs transition flex items-center gap-1"
                            >
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                              Billing
                            </Link>
                          )
                        )}

                        {/* 2. Tombol Hapus (Hanya untuk Menunggu & Tervalidasi, Hilang di Selesai) */}
                        {!isSelesai && (
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="p-1.5 text-rose-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                            title="Hapus Antrean"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}