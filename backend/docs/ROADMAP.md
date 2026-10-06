# Roadmap & Kesenjangan Fitur: Desain Figma vs Backend

Dokumen ini mencatat fitur yang sudah ada, yang belum ada, dan langkah prioritas untuk menyempurnakan sistem sampai sesuai desain Figma (+"Tentang Dental").

---

## Status Fitur (Q & A cepat)

| # | Fitur Figma (Role) | Backend | Catatan |
|---|---|---|---|
| 1 | **Login / Register** | ✅ Login | Belum ada registrasi pasien |
| 2 | **Dashboard adaptif (3 role)** | ✅ GET /api/dashboard | Konten otomatis sesuai role |
| 3 | **Kas Harian (admin)** | ✅ `daily` pada dashboard admin | |
| 4 | **Buat kunjungan & generate invoice** | ✅ POST /api/visits | Auto buat invoice + accrue komisi |
| 5 | **Bayar tunai** | ✅ POST /api/payments | Status langsung confirmed |
| 6 | **Bayar QRIS + verifikasi** | ✅ POST /api/payments + /verify | Pending → confirmed |
| 7 | **Piutang & pelunasan** | ✅ GET/POST receivables | status: outstanding/partial/settled |
| 8 | **Master tindakan** | ✅ CRUD /admin/tindakans | Price, komisi_persen, is_active |
| 9 | **Inventory stok** | ✅ /admin/inventory | stock-in / stock-out |
| 10 | **Catat pengeluaran** | ✅ POST /admin/expenses | Gaji staf, sewa, utilitas, dll |
| 11 | **Laba Rugi (basis kas)** | ✅ GET /admin/reports/profit-and-loss | Breakdown, memo komisi akrual |
| 12 | **Arus Kas** | ✅ GET /admin/reports/cash-flow | Cash + QRIS inflow vs outflow |
| 13 | **Realisasi & Bagi Hasil per Dokter** | ✅ GET /admin/reports/per-doctor | clinic_share, commission %, visits_count |
| 14 | **Slip Gaji / Payroll Dokter** | ✅ GET /admin/reports/payrolls | Per bulan, status paid |
| 15 | **Export PDF laporan** | ✅ GET /admin/reports/export-pdf | `report=profit-and-loss` |
| 16 | **Komisi Dokter (akrual, per tindakan)** | ✅ GET /api/doctor/commissions | commission_date = visit_date |
| 17 | **Update QRIS statis** | ✅ PUT /admin/clinic/qris | |
| 18 | **Info klinik (publik)** | ✅ GET /api/clinic/pubinfo | Untuk halaman bayar |
| 19 | **Antrean / Registrasi** | ❌ | Lihat Fase 1 di bawah |
| 20 | **Rekam Medis & Diagnosa** | ❌ | Lihat Fase 1 |
| 21 | **Tindakan: Langsung vs Lab Dental** | ❌ (selain tindakan dasar) | Lihat Fase 1 |
| 22 | **Pengiriman Cetakan ke Lab Vendor** | ❌ | Lihat Fase 2 |
| 23 | **BMHP (Bahan Medis Habis Pakai)** | ❌ | Lihat Fase 2 |
| 24 | **Register pasien baru (self-service)** | ❌ | Lihat Fase 3 |

---

## Fase 1 — Prioritas Tinggi (satu sprint, ± 1 minggu)

**Tujuan**: Fungsi klinis dasar supaya dokter bisa mencatat pemeriksaan, dan antrean pasien tercatat.

### 1.1 Antrean & Registrasi
- Tabel baru `queues`:
  - `id, patient_id, doctor_id, queue_number, status (waiting|in_progress|done), scheduled_at, registered_by, notes, timestamps`
- Endpoints:
  - `POST /api/admin/queues` — admin mendaftarkan pasien masuk antrean
  - `GET /api/admin/queues?status=waiting` — daftar antrean (admin panel)
  - `GET /api/doctor/queues` — antrean dokter sendiri (filter hari ini)
  - `GET /api/customer/queues` — antrean pasien sendiri
  - `PUT /api/admin/queues/{queue}/status` — ubah status (in_progress / done)
- Kompatibilitas: endpoint lama `/api/visits` tidak berubah; antrean ini pra-kunjungan.

### 1.2 Rekam Medis
- Tabel `medical_records`:
  - `id, visit_id (nullable — bisa diisi saat kunjungan dibuat), patient_id, doctor_id, chief_complaint, anamnesis, objective_findings, diagnosis, treatment_plan, notes, created_at`
- Endpoints:
  - `POST /api/doctor/medical-records` — dokter isi rekam medis untuk suatu kunjungan
  - `GET /api/doctor/medical-records?patient_id=` — riwayat rekam medis pasien tertentu
  - `GET /api/customer/medical-records` — pasien melihat rekam medis sendiri (read-only)
- Integrasi: saat `POST /api/visits` oleh admin, `medical_records` bisa diisi nanti oleh dokter. Bisa juga dibuat dari antrean saat status in_progress.

### 1.3 Tindakan Dokter (dari panel Tim Klinik)
Saat ini tindakan hanya dicatat oleh admin via `POST /api/visits`. Dalam desain Figma, **dokter yang menginput tindakan** dari antrean hari ini.
- Opsional: tambah `POST /api/doctor/visits` (atau `POST /api/doctor/queue/{id}/visit`) yang memungkinkan dokter mencatat tindakan dari antrean → otomatis membuat visit + invoice.
- Atau minimal: `PUT /api/doctor/visits/{visit}/tindakan` — dokter menambah item tindakan yang sudah ada ke visit yang sudah dibuat admin.

---

## Fase 2 — Fungsi Laboratorium & BMHP (sprint kedua)

### 2.1 Modul Lab Dental
Tabel `lab_orders`:
- `id, visit_id, patient_name, doctor_id, lab_vendor, tooth_position, shade, instruction, status (sent|received|completed), sent_date, received_date, timestamps`

Endpoints:
- `POST /api/doctor/lab-orders` — kirim cetakan gigi ke vendor
- `GET /api/doctor/lab-orders` — daftar pengiriman milik dokter sendiri
- `PUT /api/admin/lab-orders/{id}/status` — admin/koordinator update status
- `GET /api/admin/reports/lab-costs` — laporan biaya lab per vendor (opsional)

### 2.2 BMHP (Bahan Medis Habis Pakai)
Sudah ada tabel `inventory_items` dan `inventory_transactions`. Yang perlu ditambahkan:

Tabel `visit_bmhp` (BMHP yang dipakai per kunjungan):
- `id, visit_id, inventory_item_id, quantity, unit_cost, total, timestamps`

Endpoints:
- `POST /api/doctor/visits/{visit}/bmhp` — dokter/perawat mencatat BMHP yang dipakai
- `GET /api/doctor/visits/{visit}/bmhp` — daftar BMHP per kunjungan
- `GET /api/admin/reports/bmhp` — total pemakaian BMHP per bulan/vendor

Integrasi: total BMHP per visit otomatis ditambahkan ke invoice (pada field `bmhp_total` di visits, atau sebagai item invoice tambahan).

### 2.3 Perhitungan Lab + BMHP ke Invoice
Ketika visit dibuat/diupdate, total tagihan otomatis menjumlahkan:
- Jasa tindakan (sudah ada)
- Biaya lab (jika ada)
- Biaya BMHP (jika ada)

Bisa ditambah kolom `lab_total` dan `bmhp_total` pada tabel `visits` atau dihitung real-time.

---

## Fase 3 — Penyelesaian UI/UX & Fitur Pelengkap

| Fitur | Keterangan | Estimasi |
|---|---|---|
| Register pasien baru | `POST /api/auth/register` + validasi email | 0.5 hari |
| Profil pasien | `GET/PUT /api/customer/profile` | 0.5 hari |
| Settings klinik | `GET /api/admin/clinic/settings` + update nama, alamat, logo, dll | 1 hari |
| Notifikasi WhatsApp (opsional) | Integrasi WA API untuk kirim invoice/notifikasi pembayaran | — |
| Riwayat pembayaran per pasien (detail) | `GET /api/customer/payments` sudah ada; tinggal desain | 0.5 hari |
| Export PDF invoice per kunjungan | Barcode/QR di PDF; endpoint export per visit | 1 hari |

---

## Catatan Teknis untuk Tim Frontend

### Warna & Font (dari Figma)
- Font utama: **Inter** (tersedia via Google Fonts / npm `@fontsource/inter`)
- Primary teal: `#1cb5bd` / hover gelap `#11858c`
- Active/selected bg: `#e8f8f8`
- Teks: gelap untuk heading, abu-abu untuk secondary

### Struktur Navigasi Sidebar (per role)

**Admin/Front Office**
```
Beranda (dashboard + kas harian)
Registrasi & Antrean
Pencatatan Tagihan  → (di dalam: list kunjungan + modal bayar)
Piutang
Laba Rugi
Arus Kas
Bagi Hasil / Per Dokter
Payroll / Slip Gaji
Master: Tindakan, Inventory, Pengeluaran, QRIS
Laporan & Export PDF
```

**Tim Klinik (Dokter)**
```
Beranda (stat komisi + visit today)
Antrean Hari Ini
Rekam Medis
Tindakan (Langsung / Lab)
Pengiriman Lab
BMHP
Komisi & Slip Gaji
```

**Pasien**
```
Beranda (stat kunjungan, tagihan outstanding)
Antrean & Jadwal
Riwayat Pemeriksaan + Rekam Medis (baca)
Tagihan & Pembayaran
```

### Contoh Komponen API Client (React)

```typescript
// api.ts
const BASE = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

export async function api<T = unknown>(path: string, opts: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('token');
  const res = await fetch(`${BASE}${path}`, {
    ...opts,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...opts.headers,
    },
  });
  if (res.status === 401) { window.location.href = '/login'; throw new Error('401'); }
  if (!res.ok) throw new Error(`${res.status} ${await res.text()}`);
  return res.json();
}
```