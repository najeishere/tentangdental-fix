// app/Pasien/tagihan/page.tsx
'use client';

import { useState } from 'react';

interface RincianBiaya {
  keterangan: string;
  biaya: number;
}

interface ItemInvoice {
  id: string;
  noInvoice: string;
  tanggal: string;
  ringkasan: string;
  total: number;
  metode: string;
  status: 'Lunas' | 'Belum Bayar';
  rincian: RincianBiaya[];
}

export default function PasienTagihanPage() {
  const [openInvoiceId, setOpenInvoiceId] = useState<string | null>('1');

  const invoiceList: ItemInvoice[] = [
    {
      id: '1',
      noInvoice: 'INV-2026-089',
      tanggal: '02 Sep 2026',
      ringkasan: 'Jasa Tindakan Scaling',
      total: 395000,
      metode: 'via QRIS',
      status: 'Lunas',
      rincian: [
        { keterangan: 'Jasa Tindakan Scaling', biaya: 350000 },
        { keterangan: 'BMHP (Polishing paste, cup)', biaya: 45000 },
      ],
    },
    {
      id: '2',
      noInvoice: 'INV-2026-071',
      tanggal: '15 Agu 2026',
      ringkasan: 'Jasa Tindakan Tambal',
      total: 365000,
      metode: 'via Transfer',
      status: 'Lunas',
      rincian: [
        { keterangan: 'Tambal Gigi Komposit', biaya: 280000 },
        { keterangan: 'BMHP (Komposit, etsa, bonding)', biaya: 85000 },
      ],
    },
  ];

  const toggleAccordion = (id: string) => {
    setOpenInvoiceId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="space-y-4">
      {invoiceList.map((item) => {
        const isOpen = openInvoiceId === item.id;
        return (
          <div
            key={item.id}
            className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden transition"
          >
            {/* Header Kartu Invoice (Dapat Diklik) */}
            <div
              onClick={() => toggleAccordion(item.id)}
              className="p-6 flex items-center justify-between cursor-pointer hover:bg-gray-50/40 transition"
            >
              <div className="flex items-center gap-4">
                {/* Icon Dokumen Invoice */}
                <div className="w-10 h-10 rounded-2xl bg-teal-50 text-[#25A99D] flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-gray-900">{item.noInvoice}</h3>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {item.tanggal} · {item.ringkasan}
                  </p>
                </div>
              </div>

              {/* Sisi Kanan: Total, Metode, Badge Status & Arrow Indicator */}
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-sm font-bold text-gray-900">
                    Rp {item.total.toLocaleString('id-ID')}
                  </p>
                  <p className="text-[10px] text-gray-400 mt-0.5">{item.metode}</p>
                </div>

                <span className="px-3 py-1 bg-[#E6F8F3] text-[#25A99D] rounded-full text-xs font-bold inline-flex items-center gap-1">
                  ✓ {item.status}
                </span>

                <span className="text-gray-400 text-xs font-bold transition">
                  {isOpen ? '▲' : '▼'}
                </span>
              </div>
            </div>

            {/* Detail Rincian Biaya (Muncul Saat Di-Expand) */}
            {isOpen && (
              <div className="px-8 pb-6 pt-2 border-t border-gray-50 space-y-3 animate-fade-in">
                <div className="flex items-center justify-between text-xs font-bold text-gray-400 pb-1">
                  <span>Keterangan</span>
                  <span>Biaya</span>
                </div>

                <div className="space-y-2.5 divide-y divide-gray-50 text-xs">
                  {item.rincian.map((sub, idx) => (
                    <div key={idx} className="pt-2 flex items-center justify-between font-medium text-gray-700">
                      <span>{sub.keterangan}</span>
                      <span className="font-semibold text-gray-900">
                        Rp {sub.biaya.toLocaleString('id-ID')}
                      </span>
                    </div>
                  ))}

                  {/* Total Row */}
                  <div className="pt-3 flex items-center justify-between text-xs font-bold">
                    <span className="text-gray-900">Total</span>
                    <span className="text-[#25A99D]">
                      Rp {item.total.toLocaleString('id-ID')}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}