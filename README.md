# TentangDental

Sistem informasi manajemen klinik gigi dengan frontend Next.js dan backend Laravel.

## Struktur

```text
backend/    Laravel 13 API
frontend/   Next.js 16 + React 19 + Tailwind CSS v4
```

## Menjalankan Backend

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate --seed
php artisan serve --port=8002
```

API tersedia di `http://127.0.0.1:8002/api`.

## Menjalankan Frontend

```bash
cd frontend
npm install
npm run dev
```

Buka `http://localhost:3000`. URL API dapat diubah melalui `NEXT_PUBLIC_API_URL`.

## Akun Demo

| Role | Email | Password |
|---|---|---|
| Admin | `admin@tentangdental.id` | `password` |
| Kasir | `kasir@tentangdental.id` | `password` |
| Dokter | `sari@tentangdental.id` | `password` |
| Pasien | `budi@example.com` | `password` |

## Fitur Server

- Billing dan invoice tersimpan di MariaDB melalui API.
- Pembayaran cash, QRIS, transfer, verifikasi, piutang, dan ledger.
- Master tindakan, inventory, pengiriman lab, biaya, laporan, dan dashboard.
- Manajemen antrean tersimpan di tabel `queues` melalui `/api/queues`.
- `/Admin/database` adalah viewer read-only untuk admin; kolom password dan token tidak dikembalikan.

## Pengujian

```bash
cd backend && php artisan test
cd frontend && npx tsc --noEmit && npm run lint && npm run build
```

## Deployment

Vercel hanya menjalankan frontend Next.js. Backend Laravel dan MariaDB harus dideploy ke server terpisah. Set `NEXT_PUBLIC_API_URL` di environment Vercel ke URL API Laravel production.
