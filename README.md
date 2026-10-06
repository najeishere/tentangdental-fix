# TentangDental-Fix

Sistem informasi manajemen klinik gigi: **frontend** (Next.js) dan **backend** (Laravel) dalam satu repo.

## Struktur

```
tentangdental-fix/
├── backend/    # Laravel 12 API (PHP 8.2+)
└── frontend/   # Next.js 16 + Tailwind CSS v4
```

## Prasyarat

- PHP 8.2+ dengan ekstensi `pdo_mysql`, `mbstring`
- Composer
- Node.js 20+ dan npm
- MariaDB / MySQL

## Menjalankan Backend

```bash
cd backend
composer install            # skip jika folder vendor sudah ada
cp .env.example .env
php artisan key:generate
# sesuaikan DB_DATABASE, DB_USERNAME, DB_PASSWORD di .env
php artisan migrate --seed   # membuat tabel + akun demo
php artisan serve --port=8002
```

API tersedia di `http://127.0.0.1:8002/api`.

## Menjalankan Frontend

```bash
cd frontend
npm install                 # skip jika folder node_modules sudah ada
npm run dev
```

Buka `http://localhost:3000` — otomatis diarahkan ke halaman login.

Frontend memanggil backend di `http://127.0.0.1:8002/api` (bisa diubah lewat
variabel lingkungan `NEXT_PUBLIC_API_URL`).

## Akun Demo

| Role    | Email                  | Password | Halaman login        |
|---------|------------------------|----------|----------------------|
| Admin   | admin@tentangdental.id | password | `/Admin/login`       |
| Kasir   | kasir@tentangdental.id | password | `/Admin/login`       |
| Dokter  | sari@tentangdental.id  | password | `/Klinik/login`      |
| Pasien  | budi@example.com       | password | `/Pasien/login`      |

## Alur Login

Semua halaman login memakai sistem yang sama:

1. `POST /api/auth/login` dengan `{ email, password }`
2. Respons berbentuk `{ success: true, data: { token, user: { name, role, ... } } }`
3. Token disimpan di `localStorage` dan dikirim sebagai `Authorization: Bearer <token>`
4. Redirect sesuai role ke dashboard masing-masing

## Menjalankan Test Backend

```bash
cd backend
php artisan test
```
