// app/Admin/pencatatan-tagihan/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { fetchApi } from '@/utils/api';

type Option = { id: number; name: string };
type TindakanOpt = { id: number; name: string; price: number };
type VisitRow = {
  id: number;
  invoice_number: string;
  visit_date: string;
  payment_status: string;
  total: number;
  complaint?: string | null;
  patient?: Option | null;
  doctor?: Option | null;
  items?: { id: number; tarif_name: string; price: string; quantity: number; total: string }[];
};
type FormItem = { tindakan_id: string; quantity: number };

const rupiah = (n: number | string) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(Number(n));

const tgl = (d: string) =>
  new Date(d).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });

export default function PencatatanTagihanAdmin() {
  const router = useRouter();
  const [tanggalHariIni, setTanggalHariIni] = useState('');
  const [namaAdmin, setNamaAdmin] = useState('Nadia A.');
  const [jabatanAdmin, setJabatanAdmin] = useState('Admin');

  const [patients, setPatients] = useState<Option[]>([]);
  const [doctors, setDoctors] = useState<Option[]>([]);
  const [tindakans, setTindakans] = useState<TindakanOpt[]>([]);
  const [visits, setVisits] = useState<VisitRow[]>([]);
  const [selectedVisit, setSelectedVisit] = useState<VisitRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    patient_id: '',
    doctor_id: '',
    visit_date: new Date().toISOString().slice(0, 10),
    complaint: '',
    items: [{ tindakan_id: '', quantity: 1 }] as FormItem[],
  });

  const loadVisits = async () => {
    const json = await fetchApi('/visits?per_page=15');
    setVisits(json?.data?.visits?.data ?? []);
  };

  useEffect(() => {
    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' };
    setTanggalHariIni(new Date().toLocaleDateString('id-ID', options));
    const savedNama = localStorage.getItem('adminNama');
    const savedJabatan = localStorage.getItem('adminJabatan');
    if (savedNama) setNamaAdmin(savedNama);
    if (savedJabatan) setJabatanAdmin(savedJabatan);

    if (!localStorage.getItem('token')) {
      router.replace('/login');
      return;
    }

    const load = async () => {
      try {
        const [optJson, tinJson] = await Promise.all([
          fetchApi('/admin/options'),
          fetchApi('/admin/tindakans?active_only=1&per_page=100'),
        ]);
        setPatients(optJson?.data?.patients ?? []);
        setDoctors(optJson?.data?.doctors ?? []);
        const rows = (tinJson?.data?.tindakans?.data ?? []) as Record<string, unknown>[];
        setTindakans(
          rows.map((t) => ({
            id: Number(t.id),
            name: String(t.name ?? ''),
            price: Number(t.price ?? 0),
          }))
        );
        await loadVisits();
      } catch (e) {
        console.error('Gagal memuat data', e);
        alert('Gagal memuat data dari server.');
      } finally {
        setLoading(false);
      }
    };
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateItem = (idx: number, patch: Partial<FormItem>) => {
    setForm((f) => ({
      ...f,
      items: f.items.map((it, i) => (i === idx ? { ...it, ...patch } : it)),
    }));
  };

  const subtotal = form.items.reduce((sum, it) => {
    const t = tindakans.find((x) => x.id === Number(it.tindakan_id));
    return sum + (t ? t.price * it.quantity : 0);
  }, 0);

  const handleBuatTagihan = async (e: React.FormEvent) => {
    e.preventDefault();
    const items = form.items.filter((it) => it.tindakan_id);
    if (items.length === 0) {
      alert('Pilih minimal satu tindakan.');
      return;
    }
    setSubmitting(true);
    try {
      const json = await fetchApi('/visits', {
        method: 'POST',
        body: JSON.stringify({
          patient_id: Number(form.patient_id),
          doctor_id: Number(form.doctor_id),
          visit_date: form.visit_date,
          complaint: form.complaint || null,
          items: items.map((it) => ({
            tindakan_id: Number(it.tindakan_id),
            quantity: Number(it.quantity),
          })),
        }),
      });
      await loadVisits();
      const created = json?.data?.visit;
      if (created) {
        setSelectedVisit({
          ...created,
          patient: created.patient ?? null,
          doctor: created.doctor ?? null,
          items: created.items ?? [],
        });
      }
      setForm({
        patient_id: '',
        doctor_id: '',
        visit_date: new Date().toISOString().slice(0, 10),
        complaint: '',
        items: [{ tindakan_id: '', quantity: 1 }],
      });
      alert('Invoice berhasil dibuat!');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Gagal membuat tagihan.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleLanjutPembayaran = () => {
    router.push('/Admin/pembayaran');
  };

  const statusLabel = (s: string) => (s === 'paid' ? 'Lunas' : s === 'partial' ? 'Sebagian' : 'Belum Bayar');

  return (
    <div className="min-h-screen bg-[#F4F5F7] flex font-sans text-slate-800 w-full relative">
      
      {/* SIDEBAR KIRI */}
      <aside className="w-64 bg-[#1A1D2E] text-white flex flex-col justify-between shrink-0 h-screen sticky top-0 overflow-y-auto">
        <div>
          <div className="px-6 py-4 border-b border-white/10 flex items-center gap-3">
            <div className="w-9 h-9 bg-white rounded-xl flex items-center justify-center overflow-hidden shadow-sm">
              <Image src="/logo.png" alt="Logo" width={36} height={36} className="object-contain" />
            </div>
            <div>
              <h2 className="text-sm font-bold tracking-wide">TentangDental</h2>
              <p className="text-xs text-[#2EC4B6]">Finance Admin</p>
            </div>
          </div>

          <div className="p-3 space-y-4 text-xs">
            <div>
              <p className="text-[10px] font-bold text-slate-400 tracking-wider uppercase px-3 mb-1.5">Overview</p>
              <Link href="/Admin/dashboard" className="px-3 py-2 rounded-xl text-slate-300 hover:bg-white/5 hover:text-white cursor-pointer transition flex items-center gap-3">
                <svg className="w-4 h-4 opacity-70" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/></svg>
                Dashboard
              </Link>
            </div>

            <div>
              <p className="text-[10px] font-bold text-slate-400 tracking-wider uppercase px-3 mb-1.5">Operasional</p>
              <div className="space-y-0.5 text-slate-300">
                <Link href="/Admin/manajemen-antrean" className="px-3 py-2 rounded-xl hover:bg-white/5 hover:text-white cursor-pointer transition flex items-center gap-3">
                  <svg className="w-4 h-4 opacity-70" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
                  Manajemen Antrean
                </Link>
                <div className="px-3 py-2 bg-[#2EC4B6] text-white font-medium rounded-xl flex items-center gap-3 shadow-sm cursor-pointer">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"/></svg>
                  Pencatatan Tagihan
                </div>
                {[
                  { name: 'Pembayaran', path: '/Admin/pembayaran', icon: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z' },
                  { name: 'Pengiriman Lab', path: '/Admin/pengiriman-lab', icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4' },
                  { name: 'Catatan BMHP', path: '/Admin/catatan-bmhp', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' }
                ].map((menu, i) => (
                  <Link key={i} href={menu.path} className="px-3 py-2 rounded-xl hover:bg-white/5 hover:text-white cursor-pointer transition flex items-center gap-3">
                    <svg className="w-4 h-4 opacity-70" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d={menu.icon}/></svg>
                    {menu.name}
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <p className="text-[10px] font-bold text-slate-400 tracking-wider uppercase px-3 mb-1.5">Keuangan</p>
              <div className="space-y-0.5 text-slate-300">
                <Link href="/Admin/rekonsiliasi" className="px-3 py-2 rounded-xl hover:bg-white/5 hover:text-white cursor-pointer transition flex items-center gap-3">
                  <svg className="w-4 h-4 opacity-70" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"/></svg>
                  Rekonsiliasi
                </Link>
                <Link href="/Admin/laporan-keuangan" className="px-3 py-2 rounded-xl hover:bg-white/5 hover:text-white cursor-pointer transition flex items-center gap-3">
                  <svg className="w-4 h-4 opacity-70" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>
                  Laporan Keuangan
                </Link>
              </div>
            </div>

            <div>
              <p className="text-[10px] font-bold text-slate-400 tracking-wider uppercase px-3 mb-1.5">Data & Sistem</p>
              <div className="space-y-0.5 text-slate-300">
                {[
                    { name: 'Data Pasien', path: '/Admin/data-pasien', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' },
                    { name: 'Data Tindakan', path: '/Admin/data-tindakan', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4' },
                    { name: 'Pengaturan', path: '/Admin/pengaturan', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065zM15 12a3 3 0 11-6 0 3 3 0 016 0z' }
                ].map((menu, i) => (
                    <Link key={i} href={menu.path} className="px-3 py-2 rounded-xl hover:bg-white/5 hover:text-white cursor-pointer transition flex items-center gap-3">
                        <svg className="w-4 h-4 opacity-70" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d={menu.icon}/></svg>
                        {menu.name}
                    </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="p-3 border-t border-white/10 space-y-3">
          <Link href="/Admin/login" className="flex items-center gap-2.5 text-xs text-slate-400 hover:text-white transition px-3 py-1.5 font-medium">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
            Keluar Akun
          </Link>
        </div>
      </aside>

      {/* KONTEN UTAMA */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Header Atas */}
        <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-20">
          <div>
            <h1 className="text-base font-bold text-slate-900">Pencatatan Tagihan</h1>
            <p className="text-[11px] text-slate-500">Generate invoice dari tindakan medis</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-600 flex items-center gap-2">
              <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
              {tanggalHariIni}
            </div>

            <button className="w-9 h-9 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-center relative hover:bg-slate-100 transition text-slate-600">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>
              <span className="w-2 h-2 bg-rose-500 rounded-full absolute top-2 right-2"></span>
            </button>

            <div 
              onClick={() => router.push('/Admin/pengaturan')}
              className="flex items-center gap-2.5 pl-2 pr-3 py-1 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl cursor-pointer transition"
            >
              <div className="w-7 h-7 bg-[#2EC4B6] rounded-full text-white font-bold text-xs flex items-center justify-center shadow-sm">
                {namaAdmin.charAt(0)}
              </div>
              <div className="text-left">
                <p className="text-xs font-bold text-slate-900 leading-tight">{namaAdmin}</p>
                <p className="text-[10px] text-slate-400">{jabatanAdmin}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Isi Halaman */}
        <main className="p-6 space-y-6 overflow-y-auto">
          <p className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">Daftar Invoice</p>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Sisi Kiri: Daftar Invoice */}
            <div className="lg:col-span-5 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm space-y-3 max-h-[70vh] overflow-y-auto">
              {loading ? (
                <p className="text-xs text-slate-400 p-4 text-center">Memuat invoice…</p>
              ) : visits.length === 0 ? (
                <p className="text-xs text-slate-400 p-4 text-center">Belum ada invoice.</p>
              ) : (
                visits.map((v) => (
                  <div
                    key={v.id}
                    onClick={() => setSelectedVisit(v)}
                    className={`p-4 rounded-2xl cursor-pointer space-y-2 border transition ${
                      selectedVisit?.id === v.id
                        ? 'border-2 border-[#2EC4B6] bg-teal-50/30'
                        : 'border border-slate-200 hover:border-[#2EC4B6]/50'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-[#2EC4B6]">{v.invoice_number}</span>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          v.payment_status === 'paid'
                            ? 'bg-emerald-100 text-emerald-700'
                            : v.payment_status === 'partial'
                            ? 'bg-amber-100 text-amber-700'
                            : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        {statusLabel(v.payment_status)}
                      </span>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900">{v.patient?.name ?? 'Pasien'}</p>
                      <p className="text-[10px] text-slate-400">{tgl(v.visit_date)} · {v.doctor?.name ?? '—'}</p>
                    </div>
                    <p className="text-xs font-bold text-slate-900 pt-1">{rupiah(v.total)}</p>
                  </div>
                ))
              )}
            </div>

            {/* Sisi Kanan: Detail Invoice / Form Tagihan Baru */}
            <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-6">
              {selectedVisit ? (
                <>
                  {/* Header Invoice Detail */}
                  <div className="flex justify-between items-start pb-4 border-b border-slate-100">
                    <div>
                      <h3 className="text-base font-bold text-slate-900">{selectedVisit.invoice_number}</h3>
                      <p className="text-xs text-slate-500">
                        Pasien: {selectedVisit.patient?.name ?? '—'} · {tgl(selectedVisit.visit_date)}
                      </p>
                      {selectedVisit.complaint && (
                        <p className="text-xs text-slate-400 mt-1">Keluhan: {selectedVisit.complaint}</p>
                      )}
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${
                        selectedVisit.payment_status === 'paid'
                          ? 'bg-emerald-100 text-emerald-700'
                          : selectedVisit.payment_status === 'partial'
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {statusLabel(selectedVisit.payment_status)}
                    </span>
                  </div>

                  {/* Rincian Tindakan */}
                  <div className="space-y-4 text-xs">
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 tracking-wider uppercase mb-2">Jasa Konsultasi / Tindakan</p>
                      {(selectedVisit.items ?? []).length === 0 ? (
                        <p className="text-slate-400">Tidak ada rincian tindakan.</p>
                      ) : (
                        selectedVisit.items!.map((it) => (
                          <div key={it.id} className="flex justify-between items-center py-1">
                            <span className="font-medium text-slate-700">{it.tarif_name} {it.quantity > 1 ? `x${it.quantity}` : ''}</span>
                            <span className="font-bold text-[#2EC4B6]">{rupiah(it.total)}</span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Total Tagihan */}
                  <div className="pt-4 border-t border-slate-200 flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-900">Total Tagihan</span>
                    <span className="text-base font-bold text-[#2EC4B6]">{rupiah(selectedVisit.total)}</span>
                  </div>

                  {/* Tombol Aksi */}
                  <div className="flex items-center gap-3 pt-2">
                    <button 
                      onClick={handleLanjutPembayaran}
                      className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition shadow-sm text-center flex items-center justify-center gap-2"
                    >
                      <span></span> Lanjut ke Pembayaran
                    </button>
                    <button 
                      onClick={() => setSelectedVisit(null)}
                      className="flex-1 py-3 bg-[#2EC4B6] hover:bg-[#259f93] text-white rounded-xl text-xs font-bold transition shadow-sm text-center"
                    >
                      + Buat Tagihan Baru
                    </button>
                  </div>
                </>
              ) : (
                <form onSubmit={handleBuatTagihan} className="space-y-5 text-xs">
                  <div className="pb-3 border-b border-slate-100">
                    <h3 className="text-base font-bold text-slate-900">Buat Tagihan Baru</h3>
                    <p className="text-xs text-slate-500">Catat kunjungan & generate invoice</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-slate-500 font-semibold mb-1">Pasien</label>
                      <select
                        value={form.patient_id}
                        onChange={(e) => setForm({ ...form, patient_id: e.target.value })}
                        required
                        className="w-full px-4 py-2.5 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-[#2EC4B6] bg-white"
                      >
                        <option value="">— Pilih pasien —</option>
                        {patients.map((p) => (
                          <option key={p.id} value={p.id}>{p.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-slate-500 font-semibold mb-1">Dokter</label>
                      <select
                        value={form.doctor_id}
                        onChange={(e) => setForm({ ...form, doctor_id: e.target.value })}
                        required
                        className="w-full px-4 py-2.5 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-[#2EC4B6] bg-white"
                      >
                        <option value="">— Pilih dokter —</option>
                        {doctors.map((d) => (
                          <option key={d.id} value={d.id}>{d.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-slate-500 font-semibold mb-1">Tanggal Kunjungan</label>
                      <input
                        type="date"
                        value={form.visit_date}
                        onChange={(e) => setForm({ ...form, visit_date: e.target.value })}
                        required
                        className="w-full px-4 py-2.5 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-[#2EC4B6]"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-500 font-semibold mb-1">Keluhan (opsional)</label>
                      <input
                        type="text"
                        placeholder="Contoh: Gigi berlubang"
                        value={form.complaint}
                        onChange={(e) => setForm({ ...form, complaint: e.target.value })}
                        className="w-full px-4 py-2.5 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-[#2EC4B6]"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="block text-slate-500 font-semibold">Tindakan</label>
                      <button
                        type="button"
                        onClick={() => setForm({ ...form, items: [...form.items, { tindakan_id: '', quantity: 1 }] })}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition"
                      >
                        + Tambah Baris
                      </button>
                    </div>
                    <div className="space-y-2">
                      {form.items.map((it, idx) => (
                        <div key={idx} className="flex gap-2">
                          <select
                            value={it.tindakan_id}
                            onChange={(e) => updateItem(idx, { tindakan_id: e.target.value })}
                            required
                            className="flex-1 px-3 py-2.5 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-[#2EC4B6] bg-white"
                          >
                            <option value="">— Pilih tindakan —</option>
                            {tindakans.map((t) => (
                              <option key={t.id} value={t.id}>
                                {t.name} — {rupiah(t.price)}
                              </option>
                            ))}
                          </select>
                          <input
                            type="number"
                            min={1}
                            value={it.quantity}
                            onChange={(e) => updateItem(idx, { quantity: Math.max(1, Number(e.target.value) || 1) })}
                            className="w-16 px-2 py-2.5 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-[#2EC4B6] text-center"
                          />
                          {form.items.length > 1 && (
                            <button
                              type="button"
                              onClick={() => setForm({ ...form, items: form.items.filter((_, i) => i !== idx) })}
                              className="px-3 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl font-bold transition"
                            >
                              ✕
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-200 flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-900">Total Tagihan</span>
                    <span className="text-base font-bold text-[#2EC4B6]">{rupiah(subtotal)}</span>
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3 bg-[#2EC4B6] hover:bg-[#259f93] disabled:opacity-60 text-white rounded-xl text-xs font-bold transition shadow-sm"
                  >
                    {submitting ? 'Menyimpan…' : 'Buat & Terbitkan Invoice'}
                  </button>
                </form>
              )}
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}