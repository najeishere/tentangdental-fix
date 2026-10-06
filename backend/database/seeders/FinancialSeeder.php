<?php

namespace Database\Seeders;

use App\Models\{
    CommissionEntry,
    DoctorPayroll,
    Expense,
    ExpenseCategory,
    Invoice,
    InvoiceItem,
    InventoryTransaction,
    LedgerEntry,
    Payment,
    Receivable,
    Setting,
    Tindakan,
    User,
    Visit,
};
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class FinancialSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::query()->role('admin')->first();
        $cashier = User::query()->role('admin')->skip(1)->first() ?? $admin;
        $doctors = User::query()->role('doctor')->get();
        $patients = User::query()->role('customer')->get();

        $tindakans = Tindakan::query()->get()->keyBy(fn ($t) => $t->name);

        // Kolom settings untuk modul keuangan
        Setting::set('clinic_name', 'Tentang Dental');
        Setting::set('clinic_address', 'Jl. Kesehatan No. 12, Jakarta');
        Setting::set('clinic_phone', '021-555-1234');
        Setting::set('clinic_qris_value', 'FAKE-QRIS:00020101021226640014COM.GOJEK.WWW011093600012312345');
        Setting::set('qris_instruction', 'Scan QRIS lalu lanjutkan pembayaran di aplikasi pembayaran Anda');

        DB::transaction(function () use ($doctors, $patients, $admin, $cashier, $tindakans) {
            // ===== TRANSAKSI HISTORIS (Juli .. September 2026) =====
            $visitsData = $this->visitsData($patients, $doctors, $tindakans);

            foreach ($visitsData as $data) {
                $this->createVisit($data, $cashier);
            }

            // ===== Gaji dokter: rekap komisi Agustus 2026 (komisi bulan < September) =====
            foreach ($doctors as $doctor) {
                $totalCommission = (float) CommissionEntry::query()
                    ->where('doctor_id', $doctor->id)
                    ->where('status', CommissionEntry::STATUS_ACCRUED)
                    ->where('commission_date', '<', '2026-09-01')
                    ->sum('amount');

                if ($totalCommission <= 0.0) {
                    continue;
                }

                $payroll = DoctorPayroll::query()->create([
                    'payroll_number' => DoctorPayroll::generateNumber(),
                    'doctor_id' => $doctor->id,
                    'month' => '2026-08',
                    'total_commission' => $totalCommission,
                    'total_gross' => $totalCommission,
                    'deductions' => 0,
                    'net_paid' => $totalCommission,
                    'status' => DoctorPayroll::STATUS_PAID,
                    'paid_date' => '2026-09-01',
                ]);

                CommissionEntry::query()
                    ->where('doctor_id', $doctor->id)
                    ->where('status', CommissionEntry::STATUS_ACCRUED)
                    ->where('commission_date', '<', '2026-09-01')
                    ->update(['status' => CommissionEntry::STATUS_PAID, 'payroll_id' => $payroll->id]);

                LedgerEntry::query()->create([
                    'date' => $payroll->paid_date,
                    'type' => LedgerEntry::TYPE_EXPENSE,
                    'account' => 'salary',
                    'description' => "Pembayaran gaji/kontrak dokter {$doctor->name} (komisi Agustus)",
                    'amount' => $totalCommission,
                    'payroll_id' => $payroll->id,
                ]);
            }

            // ===== PENGELUARAN OPERASIONAL =====
            $catRent = ExpenseCategory::query()->where('name', 'Sewa Tempat')->first();
            $catUtil = ExpenseCategory::query()->where('name', 'Listrik, Air & Internet')->first();
            $catStaff = ExpenseCategory::query()->where('name', 'Gaji Tenaga Non-Dokter')->first();

            foreach ([
                [$catRent->id, '2026-07-01', 6000000],
                [$catRent->id, '2026-08-01', 6000000],
                [$catRent->id, '2026-09-05', 6000000],
                [$catUtil->id, '2026-07-01', 750000],
                [$catUtil->id, '2026-08-01', 800000],
                [$catStaff->id, '2026-08-01', 4500000],
                [$catStaff->id, '2026-09-01', 4500000],
            ] as [$categoryId, $date, $amount]) {
                $expense = Expense::query()->create([
                    'expense_category_id' => $categoryId,
                    'date' => $date,
                    'amount' => $amount,
                    'description' => ExpenseCategory::query()->find($categoryId)->name,
                ]);

                LedgerEntry::query()->create([
                    'date' => $expense->date,
                    'type' => LedgerEntry::TYPE_EXPENSE,
                    'account' => 'expense',
                    'description' => $expense->description,
                    'amount' => $expense->amount,
                    'expense_id' => $expense->id,
                ]);
            }

            // ===== TRANSAKSI INVENTORY: pembelian stok awal =====
            $inventoryPurchases = [
                ['Alginate (cetak gigi)', 200000, 4],
                ['Anestesi lokal (lidocaine)', 35000, 12],
                ['Sarung tangan medis', 75000, 4],
                ['Masker medis', 45000, 4],
                ['Gips batu', 150000, 4],
                ['Bahan steril (kapas & kasa)', 50000, 4],
            ];
            foreach ($inventoryPurchases as [$name, $unitCost, $qty]) {
                $item = \App\Models\InventoryItem::query()->where('name', $name)->first();
                InventoryTransaction::query()->create([
                    'inventory_item_id' => $item->id,
                    'type' => 'purchase',
                    'quantity' => $qty,
                    'unit_cost' => $unitCost,
                    'note' => 'Stok awal (seed)',
                ]);
            }

            Setting::set('seeded_at', now()->toDateTimeString());
        });
    }

    /**
     * Buat 1 kunjungan lengkap: visit + invoice + items + payment + piutang + komisi + buku besar.
     */
    private function createVisit(array $data, object $cashier): void
    {
        $visit = Visit::query()->create([
            'patient_id' => $data['patient'],
            'doctor_id' => $data['doctor'],
            'cashier_id' => $cashier->id,
            'visit_date' => $data['date'],
            'complaint' => $data['complaint'] ?? null,
            'status' => Visit::STATUS_COMPLETED,
        ]);

        $invoice = Invoice::query()->create([
            'visit_id' => $visit->id,
            'invoice_number' => 'INV-' . date('ym') . '-' . strtoupper(Str::random(6)),
            'subtotal' => 0,
            'discount' => $data['discount'] ?? 0,
            'total' => 0,
            'payment_status' => Visit::PAY_UNPAID,
            'issued_at' => $visit->visit_date,
        ]);

        foreach ($data['items'] as $item) {
            InvoiceItem::query()->create([
                'invoice_id' => $invoice->id,
                'tindakan_id' => $item['tindakan_id'],
                'quantity' => 1,
                'tarif_name' => $item['name'],
                'price' => $item['price'],
                'komisi_persen' => $item['komisi_persen'],
                'discount' => 0,
                'total' => $item['price'],
            ]);
        }

        $subtotal = (float) $invoice->items()->sum('total');
        $discount = (float) ($data['discount'] ?? 0);
        $total = $subtotal - $discount;

        $invoice->update([
            'subtotal' => $subtotal,
            'discount' => $discount,
            'total' => $total,
            'payment_status' => $data['payment'][1] >= $total
                ? Invoice::PAY_PAID
                : ($data['payment'][1] > 0 ? Invoice::PAY_PARTIAL : Invoice::PAY_UNPAID),
        ]);

        // ===== BUKU BESAR per tindakan =====
        foreach ($invoice->items as $vi) {
            $amount = $vi->total * ($vi->komisi_persen / 100);

            LedgerEntry::query()->create([
                'date' => $visit->visit_date,
                'type' => LedgerEntry::TYPE_INCOME,
                'account' => 'revenue',
                'description' => "Pendapatan layanan {$vi->tarif_name} ({$invoice->invoice_number})",
                'amount' => $amount > 0 ? $amount : $vi->total,
                'visit_id' => $visit->id,
            ]);
        }

        // Catat komisi dokter (40% default per tindakan) dengan tanggal tindakan
        foreach ($invoice->items as $vi) {
            $doctorShare = $vi->total * ($vi->komisi_persen / 100);

            CommissionEntry::query()->create([
                'doctor_id' => $visit->doctor_id,
                'visit_id' => $visit->id,
                'invoice_item_id' => $vi->id,
                'commission_date' => $visit->visit_date,
                'tarif_price' => $vi->total,
                'komisi_persen' => $vi->komisi_persen,
                'amount' => $doctorShare,
                'status' => CommissionEntry::STATUS_ACCRUED,
            ]);
        }

        // ===== PEMBAYARAN =====
        [$method, $paidAmount] = $data['payment'];

        if ($paidAmount > 0) {
            $paidAt = \Carbon\Carbon::parse($visit->visit_date)->setTime(10, 0);

            $payment = Payment::query()->create([
                'visit_id' => $visit->id,
                'method' => $method,
                'status' => Payment::STATUS_CONFIRMED,
                'amount' => $paidAmount,
                'change' => $paidAmount > $total ? $paidAmount - $total : 0,
                'paid_at' => $paidAt,
                'verified_by' => $cashier->id,
                'verified_at' => $paidAt,
            ]);

            LedgerEntry::query()->create([
                'date' => $visit->visit_date,
                'type' => LedgerEntry::TYPE_INCOME,
                'account' => 'revenue',
                'description' => "Penerimaan pembayaran {$method} — {$invoice->invoice_number}",
                'amount' => $paidAmount,
                'payment_id' => $payment->id,
                'visit_id' => $visit->id,
            ]);
        }

        // ===== PIUTANG bila belum lunas =====
        if ($total > $paidAmount) {
            Receivable::query()->create([
                'visit_id' => $visit->id,
                'total_amount' => $total,
                'paid_amount' => $paidAmount,
                'remaining' => $total - $paidAmount,
                'due_date' => \Carbon\Carbon::parse($visit->visit_date)->addDays(14)->toDateString(),
                'status' => $paidAmount > 0 ? Receivable::STATUS_PARTIAL : Receivable::STATUS_OPEN,
            ]);
        }
    }

    private function visitsData($patients, $doctors, $tindakans): array
    {
        $p = $patients->pluck('id', 'email');
        $d = $doctors->pluck('id', 'email');
        $t = $tindakans;

        return [
            [
                'patient' => $p['budi@example.com'], 'doctor' => $d['sari@tentangdental.id'],
                'date' => '2026-07-08', 'complaint' => 'Karang gigi menumpuk',
                'items' => [
                    ['tindakan_id' => $t['Scaling / Pembersihan Karang Gigi']->id, 'name' => 'Scaling / Pembersihan Karang Gigi', 'price' => 350000, 'komisi_persen' => 40],
                    ['tindakan_id' => $t['Pembersihan Karang Gigi + Poles']->id, 'name' => 'Pembersihan Karang Gigi + Poles', 'price' => 400000, 'komisi_persen' => 40],
                ],
                'payment' => ['cash', 750000],
            ],
            [
                'patient' => $p['citra@example.com'], 'doctor' => $d['sari@tentangdental.id'],
                'date' => '2026-07-15', 'complaint' => 'Gigi berlubang sakit',
                'items' => [
                    ['tindakan_id' => $t['Tambal Gigi (Composite)']->id, 'name' => 'Tambal Gigi (Composite)', 'price' => 450000, 'komisi_persen' => 40],
                ],
                'payment' => ['qris', 450000],
            ],
            [
                'patient' => $p['dedi@example.com'], 'doctor' => $d['andi@tentangdental.id'],
                'date' => '2026-08-03', 'complaint' => 'Gigi bungsu tumbuh salah',
                'items' => [
                    ['tindakan_id' => $t['Cabut Gigi Bungsu (Molar)']->id, 'name' => 'Cabut Gigi Bungsu (Molar)', 'price' => 800000, 'komisi_persen' => 50],
                ],
                'payment' => ['cash', 800000],
            ],
            [
                'patient' => $p['eka@example.com'], 'doctor' => $d['sari@tentangdental.id'],
                'date' => '2026-08-10', 'complaint' => 'Raja & sakit gigi menjalar',
                'items' => [
                    ['tindakan_id' => $t['Konsultasi & Pemeriksaan Awal']->id, 'name' => 'Konsultasi & Pemeriksaan Awal', 'price' => 100000, 'komisi_persen' => 30],
                    ['tindakan_id' => $t['Perawatan Saluran Akar / Root Canal']->id, 'name' => 'Perawatan Saluran Akar / Root Canal', 'price' => 2000000, 'komisi_persen' => 55],
                ],
                'payment' => ['qris', 1500000], // sisa 600rb → piutang
            ],
            [
                'patient' => $p['budi@example.com'], 'doctor' => $d['andi@tentangdental.id'],
                'date' => '2026-08-17', 'complaint' => 'Gigi renggang depan',
                'items' => [
                    ['tindakan_id' => $t['Gigi Tiruan / PDL Akrilik']->id, 'name' => 'Gigi Tiruan / PDL Akrilik', 'price' => 1200000, 'komisi_persen' => 50],
                ],
                'payment' => ['cash', 1200000],
            ],
            [
                'patient' => $p['citra@example.com'], 'doctor' => $d['sari@tentangdental.id'],
                'date' => '2026-08-21', 'complaint' => 'Rontgen gigi sebelum perawatan',
                'items' => [
                    ['tindakan_id' => $t['Rontgen Panoramic']->id, 'name' => 'Rontgen Panoramic', 'price' => 200000, 'komisi_persen' => 20],
                ],
                'payment' => ['qris', 200000],
            ],
            // September (referensi laporan)
            [
                'patient' => $p['dedi@example.com'], 'doctor' => $d['andi@tentangdental.id'],
                'date' => '2026-09-04', 'complaint' => 'Sakit gigi berdenyut',
                'items' => [
                    ['tindakan_id' => $t['Tambal Gigi (Composite)']->id, 'name' => 'Tambal Gigi (Composite)', 'price' => 450000, 'komisi_persen' => 40],
                ],
                'payment' => ['cash', 0], // belum bayar → piutang penuh
            ],
            [
                'patient' => $p['eka@example.com'], 'doctor' => $d['sari@tentangdental.id'],
                'date' => '2026-09-05', 'complaint' => 'Mahkota gigi retak',
                'items' => [
                    ['tindakan_id' => $t['Pemasangan Crown Gigi']->id, 'name' => 'Pemasangan Crown Gigi', 'price' => 1800000, 'komisi_persen' => 50],
                ],
                'payment' => ['cash', 900000], // DP
            ],
            [
                'patient' => $p['budi@example.com'], 'doctor' => $d['andi@tentangdental.id'],
                'date' => '2026-09-09', 'complaint' => 'Rontgen kontrol ortho',
                'items' => [
                    ['tindakan_id' => $t['Rontgen Panoramic']->id, 'name' => 'Rontgen Panoramic', 'price' => 200000, 'komisi_persen' => 20],
                ],
                'payment' => ['qris', 200000],
            ],
            [
                'patient' => $p['citra@example.com'], 'doctor' => $d['sari@tentangdental.id'],
                'date' => '2026-09-12', 'complaint' => 'Pola gigi berubah warna',
                'items' => [
                    ['tindakan_id' => $t['Veneer Gigi']->id, 'name' => 'Veneer Gigi', 'price' => 2500000, 'komisi_persen' => 60],
                ],
                'payment' => ['qris', 2500000],
            ],
        ];
    }
}