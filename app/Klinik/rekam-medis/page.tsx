// app/Klinik/rekam-medis/page.tsx
'use client';

import { useState } from 'react';

interface Pasien {
  id: string;
  noAntrean: string;
  nama: string;
  keluhan: string;
  status: 'Dalam Proses' | 'Selesai' | 'Menunggu';
  telepon: string;
  nik: string;
  email: string;
  alamat: string;
  kunjunganTerakhir: string;
  totalKunjungan: number;
  umur: number;
  riwayat: {
    tindakan: string;
    tanggal: string;
    dokter: string;
    status: string;
  }[];
}

export default function KlinikRekamMedisPage() {
  const [selectedPasien, setSelectedPasien] = useState<Pasien | null>(null);

  const listPasien: Pasien[] = [
    {
      id: 'P-00120',
      noAntrean: 'A-040',
      nama: 'Dewi Rahayu',
      keluhan: 'Gigi sensitif',
      status: 'Dalam Proses',
      telepon: '0816-5678-9012',
      nik: '3174041207840005',
      email: 'dewi@email.com',
      alamat: 'Jl. Diponegoro 15',
      kunjunganTerakhir: '16 Sep 2026',
      totalKunjungan: 6,
      umur: 42,
      riwayat: [
        {
          tindakan: 'Scaling & Polishing',
          tanggal: '16 Sep 2026',
          dokter: 'drg. Sari Dewi',
          status: 'Selesai',
        },
        {
          tindakan: 'Konsultasi',
          tanggal: '02 Sep 2026',
          dokter: 'drg. Hendra K.',
          status: 'Selesai',
        },
        {
          tindakan: 'Tambal Gigi Komposit',
          tanggal: '15 Agu 2026',
          dokter: 'drg. Sari Dewi',
          status: 'Selesai',
        },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      {/* 1. DAFTAR ANTREAN PASIEN (PILIH PASIEN) */}
      {!selectedPasien ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {listPasien.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedPasien(item)}
              className="p-6 bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition cursor-pointer space-y-3 group"
            >
              <span className="text-xs font-bold text-[#25A99D]">{item.noAntrean}</span>
              <div>
                <h3 className="text-base font-bold text-gray-900 group-hover:text-[#25A99D] transition">
                  {item.nama}
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">{item.keluhan}</p>
              </div>
              <span className="px-3.5 py-1.5 bg-blue-50 text-blue-600 rounded-full text-xs font-bold inline-flex items-center gap-1">
                → {item.status}
              </span>
            </div>
          ))}
        </div>
      ) : (
        /* 2. DETAIL PASIEN - DESAIN MINIMALIS SESUAI GAMBAR */
        <div className="space-y-6">
          {/* Tombol Back Minimalis */}
          <button
            onClick={() => setSelectedPasien(null)}
            className="flex items-center gap-2 text-xs font-bold text-gray-900 hover:text-[#25A99D] transition"
          >
            <span>←</span>
            <span>Detail Pasien</span>
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Sisi Kiri: Kartu Profil Ringkas */}
            <div className="lg:col-span-4 p-8 bg-white rounded-3xl border border-gray-100/80 shadow-sm flex flex-col items-center text-center space-y-5">
              <div className="w-20 h-20 rounded-full bg-[#25A99D] text-white text-2xl font-bold flex items-center justify-center">
                {selectedPasien.nama.charAt(0)}
              </div>

              <div className="space-y-1">
                <h3 className="text-base font-bold text-gray-900">{selectedPasien.nama}</h3>
                <p className="text-xs text-gray-400 font-medium">{selectedPasien.id}</p>
                <span className="px-3 py-1 bg-gray-50 text-gray-400 rounded-full text-[10px] font-bold inline-flex items-center gap-1 mt-1">
                  ⏱ Aktif
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 w-full pt-2">
                <div className="p-4 bg-[#EAF7FB] rounded-2xl text-center">
                  <p className="text-xl font-bold text-[#25A99D]">{selectedPasien.totalKunjungan}</p>
                  <p className="text-[10px] text-gray-400 font-medium mt-0.5">Kunjungan</p>
                </div>
                <div className="p-4 bg-gray-50/80 rounded-2xl text-center">
                  <p className="text-xl font-bold text-gray-800">{selectedPasien.umur}</p>
                  <p className="text-[10px] text-gray-400 font-medium mt-0.5">Tahun</p>
                </div>
              </div>
            </div>

            {/* Sisi Kanan: Kartu Informasi Kontak & Riwayat Kunjungan */}
            <div className="lg:col-span-8 space-y-6">
              {/* Informasi Kontak */}
              <div className="p-6 bg-white rounded-3xl border border-gray-100/80 shadow-sm space-y-4">
                <h4 className="text-xs font-bold text-gray-900 tracking-wide">Informasi Kontak</h4>

                <div className="space-y-4 text-xs">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-gray-50 text-gray-400 flex items-center justify-center shrink-0">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400">Telepon</p>
                      <p className="font-bold text-gray-800 mt-0.5">{selectedPasien.telepon}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-gray-50 text-gray-400 flex items-center justify-center shrink-0">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400">NIK</p>
                      <p className="font-bold text-gray-800 mt-0.5">{selectedPasien.nik}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-gray-50 text-gray-400 flex items-center justify-center shrink-0">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400">Email</p>
                      <p className="font-bold text-gray-800 mt-0.5">{selectedPasien.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-gray-50 text-gray-400 flex items-center justify-center shrink-0">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400">Alamat</p>
                      <p className="font-bold text-gray-800 mt-0.5">{selectedPasien.alamat}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-gray-50 text-gray-400 flex items-center justify-center shrink-0">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400">Kunjungan Terakhir</p>
                      <p className="font-bold text-gray-800 mt-0.5">{selectedPasien.kunjunganTerakhir}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Riwayat Kunjungan Singkat */}
              <div className="p-6 bg-white rounded-3xl border border-gray-100/80 shadow-sm space-y-4">
                <h4 className="text-xs font-bold text-gray-900 tracking-wide">
                  Riwayat Kunjungan Singkat
                </h4>

                <div className="divide-y divide-gray-50">
                  {selectedPasien.riwayat.map((rw, index) => (
                    <div key={index} className="py-3 flex items-center justify-between">
                      <div>
                        <p className="text-xs font-bold text-gray-900">{rw.tindakan}</p>
                        <p className="text-[10px] text-gray-400 mt-0.5">
                          {rw.tanggal} · {rw.dokter}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="px-3 py-1 bg-[#E6F8F3] text-[#25A99D] rounded-full text-[10px] font-bold">
                          ✓ {rw.status}
                        </span>
                        <span className="text-gray-300 text-xs font-bold">›</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}