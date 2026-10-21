// app/Klinik/antrean/page.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';

interface PasienAntrean {
  no: string;
  nama: string;
  keluhan: string;
  jam: string;
  dokter: string;
  status: 'Selesai' | 'Dalam Proses' | 'Menunggu';
}

export default function KlinikAntreanPage() {
  const [antreanList, setAntreanList] = useState<PasienAntrean[]>([
    {
      no: 'A-038',
      nama: 'Rina Kartika',
      keluhan: 'Sakit gigi geraham',
      jam: '08:30',
      dokter: 'drg. Sari Dewi',
      status: 'Selesai',
    },
    {
      no: 'A-039',
      nama: 'Farhan Maulana',
      keluhan: 'Tambal gigi berlubang',
      jam: '09:00',
      dokter: 'drg. Sari Dewi',
      status: 'Selesai',
    },
    {
      no: 'A-040',
      nama: 'Dewi Rahayu',
      keluhan: 'Gigi sensitif',
      jam: '09:30',
      dokter: 'drg. Sari Dewi',
      status: 'Dalam Proses',
    },
    {
      no: 'A-041',
      nama: 'Budi Santoso',
      keluhan: 'Scaling rutin',
      jam: '10:00',
      dokter: 'drg. Sari Dewi',
      status: 'Menunggu',
    },
    {
      no: 'A-042',
      nama: 'Sri Wahyuni',
      keluhan: 'Gigi goyang',
      jam: '10:30',
      dokter: 'drg. Hendra K.',
      status: 'Menunggu',
    },
    {
      no: 'A-043',
      nama: 'Reza Pratama',
      keluhan: 'Konsultasi kawat gigi',
      jam: '11:00',
      dokter: 'drg. Hendra K.',
      status: 'Menunggu',
    },
  ]);

  const handleMulai = (noAntrean: string) => {
    setAntreanList((prev) =>
      prev.map((item) =>
        item.no === noAntrean ? { ...item, status: 'Dalam Proses' } : item
      )
    );
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {antreanList.map((item) => (
          <div
            key={item.no}
            className="p-6 bg-white rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-between space-y-4"
          >
            {/* Header Card */}
            <div className="flex items-start justify-between">
              <div>
                <span className="text-sm font-bold text-[#25A99D]">{item.no}</span>
                <h3 className="text-base font-bold text-gray-900 mt-0.5">{item.nama}</h3>
                <p className="text-xs text-gray-400 font-medium mt-1">{item.keluhan}</p>
                <div className="flex items-center gap-1.5 text-xs text-gray-400 font-medium mt-2">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>
                    {item.jam} · {item.dokter}
                  </span>
                </div>
              </div>

              {/* Status Badge */}
              <div>
                {item.status === 'Selesai' && (
                  <span className="px-3.5 py-1.5 bg-[#E6F8F3] text-[#25A99D] rounded-full text-xs font-bold inline-flex items-center gap-1">
                    ✓ Selesai
                  </span>
                )}
                {item.status === 'Dalam Proses' && (
                  <span className="px-3.5 py-1.5 bg-blue-50 text-blue-600 rounded-full text-xs font-bold inline-flex items-center gap-1">
                    → Dalam Proses
                  </span>
                )}
                {item.status === 'Menunggu' && (
                  <span className="px-3.5 py-1.5 bg-amber-50 text-amber-600 rounded-full text-xs font-bold inline-flex items-center gap-1">
                    ⏱ Menunggu
                  </span>
                )}
              </div>
            </div>

            {/* Action Button */}
            {item.status === 'Dalam Proses' && (
              <Link
                href="/Klinik/tindakan"
                className="w-full py-3 bg-[#25A99D] hover:bg-[#1f8f84] text-white rounded-2xl text-xs font-bold transition text-center block"
              >
                Selesaikan
              </Link>
            )}

            {item.status === 'Menunggu' && (
              <div className="flex justify-end">
                <button
                  onClick={() => handleMulai(item.no)}
                  className="px-6 py-2.5 bg-[#25A99D] hover:bg-[#1f8f84] text-white rounded-2xl text-xs font-bold transition"
                >
                  Mulai
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}