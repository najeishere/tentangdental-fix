// app/Admin/pengiriman-lab/page.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { fetchApi } from '@/utils/api';

type Shipment = {
  id: number;
  patient_name: string;
  job_type: string;
  vendor: string;
  sent_date: string;
  estimated_date: string | null;
  cost: string | null;
  instructions: string | null;
  status: 'draft' | 'sent' | 'done';
};

const STATUS_LABEL: Record<Shipment['status'], string> = {
  draft: 'Draft',
  sent: 'Terkirim',
  done: 'Selesai',
};

export default function PengirimanLabPage() {
  const router = useRouter();
  const today = new Date();
  const formattedHeaderDate = today.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  // State untuk form input
  const [pasien, setPasien] = useState('');
  const [jenisPekerjaan, setJenisPekerjaan] = useState('Behel Metal');
  const [vendorLab, setVendorLab] = useState('PT Dental Pro Lab');
  const [tanggalKirim, setTanggalKirim] = useState(today.toISOString().slice(0, 10));
  const [estimasiSelesai, setEstimasiSelesai] = useState('');
  const [biayaLab, setBiayaLab] = useState('');
  const [instruksi, setInstruksi] = useState('');

  // State riwayat pengiriman lab (dari API)
  const [riwayatList, setRiwayatList] = useState<Shipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [saving, setSaving] = useState(false);

  const loadShipments = useCallback(async () => {
    try {
      const json = await fetchApi('/admin/lab-shipments');
      setRiwayatList(json?.data?.shipments ?? []);
      setErrorMsg('');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : '';
      if (message.toLowerCase().includes('unauthenticated') || message.includes('401')) {
        router.replace('/Admin/login');
        return;
      }
      setErrorMsg(message || 'Gagal memuat riwayat pengiriman lab.');
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      router.replace('/Admin/login');
      return;
    }
    loadShipments();
  }, [loadShipments, router]);

  const parseBiaya = (raw: string): number | null => {
    const digits = raw.replace(/[^0-9]/g, '');
    return digits ? parseInt(digits, 10) : null;
  };

  const handleSubmit = async (e: React.FormEvent, status: 'draft' | 'sent') => {
    e.preventDefault();

    if (!pasien.trim()) {
      setErrorMsg('Nama pasien wajib diisi.');
      return;
    }

    setSaving(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      await fetchApi('/admin/lab-shipments', {
        method: 'POST',
        body: JSON.stringify({
          patient_name: pasien.trim(),
          job_type: jenisPekerjaan,
          vendor: vendorLab,
          sent_date: tanggalKirim,
          estimated_date: estimasiSelesai || null,
          cost: parseBiaya(biayaLab),
          instructions: instruksi.trim() || null,
          status,
        }),
      });

      setSuccessMsg(
        status === 'draft'
          ? 'Draft pengiriman lab tersimpan.'
          : 'Pengiriman lab berhasil dikirim ke vendor!'
      );
      setPasien('');
      setBiayaLab('');
      setInstruksi('');
      setEstimasiSelesai('');
      await loadShipments();
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Gagal menyimpan pengiriman lab.');
    } finally {
      setSaving(false);
    }
  };

  const handleStatus = async (shipment: Shipment, status: 'sent' | 'done') => {
    try {
      await fetchApi(`/admin/lab-shipments/${shipment.id}`, {
        method: 'PUT',
        body: JSON.stringify({ status }),
      });
      await loadShipments();
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Gagal memperbarui status.');
    }
  };

  const handleDelete = async (shipment: Shipment) => {
    if (!confirm(`Hapus pengiriman "${shipment.job_type}" untuk ${shipment.patient_name}?`)) return;
    try {
      await fetchApi(`/admin/lab-shipments/${shipment.id}`, { method: 'DELETE' });
      await loadShipments();
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Gagal menghapus pengiriman.');
    }
  };

  const handleLogout = async () => {
    try {
      await fetchApi('/auth/logout', { method: 'POST' });
    } catch {
      // abaikan
    }
    localStorage.removeItem('token');
    localStorage.removeItem('adminNama');
    router.push('/login');
  };

  const formatDate = (d: string | null) =>
    d
      ? new Date(d).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })
      : '—';

  return (
    <div className="min-h-screen bg-[#F4F5F7] flex font-sans text-slate-800">
      {/* SIDEBAR */}
      <aside className="w-64 bg-[#1E293B] text-slate-300 flex flex-col justify-between hidden lg:flex select-none">
        <div>
          <div className="p-6 flex items-center gap-3 border-b border-slate-800">
            <div className="w-9 h-9 bg-[#2EC4B6] rounded-xl flex items-center justify-center text-white font-bold text-base shadow-sm">
              TD
            </div>
            <div>
              <h2 className="text-sm font-bold text-white tracking-wide">TentangDental</h2>
              <p className="text-[11px] text-[#2EC4B6]">Finance Admin</p>
            </div>
          </div>

          <div className="p-4 space-y-6 text-xs">
            <div className="space-y-1">
              <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">Overview</p>
              <Link href="/Admin/dashboard" className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-800/60 transition text-slate-400 hover:text-white">
                Dashboard
              </Link>
            </div>

            <div className="space-y-1">
              <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">Operasional</p>
              <Link href="/Admin/manajemen-antrean" className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-800/60 transition text-slate-400 hover:text-white">
                Manajemen Antrean
              </Link>
              <Link href="/Admin/pencatatan-tagihan" className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-800/60 transition text-slate-400 hover:text-white">
                Pencatatan Tagihan
              </Link>
              <Link href="/Admin/pembayaran" className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-800/60 transition text-slate-400 hover:text-white">
                Pembayaran
              </Link>
              <Link href="/Admin/pengiriman-lab" className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-[#2EC4B6] text-white font-medium shadow-sm">
                Pengiriman Lab
              </Link>
              <Link href="/Admin/catatan-bmhp" className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-800/60 transition text-slate-400 hover:text-white">
                Catatan BMHP
              </Link>
            </div>

            <div className="space-y-1">
              <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">Keuangan</p>
              <Link href="/Admin/rekonsiliasi" className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-800/60 transition text-slate-400 hover:text-white">
                Rekonsiliasi
              </Link>
              <Link href="/Admin/laporan-keuangan" className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-800/60 transition text-slate-400 hover:text-white">
                Laporan Keuangan
              </Link>
            </div>

            <div className="space-y-1">
              <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">Data</p>
              <Link href="/Admin/data-pasien" className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-800/60 transition text-slate-400 hover:text-white">
                Data Pasien
              </Link>
              <Link href="/Admin/data-tindakan" className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-800/60 transition text-slate-400 hover:text-white">
                Data Tindakan
              </Link>
            </div>

            <div className="space-y-1">
              <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">Sistem</p>
              <Link href="/Admin/pengaturan" className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-800/60 transition text-slate-400 hover:text-white">
                Pengaturan
              </Link>
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-slate-800">
          <button onClick={handleLogout} className="w-full text-left flex items-center gap-3 px-3 py-2.5 text-xs text-rose-400 hover:bg-rose-500/10 rounded-xl transition font-medium">
            Keluar
          </button>
        </div>
      </aside>

      {/* MAIN CONTAINER */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* HEADER */}
        <header className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-20">
          <div>
            <h1 className="text-sm font-bold text-slate-900">Pengiriman Lab Dental</h1>
            <p className="text-[11px] text-slate-500">Formulir pengiriman cetakan ke vendor</p>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl text-xs text-slate-600">
              <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
              <span>{formattedHeaderDate}</span>
            </div>

            <div className="flex items-center gap-3 pl-2 border-l border-slate-200">
              <div className="w-8 h-8 rounded-full bg-[#2EC4B6] text-white flex items-center justify-center font-bold text-xs shadow-sm">
                A
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-xs font-bold text-slate-800 leading-none">
                  {typeof window !== 'undefined' ? localStorage.getItem('adminNama') || 'Admin' : 'Admin'}
                </p>
                <p className="text-[10px] text-slate-500 mt-0.5">Admin</p>
              </div>
            </div>
          </div>
        </header>

        {/* BODY CONTENT */}
        <main className="p-8 space-y-8 overflow-y-auto">
          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-100 text-rose-600 text-xs rounded-xl">{errorMsg}</div>
          )}
          {successMsg && (
            <div className="p-3 bg-emerald-50 border border-emerald-100 text-emerald-600 text-xs rounded-xl">{successMsg}</div>
          )}

          {/* FORM CARD */}
          <div className="bg-white p-8 rounded-2xl border border-slate-200/80 shadow-sm">
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Pasien */}
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Pasien</label>
                  <input
                    type="text"
                    value={pasien}
                    onChange={(e) => setPasien(e.target.value)}
                    placeholder="Nama lengkap pasien"
                    required
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
                    required
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
                  placeholder="Cetakan: Rahang atas & bawah. Warna: A2. Oklusi: kelas I..."
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-[#2EC4B6]"
                ></textarea>
              </div>

              {/* Tombol Aksi */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  disabled={saving}
                  onClick={(e) => handleSubmit(e, 'sent')}
                  className="px-6 py-2.5 bg-[#2EC4B6] hover:bg-[#259f93] text-white rounded-xl text-xs font-bold transition shadow-sm disabled:opacity-50"
                >
                  {saving ? 'Menyimpan...' : 'Kirim ke Lab'}
                </button>
                <button
                  type="button"
                  disabled={saving}
                  onClick={(e) => handleSubmit(e, 'draft')}
                  className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-xs font-bold transition disabled:opacity-50"
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
                    <th className="px-6 py-3 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {loading ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-6 text-center text-slate-400">Memuat riwayat…</td>
                    </tr>
                  ) : riwayatList.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-6 text-center text-slate-400">Belum ada pengiriman lab.</td>
                    </tr>
                  ) : (
                    riwayatList.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50/50 transition">
                        <td className="px-6 py-4 font-semibold">{item.patient_name}</td>
                        <td className="px-6 py-4">{item.job_type}</td>
                        <td className="px-6 py-4">{item.vendor}</td>
                        <td className="px-6 py-4">{formatDate(item.sent_date)}</td>
                        <td className="px-6 py-4">{formatDate(item.estimated_date)}</td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-3 py-1 rounded-full text-[10px] font-bold ${
                              item.status === 'done'
                                ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                                : item.status === 'draft'
                                ? 'bg-slate-100 text-slate-500 border border-slate-200'
                                : 'bg-amber-50 text-amber-600 border border-amber-100'
                            }`}
                          >
                            {STATUS_LABEL[item.status]}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right whitespace-nowrap">
                          {item.status === 'draft' && (
                            <button
                              onClick={() => handleStatus(item, 'sent')}
                              className="px-3 py-1 bg-[#2EC4B6] text-white rounded-lg text-[10px] font-bold hover:bg-[#259f93] transition mr-1"
                            >
                              Kirim
                            </button>
                          )}
                          {item.status === 'sent' && (
                            <button
                              onClick={() => handleStatus(item, 'done')}
                              className="px-3 py-1 bg-emerald-500 text-white rounded-lg text-[10px] font-bold hover:bg-emerald-600 transition mr-1"
                            >
                              Tandai Selesai
                            </button>
                          )}
                          <button
                            onClick={() => handleDelete(item)}
                            className="px-3 py-1 bg-rose-50 text-rose-500 border border-rose-100 rounded-lg text-[10px] font-bold hover:bg-rose-100 transition"
                          >
                            Hapus
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
