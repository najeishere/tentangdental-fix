// app/(admin)/pembayaran/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function PembayaranAdmin() {
  const [tanggalHariIni, setTanggalHariIni] = useState('');

  // State alur pembayaran
  const [step, setStep] = useState<'list' | 'proses' | 'sukses'>('list');
  const [metodePembayaran, setMetodePembayaran] = useState<'Tunai' | 'Transfer' | 'QRIS'>('Tunai');
  const [uangDiterima, setUangDiterima] = useState('');

  // State Notifikasi Toast (Kanan Bawah)
  const [toast, setToast] = useState<{ show: boolean; nama: string; nominal: string; via: string }>({
    show: false,
    nama: '',
    nominal: '',
    via: '',
  });

  // Data Keuangan & Invoice — dari API
  const [kasMasuk, setKasMasuk] = useState(4545000);
  const [jumlahSudahLunas, setJumlahSudahLunas] = useState(2);
  const [isLunas, setIsLunas] = useState(false);
  const [visit, setVisit] = useState(null);
  const [totalTagihan, setTotalTagihan] = useState(0);

  const [daftarLunas, setDaftarLunas] = useState([
    { nama: 'Reza Pratama', inv: 'INV-2026-091', via: 'via QRIS', nominal: 'Rp 4.150.000' },
    { nama: 'Rina Kartika', inv: 'INV-2026-089', via: 'via QRIS', nominal: 'Rp 395.000' },
  ]);

  useEffect(() => {
    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' };
    setTanggalHariIni(new Date().toLocaleDateString('id-ID', options));
  }, []);

  const handleKonfirmasiPembayaran = () => {
    const totalTagihan = 378000;
    setKasMasuk(prev => prev + totalTagihan);
    setJumlahSudahLunas(prev => prev + 1);
    setIsLunas(true);
    setDaftarLunas(prev => [
      { nama: 'Dewi Rahayu', inv: 'INV-2026-092', via: `via ${metodePembayaran}`, nominal: 'Rp 378.000' },
      ...prev
    ]);
    setStep('sukses');
  };

  return (
    <div className="space-y-6 relative min-h-[500px]">
      {step === 'sukses' ? (
        /* LAYAR SUKSES PEMBAYARAN */
        <div className="bg-white p-12 rounded-3xl border border-gray-100 shadow-sm text-center space-y-5 my-auto max-w-xl mx-auto mt-12">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-gray-900">Pembayaran Berhasil!</h2>
            <p className="text-xs text-gray-400">Invoice INV-2026-092 telah lunas dan dicatat ke kas harian.</p>
          </div>
          <div className="flex justify-center items-center gap-3 pt-3">
            <button
              onClick={() => setStep('list')}
              className="px-6 py-2.5 bg-[#25A99D] hover:bg-teal-600 text-white rounded-xl text-xs font-bold transition shadow-sm"
            >
              Pembayaran Lain
            </button>
            <Link
              href="/admin/rekonsiliasi"
              className="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-bold transition block"
            >
              Ke Rekonsiliasi
            </Link>
          </div>
        </div>
      ) : (
        <>
          {/* KARTU RINGKASAN ATAS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
              <div className="w-10 h-10 bg-teal-50 text-[#25A99D] rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Kas Masuk Hari Ini</p>
                <p className="text-lg font-bold text-gray-900">Rp {kasMasuk.toLocaleString('id-ID')}</p>
              </div>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
              <div className="w-10 h-10 bg-amber-50 text-amber-500 rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Menunggu Bayar</p>
                <p className="text-lg font-bold text-gray-900">{isLunas ? 0 : 1}</p>
              </div>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
              <div className="w-10 h-10 bg-emerald-50 text-emerald-500 rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Sudah Lunas</p>
                <p className="text-lg font-bold text-gray-900">{jumlahSudahLunas}</p>
              </div>
            </div>
          </div>

          {/* KONTEN UTAMA DUA KOLOM */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* SISI KIRI: DAFTAR PEMBAYARAN */}
            <div className="lg:col-span-7 space-y-6">
              <div className="space-y-3">
                <p className="text-[10px] font-bold text-gray-400 tracking-wider uppercase">Menunggu Pembayaran</p>
                {isLunas ? (
                  <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm text-center text-gray-400 text-xs">
                    ✓ Semua invoice sudah lunas
                  </div>
                ) : (
                  <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex justify-between items-center">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-[#25A99D]">INV-2026-092</span>
                        <span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full text-[10px] font-bold">Finalisasi</span>
                      </div>
                      <p className="text-xs font-bold text-gray-900">Dewi Rahayu</p>
                      <p className="text-sm font-bold text-gray-900 pt-1">Rp 378.000</p>
                    </div>
                    <button
                      onClick={() => setStep('proses')}
                      className="px-4 py-2.5 bg-[#25A99D] hover:bg-teal-600 text-white rounded-xl text-xs font-bold transition shadow-sm"
                    >
                      Proses Bayar
                    </button>
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <p className="text-[10px] font-bold text-gray-400 tracking-wider uppercase">Sudah Lunas Hari Ini</p>
                <div className="space-y-3">
                  {daftarLunas.map((item, idx) => (
                    <div key={idx} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex justify-between items-center">
                      <div>
                        <p className="text-xs font-bold text-gray-900">{item.nama}</p>
                        <p className="text-[10px] text-gray-400">{item.inv} · {item.via}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-bold text-gray-900">{item.nominal}</p>
                        <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-bold">✓ Lunas</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* SISI KANAN: PANEL PROSES PEMBAYARAN */}
            <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
              {step === 'proses' && !isLunas ? (
                <div className="space-y-5">
                  <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                    <h3 className="text-sm font-bold text-gray-900">Proses Pembayaran</h3>
                    <button onClick={() => setStep('list')} className="text-gray-400 hover:text-gray-600 font-bold">✕</button>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-xl space-y-1">
                    <p className="text-[10px] text-gray-400">Total Tagihan — Dewi Rahayu</p>
                    <p className="text-lg font-bold text-gray-900">Rp 378.000</p>
                  </div>

                  <div className="space-y-2 text-xs">
                    <p className="font-semibold text-gray-500">Metode Pembayaran</p>
                    <div className="grid grid-cols-3 gap-2">
                      {(['Tunai', 'Transfer', 'QRIS'] as const).map((m) => (
                        <button
                          key={m}
                          type="button"
                          onClick={() => setMetodePembayaran(m)}
                          className={`py-2.5 rounded-xl font-bold border transition ${
                            metodePembayaran === m ? 'border-[#25A99D] bg-teal-50/50 text-[#25A99D]' : 'border-gray-200 text-gray-600 bg-white'
                          }`}
                        >
                          {m}
                        </button>
                      ))}
                    </div>
                  </div>

                  {metodePembayaran === 'Tunai' && (
                    <div className="space-y-1 text-xs">
                      <label className="font-semibold text-gray-500">Uang Diterima</label>
                      <input
                        type="text"
                        placeholder="Masukkan nominal"
                        value={uangDiterima}
                        onChange={(e) => setUangDiterima(e.target.value)}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl outline-none focus:border-[#25A99D]"
                      />
                    </div>
                  )}

                  {metodePembayaran === 'Transfer' && (
                    <div className="p-3 bg-gray-50 rounded-xl text-xs space-y-1">
                      <p className="font-bold text-gray-700">Rekening Klinik</p>
                      <p className="font-bold text-gray-900">BCA — 1234567890</p>
                      <p className="text-[10px] text-gray-400">a.n. Klinik TentangDental</p>
                    </div>
                  )}

                  {metodePembayaran === 'QRIS' && (
                    <div className="p-4 bg-gray-50 rounded-xl text-center space-y-2">
                      <div className="w-28 h-28 bg-gray-200 mx-auto rounded-lg flex items-center justify-center text-gray-500 text-xs font-bold">
                        <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 3h6v6H3V3zm12 0h6v6h-6V3zM3 15h6v6H3v-6zm15-3h3v3h-3v-3zm-3 3h3v3h-3v-3zm3 3h3v3h-3v-3z"/></svg>
                      </div>
                      <p className="text-[10px] text-gray-400">Scan QR dengan aplikasi pembayaran</p>
                    </div>
                  )}

                  <button
                    onClick={handleKonfirmasiPembayaran}
                    className="w-full py-3 bg-[#25A99D] hover:bg-teal-600 text-white rounded-xl text-xs font-bold transition shadow-sm"
                  >
                    Konfirmasi Pembayaran & Catat ke Kas
                  </button>
                </div>
              ) : (
                <div className="py-20 text-center space-y-3">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto text-gray-400">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/></svg>
                  </div>
                  <p className="text-xs text-gray-400 font-medium">Pilih invoice untuk diproses</p>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* TOAST NOTIFIKASI KANAN BAWAH (FIXED Z-50) */}
      {toast.show && (
        <div className="fixed bottom-6 right-6 z-50 flex items-start gap-3 p-3.5 px-4 bg-[#E6F8F3] border border-[#25A99D]/30 rounded-2xl shadow-xl max-w-xs transition animate-fade-in">
          <div className="w-5 h-5 rounded-full border border-[#25A99D] flex items-center justify-center text-[#25A99D] text-[10px] font-bold shrink-0 mt-0.5">
            ✓
          </div>
          <div className="flex-1 pr-2">
            <p className="text-xs font-bold text-gray-900 leading-tight">Pembayaran Berhasil</p>
            <p className="text-[11px] text-gray-500 mt-0.5 leading-snug">
              {toast.nama} — {toast.nominal} via {toast.via}
            </p>
          </div>
          <button
            onClick={() => setToast((prev) => ({ ...prev, show: false }))}
            className="text-gray-400 hover:text-gray-600 text-xs font-bold leading-none"
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
}