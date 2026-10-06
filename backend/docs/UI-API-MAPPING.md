# Peta Layar Figma → Backend API

Dokumen ini memetakan setiap layar pada desain Figma **"Klinik Gigi Management System"** (3 role) ke endpoint backend yang tersedia, lengkap dengan bentuk request & response nyata (sudah teruji).

> **Role desain → backend**
> - **Pasien** = `customer`  
> - **Tim Klinik** = `doctor`  
> - **Admin (billing + kasir + keuangan)** = `admin`

---

## A. Landing / Login

| Layar | Figma | Endpoint | Status |
|-------|-------|----------|--------|
| Login | Email + password + toggle Masuk/Daftar | `POST /api/auth/login` | ✅ Siap |
| Demo cepat (3 tombol role) | Tidak perlu API; bisa hardcode 3 akun demo atau minta BE kirim list demo. | — | Fe-only |
| Register (opsional) | Form daftar pasien baru | — | Belum dibuat |

### POST /api/auth/login
```json
// Request
{ "email": "admin@tentangdental.id", "password": "password" }

// Response 200
{
  "success": true,
  "data": {
    "access_token": "...",
    "token_type": "Bearer",
    "user": { "id":1, "name":"Admin Owner", "role":"admin", ... },
    "admin": null
  }
}
```

**Menyimpan token**: `localStorage.setItem('token', data.access_token)`.  
**Header setiap request**: `Authorization: Bearer <token>`.

---

## B. Dashboard Adaptif

Semua role login cukup panggil `GET /api/dashboard` — backend otomatis mengembalikan konten berbeda berdasarkan `role` user.

### GET /api/dashboard

**Role: Admin / Front Office**

```json
{
  "data": {
    "period": { "month":"2026-09", "start":"2026-09-01", "end":"2026-09-30" },
    "daily": {                          // ← "Kas Harian" pada desain
      "visits_today": 0,
      "cash_income_today": 0,
      "qris_income_today": 2500000
    },
    "totals": {
      "revenue": 6220000,               // kas masuk (pendapatan confirmed)
      "doctor_commissions": 2620000,
      "expenses": 13150000,
      "net_clinic_profit": -6930000
    },
    "open_receivables": 1950000,
    "visits_this_month": 4,
    "recent_visits": [ { "id":10, "invoice_number":"INV-2609-YVV3TE", ... } ]
  }
}
```

**Role: Tim Klinik / Dokter**

```json
{
  "data": {
    "total_commission": 4050000,
    "payout_received": 1650000,
    "pending_commission": 2400000,
    "visits_handled": 6,
    "patients_handled": 3
  }
}
```

**Role: Pasien**

```json
{
  "data": {
    "totals": { "total_visits":3, "total_spent":3150000, "outstanding_balance":0 },
    "visits": [
      { "id":10, "invoice_number":"INV-2609-YVV3TE", "date":"2026-09-12",
        "doctor":"Dr. Sari Wijayanti, drg", "total":"2500000.00",
        "payment_status":"paid",
        "items":[ { "name":"Veneer Gigi", "price":"2500000.00" } ] }
    ]
  }
}
```

---

## C. Admin / Front Office — Layar Operasional

### C1. Pencatatan Tagihan & Pembayaran

| Layar Figma | Metode | Endpoint | Keterangan |
|---|---|---|---|
| Form kunjungan baru (pilih pasien & dokter) | POST | `/api/visits` | Buat kunjungan + item tindakan; auto-generate invoice & komisi |
| Daftar kunjungan hari ini | GET | `/api/visits` | Filter `?doctor_id=&patient_id=&status=completed` |
| Catat bayar (tunai) | POST | `/api/payments` | `method: "cash"`, status langsung confirmed |
| Catat bayar (QRIS) | POST | `/api/payments` | `method: "qris"`, status = pending |
| Verifikasi bayar QRIS | POST | `/api/payments/{payment}/verify` | Status berubah: pending → confirmed |
| Pelunasan piutang | POST | `/api/receivables/{receivable}/pay` | Tambah kas, set partial/settled |

#### POST /api/visits — Request

```json
{
  "patient_id": 8,
  "doctor_id": 2,
  "visit_date": "2026-09-11",
  "complaint": "Gigi nyeri",
  "items": [
    { "tindakan_id": 1, "quantity": 1, "discount": 0 },
    { "tindakan_id": 4, "quantity": 1 }
  ]
}
```

#### POST /api/visits — Response 200 (ringkas)

```json
{
  "data": {
    "visit": {
      "id": 11,
      "invoice_number": "INV-2609-XXXXXX",
      "patient_id": 8,
      "doctor_id": 2,
      "cashier_id": 4,
      "visit_date": "2026-09-11T00:00:00.000000Z",
      "status": "completed",
      "payment_status": "unpaid",
      "total": "750000.00",
      "patient": { "id":8, "name":"Eka Putri" },
      "doctor":  { "id":2, "name":"Dr. Sari Wijayanti, drg" },
      "items": [
        { "id":15, "tindakan_id":1, "tarif_name":"Scaling / Pembersihan Karang Gigi",
          "price":"350000.00", "komisi_persen":"40.00", "total":"350000.00" }
      ]
    }
  }
}
```

#### POST /api/payments — Request

```json
{ "visit_id": 11, "method": "qris", "amount": 750000 }
```
- `method`: `"cash"` | `"qris"`
- Jika QRIS → status = `pending`, perlu `/verify` setelah pembayaran masuk.

#### POST /api/payments/{id}/verify — Response 200

```json
{ "data": { "payment": { "id":11, "method":"qris", "status":"confirmed", ... } } }
```

### C2. Kas Harian

Gunakan `GET /api/dashboard` (role admin) → field `daily` sudah menyediakan:
- `visits_today`
- `cash_income_today`
- `qris_income_today`

> Untuk riwayat transaksi harian (detail per transaksi), frontend bisa panggil
> `GET /api/visits` lalu filter `visit_date=today` di sisi client.

### C3. Piutang & Rekonsiliasi

| Layar Figma | Metode | Endpoint |
|---|---|---|
| Daftar piutang terbuka | GET | `/api/cashier/receivables` (admin role) |
| Pelunasan piutang | POST | `/api/receivables/{receivable}/pay` |

#### GET /api/cashier/receivables — Response (ringkas)

```json
{
  "data": {
    "receivables": [
      {
        "id": 1, "invoice_number":"INV-2609-7PZGRH",
        "patient":"Eka Putri", "phone":"081234567004",
        "doctor":"Dr. Sari Wijayanti, drg",
        "total_amount":"2100000.00", "paid_amount":"1500000.00",
        "remaining":"600000.00", "due_date":"2026-08-24",
        "status":"partial", "days_overdue":18
      }
    ],
    "total_outstanding": 1050000
  }
}
```

### C4. Laporan & Rekonsiliasi Keuangan

| Layar Figma | Metode | Endpoint | Output |
|---|---|---|---|
| Laba Rugi + export PDF | GET | `/admin/reports/profit-and-loss` | Revenue, expenses breakdown, net_profit + memo komisi akrual |
| Alokasi 5 pos (visual) | GET | `/admin/reports/profit-and-loss` | field `expenses.breakdown` → {salary, expense} + doctor_commissions_paid |
| Arus Kas | GET | `/admin/reports/cash-flow` | inflow (cash+qris), outflow, net_cash_flow |
| Per Dokter / Bagi Hasil | GET | `/admin/reports/per-doctor` | `clinic_share`, `total_commission`, `visits_count` per dokter |
| Payroll / Slip Gaji | GET | `/admin/reports/payrolls` | total_net_paid per dokter per bulan |
| Export PDF | GET | `/admin/reports/export-pdf` | query `report=profit-and-loss&from=&to=` → binary PDF |

#### GET /admin/reports/profit-and-loss — Response (ringkas)

```json
{
  "data": {
    "period": { "from":"2026-09-01", "to":"2026-09-30" },
    "method": "Basis kas (pendapatan = pembayaran terkonfirmasi; beban = kas keluar buku besar)",
    "revenue": { "total_revenue": 3600000 },
    "expenses": {
      "breakdown": { "salary": 2650000, "expense": 10500000 },
      "doctor_commissions_paid": 2650000,
      "total_expenses": 13150000
    },
    "net_profit": -9550000,
    "memo": {
      "doctor_commissions_accrued_period": 5270000,
      "note": "Komisi terakrual belum memengaruhi kas sampai dibayarkan via payroll."
    }
  }
}
```

#### GET /admin/reports/per-doctor — Response

```json
{
  "data": {
    "doctors": [
      {
        "doctor_name": "Dr. Sari Wijayanti, drg",
        "collected_revenue": 3400000,
        "total_commission": 2400000,
        "commission_percentage": 70.59,
        "clinic_share": 1000000,
        "visits_count": 2
      }
    ],
    "summary": { "total_collected_revenue":3600000, "total_commission":2620000, "clinic_share":980000 }
  }
}
```

### C5. Master Data (Tindakan, Inventory, Pengeluaran, Settings QRIS)

| Layar Figma | Metode | Endpoint |
|---|---|---|
| Daftar tindakan | GET | `/admin/tindakans` |
| Tambah/ubah/hapus tindakan | POST/PUT/DELETE | `/admin/tindakans/{tindakan}` |
| Stok inventory | GET | `/admin/inventory` |
| Tambah item / stok masuk / stok keluar | POST | `/admin/inventory/items`, `/stock-in`, `/stock-out` |
| Pengeluaran (gaji staf, sewa, utilitas) | GET/POST | `/admin/expenses` |
| Kategori biaya | GET | `/admin/expense-categories` |
| Update QRIS statis klinik | PUT | `/admin/clinic/qris` |

---

## D. Tim Klinik (Dokter)

| Layar Figma | Metode | Endpoint | Status |
|---|---|---|---|
| Dashboard (stat hari ini) | GET | `/api/dashboard` | ✅ (`visits_handled`, `pending_commission`, dll) |
| Komisi periode ini | GET | `/api/doctor/commissions` | ✅ |
| Slip gaji / payroll | GET | `/api/doctor/payslips` | ✅ |
| Daftar tindakan yang bisa ditangani | GET | `/api/doctor/treatments` | ✅ |
| **Antrean hari ini** | — | ⚠️ Belum ada (lihat roadmap) |
| **Rekam Medis** | — | ⚠️ Belum ada |
| **Tindakan & Pengiriman Lab** | — | ⚠️ Belum ada |
| **BMHP** | — | ⚠️ Belum ada |

#### GET /api/doctor/commissions — Response

```json
{
  "data": {
    "period": { "from":"2026-09-01", "to":"2026-09-30" },
    "commissions": [
      {
        "invoice_number":"INV-2609-1V58CL", "visit_date":"2026-09-05",
        "tarif_name":"Pemasangan Crown Gigi", "tarif_price":"1800000.00",
        "komisi_persen":"50.00", "amount":"900000.00", "status":"accrued"
      }
    ],
    "total_commission": 2400000
  }
}
```

#### GET /api/doctor/payslips — Response

```json
{
  "data": {
    "payslips": [
      {
        "payroll_number":"GJ-202609-XXXXX", "month":"2026-08",
        "total_commission":"1650000.00", "net_paid":"1650000.00",
        "status":"paid", "paid_date":"2026-09-01T00:00:00.000000Z"
      }
    ]
  }
}
```

---

## E. Pasien

| Layar Figma | Metode | Endpoint | Status |
|---|---|---|---|
| Beranda (stat kunjungan) | GET | `/api/dashboard` | ✅ |
| **Antrean & Jadwal** | — | ⚠️ Belum ada (lihat roadmap) |
| Riwayat pemeriksaan | GET | `/api/customer/invoices` | ✅ (paginate) |
| Detail invoice / tagihan | GET | `/api/customer/invoices/{visit}` | ✅ (ownership dicek) |
| Tagihan belum lunas | GET | `/api/customer/outstanding` | ✅ |
| Riwayat pembayaran | GET | `/api/customer/payments` | ✅ |

#### GET /api/customer/invoices — Response (ringkas)

```json
{
  "data": {
    "invoices": {
      "data": [
        {
          "id":10, "invoice_number":"INV-2609-YVV3TE",
          "visit_date":"2026-09-12T00:00:00.000000Z",
          "total":"2500000.00", "payment_status":"paid",
          "doctor":{ "name":"Dr. Sari Wijayanti, drg" },
          "items":[{ "tarif_name":"Veneer Gigi", "price":"2500000.00", "komisi_persen":"60.00" }]
        }
      ],
      "current_page":1, "per_page":25, "last_page":1, "total":3
    }
  }
}
```

---

## F. Cepat: Proxies JSON di frontend

Rekomendasikan frontend menyiapkan `apiClient` berbasis `fetch` / `axios` yang:
1. Menyisipkan `Authorization: Bearer <token>` secara otomatis.
2. Menangani 401 → redirect ke login; 403 → tampilkan "tidak punya akses".
3. Base URL dari env `VITE_API_URL` default `http://127.0.0.1:8000/api`.