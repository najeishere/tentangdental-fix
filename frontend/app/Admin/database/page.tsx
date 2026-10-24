'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { fetchApi } from '@/utils/api';

type TableInfo = {
  name: string;
  count: number;
  columns: { name: string; type: string; nullable: boolean; default: unknown }[];
};

type TableData = { table: string; columns: string[]; rows: { [key: string]: unknown }[]; last_page: number; current_page: number };

export default function DatabaseAdminPage() {
  const router = useRouter();
  const [tables, setTables] = useState<TableInfo[]>([]);
  const [selected, setSelected] = useState('');
  const [data, setData] = useState<TableData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      router.replace('/login');
      return;
    }

    fetchApi('/admin/database/tables')
      .then((json) => {
        const items = json?.data?.tables ?? [];
        setTables(items);
        if (items[0]) setSelected(items[0].name);
      })
      .catch((err) => setError(err instanceof Error ? err.message : 'Gagal memuat database.'))
      .finally(() => setLoading(false));
  }, [router]);

  useEffect(() => {
    if (!selected) return;
    setData(null);
    fetchApi(`/admin/database/${encodeURIComponent(selected)}?per_page=25`)
      .then((json) => {
        const page = json?.data?.rows;
        setData(page ? { ...page, rows: page.data ?? [], table: json.data.table, columns: json.data.columns } : null);
      })
      .catch((err) => setError(err instanceof Error ? err.message : 'Gagal memuat isi tabel.'));
  }, [selected]);

  return (
    <main className="min-h-screen bg-[#f4f7f7] text-slate-900">
      <header className="border-b border-slate-200 bg-white px-6 py-5">
        <div className="mx-auto flex max-w-[1500px] items-center justify-between gap-4">
          <div>
            <Link href="/Admin/dashboard" className="text-xs font-semibold text-teal-600">← Kembali ke dashboard</Link>
            <h1 className="mt-2 text-2xl font-bold tracking-tight">Database Explorer</h1>
            <p className="mt-1 text-sm text-slate-500">Viewer read-only untuk data aplikasi. Kolom sensitif tidak ditampilkan.</p>
          </div>
          <div className="rounded-2xl bg-teal-50 px-4 py-3 text-right text-xs text-teal-800">
            <p className="font-bold">Akses Admin</p>
            <p>Data berasal dari server</p>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-[1500px] gap-5 p-6 lg:grid-cols-[280px_1fr]">
        <aside className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
          <div className="mb-3 flex items-center justify-between px-2">
            <h2 className="text-sm font-bold">Tabel database</h2>
            <span className="rounded-full bg-slate-100 px-2 py-1 text-[11px] font-semibold text-slate-500">{tables.length}</span>
          </div>
          {loading ? <p className="px-2 py-4 text-sm text-slate-400">Memuat tabel...</p> : (
            <div className="max-h-[calc(100vh-190px)] space-y-1 overflow-y-auto">
              {tables.map((table) => (
                <button key={table.name} onClick={() => { setSelected(table.name); setError(''); }} className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm transition ${selected === table.name ? 'bg-teal-600 font-semibold text-white' : 'text-slate-600 hover:bg-slate-50'}`}>
                  <span className="truncate">{table.name}</span>
                  <span className={`ml-2 text-xs ${selected === table.name ? 'text-teal-100' : 'text-slate-400'}`}>{table.count}</span>
                </button>
              ))}
            </div>
          )}
        </aside>

        <section className="min-w-0 rounded-2xl border border-slate-200 bg-white shadow-sm">
          {error && <div className="m-5 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
          {!selected ? <div className="p-10 text-center text-slate-400">Pilih tabel untuk melihat data.</div> : data ? (
            <>
              <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
                <div><h2 className="font-bold">{data.table}</h2><p className="text-xs text-slate-400">{data.rows.length} baris ditampilkan</p></div>
                <span className="rounded-lg bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-500">Read only</span>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full text-left text-xs">
                  <thead className="bg-slate-50 text-[11px] uppercase tracking-wide text-slate-500"><tr>{data.columns.map((column) => <th key={column} className="whitespace-nowrap px-4 py-3 font-bold">{column}</th>)}</tr></thead>
                  <tbody className="divide-y divide-slate-100">{data.rows.map((row, index) => <tr key={index} className="hover:bg-teal-50/40">{data.columns.map((column) => <td key={column} className="max-w-[280px] whitespace-nowrap px-4 py-3 text-slate-700">{String(row[column] ?? '—')}</td>)}</tr>)}</tbody>
                </table>
              </div>
              {data.rows.length === 0 && <p className="p-10 text-center text-sm text-slate-400">Tabel ini belum memiliki data.</p>}
            </>
          ) : <div className="p-10 text-center text-sm text-slate-400">Memuat isi tabel...</div>}
        </section>
      </div>
    </main>
  );
}
