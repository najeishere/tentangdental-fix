# Tentang Dental — API Backend (Sistem Informasi Laporan Keuangan Klinik Gigi)

Backend REST API untuk aplikasi manajemen keuangan klinik "Tentang Dental".
Dibangun dengan **Laravel 12 + PHP 8.5 + MariaDB**. Dikonsumsi frontend (React + TanStack Start).

## Stack & Setup

- PHP >= 8.5, Composer, MariaDB (port 3306)
- Package: `laravel/sanctum`, `spatie/laravel-permission`, `barryvdh/laravel-dompdf`

```bash
composer install
cp .env.example .env        # sesuaikan kredensial DB
php artisan migrate:fresh --seed
php artisan serve --port 8000
```

Semua endpoint (kecuali 2 publik) butuh `Authorization: Bearer <token>`.
Base URL dev: `http://127.0.0.1:8000/api`.

## Role & Akun Demo (password semua: `password`) — model **3 role** selaras desain Figma

| Role   | Email                   | Keterangan                                          |
|--------|-------------------------|-----------------------------------------------------|
| Admin  | admin@tentangdental.id  | Owner: master data, pengeluaran, laporan            |
| Admin  | kasir@tentangdental.id  | Front office (kasir): kunjungan, pembayaran, piutang |
| Dokter | sari@tentangdental.id   | Spesialis Konservasi Gigi                           |
| Dokter | andi@tentangdental.id   | Spesialis Bedah Mulut                               |
| Pasien | budi@example.com        | Invoice & tagihan sendiri                           |
| Pasien | citra@example.com       |                                                        |
| Pasien | dedi@example.com        |                                                        |
| Pasien | eka@example.com         |                                                        |

> `kasir@tentangdental.id` memakai role `admin` (front office) — sesuai desain Figma
> yang menggabungkan fungsi kasir + keuangan ke peran "Admin".

## Akses Endpoint per Role (acuan implementasi frontend)

| Role   | Panel utama yang boleh diakses                          |
|--------|---------------------------------------------------------|
| Admin  | Semua `/api/admin/*`, `/api/cashier/*`, operasional kasir |
| Dokter | `/api/doctor/*`, `/api/dashboard`                       |
| Pasien | `/api/customer/*`, `/api/dashboard`                     |

Akses dijaga middleware `auth:sanctum` + `checkRole` (admin, doctor, customer).

## Payload Standar

```jsonc
// Sukses
{ "success": true, "data": { ... } }

// Error
{ "success": false, "message": "..." }   // 401/403/404/422
```

## Endpoint API (43 routes)

### 1. Auth & Umum
| Method | Route                | Akses  | Keterangan                                |
|--------|----------------------|--------|-------------------------------------------|
| POST   | `/auth/login`        | Publik | Login → `{access_token, token_type, user, admin}` |
| POST   | `/auth/logout`       | Login  | Cabut token aktif                          |
| GET    | `/me`                | Login  | Profil + role saat ini                     |
| GET    | `/clinic/pubinfo`    | Publik | Info klinik + QRIS statis (halaman bayar)  |

### 2. Dashboard
| Method | Route       | Akses | Keterangan |
|--------|-------------|-------|------------|
| GET    | `/dashboard`| Semua role login | Ringkasan adaptif per role |

- **Admin**: `totals` (revenue, komisi akrual, expenses, net clinic profit), `daily` (visits_today, cash & qris income hari ini = "kas harian"), open_receivables, visits_this_month, recent_visits.
- **Dokter**: `total_commission` periode, `payout_received`, `pending_commission`, `visits_handled`, `patients_handled`.
- **Pasien**: `total_visits`, `total_spent`, `outstanding_balance` + riwayat kunjungan.

### 3. Operasional Kasir (`/api`) — role `admin`
| Method | Route                              | Keterangan                             |
|--------|------------------------------------|----------------------------------------|
| POST   | `/visits`                          | Buat kunjungan + item tindakan         |
| GET    | `/visits`                          | Daftar kunjungan (filter, pivot)       |
| PUT    | `/visits/{visit}`                  | Ubah invoice (bila sudah ada pembayaran, hanya tanggal & keluhan) |
| DELETE | `/visits/{visit}`                  | Hapus invoice (hanya bila belum ada pembayaran) |
| POST   | `/payments`                        | Catat pembayaran (tunai/qris)          |
| POST   | `/payments/{payment}/verify`       | Konfirmasi pembayaran QRIS pending     |
| POST   | `/receivables/{receivable}/pay`    | Terima pelunasan piutang               |
| GET    | `/cashier/receivables`             | Daftar piutang + `total_outstanding`   |

### 4. Pasien (`/api/customer`) — role `admin,customer`
| Method | Route                        | Keterangan                            |
|--------|------------------------------|---------------------------------------|
| GET    | `/customer/invoices`         | Invoice milik pasien sendiri (paginate)|
| GET    | `/customer/invoices/{visit}` | Detail invoice miliknya (ownership dicek) |
| GET    | `/customer/outstanding`      | Tagihan belum lunas                    |
| GET    | `/customer/payments`         | Riwayat pembayaran sendiri            |

### 5. Dokter (`/api/doctor`) — role `admin,doctor`
| Method | Route                 | Keterangan                        |
|--------|-----------------------|-----------------------------------|
| GET    | `/doctor/treatments`  | Daftar tindakan yang dapat ditangani |
| GET    | `/doctor/commissions` | Komisi periode berjalan           |
| GET    | `/doctor/payslips`    | Slip gaji / rekap payroll         |

### 6. Master Data (`/api/admin`) — role `admin`
| Method | Route                              | Keterangan                |
|--------|------------------------------------|---------------------------|
| GET    | `/admin/options`                   | Daftar pasien + dokter (untuk form billing) |
| GET    | `/admin/doctors`                   | Daftar dokter + jumlah kunjungan |
| POST   | `/admin/doctors`                   | Tambah akun dokter baru   |
| PUT    | `/admin/doctors/{doctor}`          | Ubah data/akses dokter (password opsional) |
| DELETE | `/admin/doctors/{doctor}`          | Hapus dokter (kecuali punya komisi) |
| GET    | `/admin/tindakans`                 | Daftar tindakan           |
| POST   | `/admin/tindakans`                 | Tambah tindakan           |
| PUT    | `/admin/tindakans/{tindakan}`      | Ubah tindakan             |
| DELETE | `/admin/tindakans/{tindakan}`      | Hapus tindakan            |
| GET    | `/admin/inventory`                 | Stok inventory            |
| POST   | `/admin/inventory/items`           | Tambah item stok          |
| POST   | `/admin/inventory/stock-in`        | Stok masuk                |
| POST   | `/admin/inventory/stock-out`       | Stok keluar               |
| GET    | `/admin/expenses`                  | Daftar pengeluaran        |
| POST   | `/admin/expenses`                  | Catat pengeluaran         |
| GET    | `/admin/expense-categories`        | Kategori biaya            |
| PUT    | `/admin/clinic/qris`               | Update QRIS statis klinik |

### 7. Laporan (`/api/admin/reports`) — role `admin`
| Method | Route                          | Keterangan                                  |
|--------|--------------------------------|---------------------------------------------|
| GET    | `/admin/reports/profit-and-loss` | Laba-rugi basis kas + memo komisi akrual   |
| GET    | `/admin/reports/cash-flow`     | Arus kas (inflow cash/qris, outflow)        |
| GET    | `/admin/reports/per-doctor`    | Realisasi & komisi per dokter               |
| GET    | `/admin/reports/receivables`   | Piutang (sama dgn `/cashier/receivables`)   |
| GET    | `/admin/reports/inventory`     | Nilai stok & mutasi                         |
| GET    | `/admin/reports/payrolls`      | Rekap gaji/komisi per dokter                |

Laporan menerima `?from=YYYY-MM-DD&to=YYYY-MM-DD` (default: awal–akhir bulan berjalan).

## Metode Akuntansi

- **Pendapatan (basis kas)**: `Payment` berstatus `confirmed` dalam periode.
- **Beban (basis kas)**: `LedgerEntry` tipe `expense` (sewa, gaji staf, komisi dokter yg dibayar via payroll, biaya operasional).
- **Komisi akrual** ditampilkan sebagai memo `doctor_commissions_accrued_period` (tidak memengaruhi kas sampai dibayar).
- **Piutang**: `Receivable` (status `outstanding`/`partial`/`settled`); pelunasan menambah kas.
- **Komisi dokter** dicatat saat pembuatan kunjungan dengan `komisi_persen` per tindakan (default 40% dokter / 60% klinik, bisa diedit per tindakan), berkolom `commission_date = visit_date`.

## Alur Operasional Utama

1. Kasir buat kunjungan: `POST /api/visits` — menghasilkan invoice, piutang bila belum lunas, dan **accrue komisi dokter** otomatis.
2. Pembayaran: tunai/QRIS langsung `confirmed`; QRIS menunggu → `POST /api/payments/{payment}/verify`.
3. Pelunasan piutang: `POST /api/receivables/{receivable}/pay`.
4. Gaji dokter direkap per bulan (lihat `reports/payrolls`); pembayarannya menjadi `LedgerEntry expense account=salary`.

## Keamanan & Akses per Role

- `checkRole:admin` pada operasional kasir; `customer/*` hanya `admin,customer`; `doctor/*` hanya `admin,doctor`; `/api/admin/*` khusus `admin`.
- Invoice pasien divalidasi kepemilikan (`patient_id === user.id`) → 403 bila bukan miliknya.
- 401 untuk token tidak valid (JSON), 403 untuk role tidak diizinkan.

## Keselarasan dengan Desain Figma

Desain Figma (`Klinik Gigi Management System`, owner Fazza) memakai **3 role**:
**Pasien**, **Tim Klinik (= dokter)**, **Admin** (billing + kasir + keuangan)
— sudah disinkronkan ke model 3-role backend.

**Design token dari Figma**: font *Inter*, teal primer `#1cb5bd` / `#11858c`,
active background `#e8f8f8`, gaya clean & modern. Halaman login memakai
toggle *Masuk/Daftar* + tombol **"Demo cepat — pilih peran"** (masuk demo
sebagai Pasien / Tim Klinik / Admin) — frontend dapat memetakan ke 3 akun demo di atas.

**Fitur desain yang belum ada di backend saat ini** (perlu dibangun di versi lanjutan):
rekam medis & diagnosa, pengiriman cetakan ke lab dental, pencatatan BMHP,
antrean/registrasi front office. Backend saat ini fokus ke **billing, pembayaran,
piutang, komisi dokter (40%), dan laporan keuangan (laba-rugi, arus kas, per dokter, payroll)**.

## Struktur Tabel Utama

`users` (peran Spatie) · `tindakans` · `inventory_items` · `inventory_transactions` ·
`expense_categories` · `expenses` · `visits` (kunjungan) · `invoices` (tagihan + status
pembayaran & nomor INV-...) · `invoice_items` (item tagihan, dengan `komisi_persen`) ·
`payments` · `receivables` · `commission_entries` · `doctor_payrolls` ·
`ledger_entries` · `settings`
## Deployment ke Render (backend)

Repo: `najeishere/tentangdental-be`. Sudah ada `Dockerfile`, `render.yaml`, dan `start.sh`, jadi deploy Cuma klik.

1. Buat akun di https://render.com (login via GitHub).
2. Buat DB MySQL gratis **(TiDB Serverless**, MySQL-compatible, tanpa kartu kredit):
   - https://tidbcloud.com → New Cluster (Serverless, free) → simpan *Connection string*.
   - Nilai yang dipakai: `HOST` (mis. `gateway01.ap-southeast-1.prod.aws.tidbcloud.com`), `PORT` (`4000`), `DATABASE` (mis. `tentangdental`), `USERNAME`, `PASSWORD`.
   - Unduh CA file `ca.pem` dari halaman TiDB (opsi download di dashboard).
   - Alternatif: Aiven MySQL gratis (https://console.aiven.io) — port `3306`, wajib SSL (pakai `ca.pem` juga).
3. Di Render: **New → Blueprint** → pilih repo `tentangdental-be` → ikuti `render.yaml`.
4. Isi **Environment** (berisi dari render.yaml, lengkapi yang sync:false):
   - `APP_URL` = `https://<nama-service>.onrender.com`
   - `APP_KEY` = hasil `php artisan key:generate --show` (atau dari kolom berikut)
   - `DB_HOST`, `DB_PORT`, `DB_DATABASE`, `DB_USERNAME`, `DB_PASSWORD` = dari DB gratis
   - `MYSQL_ATTR_SSL_CA` = path CA di image; cara praktis: taruh `ca.pem` di root repo lalu isi `/var/www/html/ca.pem`
5. **Manual Deploy** → tunggu build (2–5 menit). Catatan: di paket free, service tidur setelah ~15 menit tidak dipakai; panggilan pertama butuh ~1 menit.
6. Cek: `curl https://<nama-service>.onrender.com/api/clinic/pubinfo` → harus `200`.

### Koneksi frontend Vercel ke backend Render
Di dashboard Vercel (proyek `tentangdental-fe` → Settings → Environment Variables):
- `VITE_API_URL` = `https://<nama-service>.onrender.com/api`
- Redeploy (atau `vercel --prod`).
