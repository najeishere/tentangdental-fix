// app/Klinik/dashboard/page.tsx
'use client';

export default function KlinikDashboardPage() {
  const antreanList = [
    {
      no: 'A-038',
      nama: 'Rina Kartika',
      umur: '28 tahun',
      keluhan: 'Sakit gigi geraham',
      jam: '08:30',
      dokter: 'drg. Sari Dewi',
      status: 'Selesai',
    },
    {
      no: 'A-039',
      nama: 'Farhan Maulana',
      umur: '35 tahun',
      keluhan: 'Tambal gigi berlubang',
      jam: '09:00',
      dokter: 'drg. Sari Dewi',
      status: 'Selesai',
    },
    {
      no: 'A-040',
      nama: 'Dewi Rahayu',
      umur: '42 tahun',
      keluhan: 'Gigi sensitif',
      jam: '09:30',
      dokter: 'drg. Sari Dewi',
      status: 'Dalam Proses',
    },
    {
      no: 'A-041',
      nama: 'Budi Santoso',
      umur: '31 tahun',
      keluhan: 'Scaling rutin',
      jam: '10:00',
      dokter: 'drg. Sari Dewi',
      status: 'Menunggu',
    },
    {
      no: 'A-042',
      nama: 'Sri Wahyuni',
      umur: '55 tahun',
      keluhan: 'Gigi goyang',
      jam: '10:30',
      dokter: 'drg. Hendra K.',
      status: 'Menunggu',
    },
    {
      no: 'A-043',
      nama: 'Reza Pratama',
      umur: '24 tahun',
      keluhan: 'Konsultasi kawat gigi',
      jam: '11:00',
      dokter: 'drg. Hendra K.',
      status: 'Menunggu',
    },
  ];

  return (
    <div className="space-y-6">
      {/* 1. TOP STATS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Antrean */}
        <div className="p-5 bg-white rounded-2xl border border-gray-100 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-400">Total Antrean</span>
            <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
            </div>
          </div>
          <div>
            <p className="text-3xl font-bold text-gray-900">6</p>
            <p className="text-xs text-gray-400 mt-1">Hari ini</p>
          </div>
        </div>

        {/* Selesai Ditangani */}
        <div className="p-5 bg-white rounded-2xl border border-gray-100 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-400">Selesai Ditangani</span>
            <div className="w-9 h-9 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div>
            <p className="text-3xl font-bold text-gray-900">2</p>
            <p className="text-xs text-gray-400 mt-1">dari 6</p>
          </div>
        </div>

        {/* Dalam Proses */}
        <div className="p-5 bg-white rounded-2xl border border-gray-100 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-400">Dalam Proses</span>
            <div className="w-9 h-9 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center shrink-0">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </div>
          </div>
          <div>
            <p className="text-3xl font-bold text-gray-900">1</p>
            <p className="text-xs text-gray-400 mt-1">Sedang berjalan</p>
          </div>
        </div>

        {/* Menunggu */}
        <div className="p-5 bg-white rounded-2xl border border-gray-100 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-400">Menunggu</span>
            <div className="w-9 h-9 rounded-full bg-amber-50 text-amber-500 flex items-center justify-center shrink-0">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div>
            <p className="text-3xl font-bold text-gray-900">3</p>
            <p className="text-xs text-gray-400 mt-1">Belum ditangani</p>
          </div>
        </div>
      </div>

      {/* 2. TABEL ANTREAN HARI INI */}
      <div className="p-6 bg-white rounded-3xl border border-gray-100 shadow-sm space-y-5">
        <h3 className="text-base font-bold text-gray-900">
          Antrean Hari Ini — <span className="font-semibold text-gray-600">Semua Dokter</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/80 text-gray-400 font-semibold uppercase text-[10px] tracking-wider rounded-xl">
                <th className="py-3 px-4 rounded-l-xl">NO.</th>
                <th className="py-3 px-4">NAMA PASIEN</th>
                <th className="py-3 px-4">KELUHAN</th>
                <th className="py-3 px-4">JAM</th>
                <th className="py-3 px-4">DOKTER</th>
                <th className="py-3 px-4 rounded-r-xl">STATUS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {antreanList.map((item, idx) => (
                <tr key={idx} className="hover:bg-gray-50/40 transition">
                  <td className="py-4 px-4 font-bold text-[#25A99D] text-xs whitespace-nowrap">
                    {item.no}
                  </td>
                  <td className="py-4 px-4 whitespace-nowrap">
                    <p className="font-bold text-gray-900 text-sm">{item.nama}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{item.umur}</p>
                  </td>
                  <td className="py-4 px-4 text-gray-600 text-xs whitespace-nowrap">
                    {item.keluhan}
                  </td>
                  <td className="py-4 px-4 font-bold text-gray-900 text-xs whitespace-nowrap">
                    {item.jam}
                  </td>
                  <td className="py-4 px-4 text-gray-600 text-xs whitespace-nowrap">
                    {item.dokter}
                  </td>
                  <td className="py-4 px-4 whitespace-nowrap">
                    {item.status === 'Selesai' && (
                      <span className="px-3 py-1 bg-[#E6F8F3] text-[#25A99D] rounded-full text-xs font-bold inline-flex items-center gap-1">
                        ✓ Selesai
                      </span>
                    )}
                    {item.status === 'Dalam Proses' && (
                      <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-bold inline-flex items-center gap-1">
                        → Dalam Proses
                      </span>
                    )}
                    {item.status === 'Menunggu' && (
                      <span className="px-3 py-1 bg-amber-50 text-amber-600 rounded-full text-xs font-bold inline-flex items-center gap-1">
                        ⏱ Menunggu
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}