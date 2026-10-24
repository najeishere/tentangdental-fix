// app/Pasien/riwayat/page.tsx
'use client';

interface ItemRiwayat {
  id: string;
  kodeKunjungan: string;
  tanggal: string;
  tindakan: string;
  diagnosa: string;
  dokter: string;
  status: 'Selesai';
}

export default function PasienRiwayatPage() {
  const riwayatList: ItemRiwayat[] = [
    {
      id: '1',
      kodeKunjungan: 'KNJ-2026-089',
      tanggal: '02 Sep 2026',
      tindakan: 'Scaling & Polishing',
      diagnosa: 'Kalkulus gigi ringan',
      dokter: 'drg. Sari Dewi',
      status: 'Selesai',
    },
    {
      id: '2',
      kodeKunjungan: 'KNJ-2026-071',
      tanggal: '15 Agu 2026',
      tindakan: 'Tambal Gigi Komposit',
      diagnosa: 'Karies gigi 36',
      dokter: 'drg. Hendra K.',
      status: 'Selesai',
    },
    {
      id: '3',
      kodeKunjungan: 'KNJ-2026-058',
      tanggal: '28 Jul 2026',
      tindakan: 'Konsultasi',
      diagnosa: 'Pemeriksaan rutin',
      dokter: 'drg. Sari Dewi',
      status: 'Selesai',
    },
  ];

  return (
    <div className="space-y-6">
      {/* List Kartu Riwayat Kunjungan */}
      <div className="space-y-4">
        {riwayatList.map((item) => (
          <div
            key={item.id}
            className="p-6 bg-white rounded-3xl border border-gray-100 shadow-sm space-y-4 transition hover:shadow-md"
          >
            {/* Header Kartu: Kode Kunjungan, Status Badge, & Tanggal */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="px-3 py-1 bg-gray-100/80 text-gray-500 rounded-lg text-[11px] font-semibold tracking-wide">
                  {item.kodeKunjungan}
                </span>
                <span className="px-3.5 py-1 bg-[#E6F8F3] text-[#25A99D] rounded-full text-xs font-bold inline-flex items-center gap-1">
                  ✓ {item.status}
                </span>
              </div>
              <span className="text-xs font-medium text-gray-400">
                {item.tanggal}
              </span>
            </div>

            {/* Grid 3 Kolom Detail: Tindakan, Diagnosa, Dokter */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
              <div>
                <p className="text-[11px] font-medium text-gray-400">Tindakan</p>
                <p className="text-sm font-bold text-gray-900 mt-0.5">
                  {item.tindakan}
                </p>
              </div>

              <div>
                <p className="text-[11px] font-medium text-gray-400">Diagnosa</p>
                <p className="text-sm font-bold text-gray-900 mt-0.5">
                  {item.diagnosa}
                </p>
              </div>

              <div>
                <p className="text-[11px] font-medium text-gray-400">Dokter</p>
                <p className="text-sm font-bold text-gray-900 mt-0.5">
                  {item.dokter}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}