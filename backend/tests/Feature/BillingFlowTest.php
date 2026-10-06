<?php

namespace Tests\Feature;

use App\Models\{Invoice, InvoiceItem, CommissionEntry, Payment, Receivable, Visit};
use Illuminate\Foundation\Testing\RefreshDatabase;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class BillingFlowTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        Role::create(['name' => 'admin']);
        Role::create(['name' => 'doctor']);
        Role::create(['name' => 'customer']);
    }

    private function admin(): \App\Models\User
    {
        return \App\Models\User::factory()->create(['email' => 'admin@test.id'])
            ->assignRole('admin');
    }

    private function cashier(): \App\Models\User
    {
        return \App\Models\User::factory()->create(['email' => 'kasir@test.id'])
            ->assignRole('admin');
    }

    private function doctor(): \App\Models\User
    {
        return \App\Models\User::factory()->create(['email' => 'dokter@test.id'])
            ->assignRole('doctor');
    }

    private function patient(): \App\Models\User
    {
        return \App\Models\User::factory()->create(['email' => 'pasien@test.id'])
            ->assignRole('customer');
    }

    private function tindakan(float $price = 350000): \App\Models\Tindakan
    {
        return \App\Models\Tindakan::create([
            'name' => 'Scaling',
            'price' => $price,
            'komisi_persen' => 40,
            'is_active' => true,
        ]);
    }

    private function loginAs($user): string
    {
        $response = $this->postJson('/api/auth/login', [
            'email' => $user->email,
            'password' => 'password',
        ]);
        return $response->json('data.token');
    }

    // ===================== VISIT + INVOICE =====================

    public function test_visit_creates_invoice_with_items_and_commissions(): void
    {
        $cashier = $this->cashier();
        $doctor = $this->doctor();
        $patient = $this->patient();
        $tindakan = $this->tindakan(350000);

        $response = $this->postJson('/api/visits', [
            'patient_id' => $patient->id,
            'doctor_id' => $doctor->id,
            'visit_date' => '2026-10-01',
            'complaint' => 'Karang gigi',
            'items' => [['tindakan_id' => $tindakan->id, 'quantity' => 2]],
        ], ['Authorization' => 'Bearer ' . $this->loginAs($cashier)]);

        $response->assertStatus(201);
        $visit = $response->json('data.visit');

        // Invoice dibuat dengan nomor INV- dan status unpaid
        $this->assertStringStartsWith('INV-', $visit['invoice_number']);
        $this->assertSame('unpaid', $visit['payment_status']);
        $this->assertEquals(700000, (float) $visit['total']); // 350000 × 2

        // Item tersimpan di invoice_items
        $this->assertDatabaseHas('invoice_items', [
            'tindakan_id' => $tindakan->id,
            'quantity' => 2,
            'tarif_name' => 'Scaling',
        ]);

        // Komisi dokter 40% = 280000
        $this->assertDatabaseHas('commission_entries', [
            'doctor_id' => $doctor->id,
            'amount' => 280000,
        ]);
    }

    public function test_visit_with_multiple_items(): void
    {
        $cashier = $this->cashier();
        $doctor = $this->doctor();
        $patient = $this->patient();
        $t1 = $this->tindakan(350000);
        $t2 = $this->tindakan(450000);

        $response = $this->postJson('/api/visits', [
            'patient_id' => $patient->id,
            'doctor_id' => $doctor->id,
            'visit_date' => '2026-10-01',
            'items' => [
                ['tindakan_id' => $t1->id, 'quantity' => 1],
                ['tindakan_id' => $t2->id, 'quantity' => 1],
            ],
        ], ['Authorization' => 'Bearer ' . $this->loginAs($cashier)]);

        $response->assertStatus(201);
        $this->assertEquals(800000, (float) $response->json('data.visit.total'));
        $this->assertCount(2, InvoiceItem::where('invoice_id', $response->json('data.visit.id'))->get());
    }

    // ===================== PEMBAYARAN CASH =====================

    public function test_cash_payment_full_amount(): void
    {
        $cashier = $this->cashier();
        $doctor = $this->doctor();
        $patient = $this->patient();
        $tindakan = $this->tindakan(350000);

        $visit = $this->postJson('/api/visits', [
            'patient_id' => $patient->id,
            'doctor_id' => $doctor->id,
            'visit_date' => '2026-10-01',
            'items' => [['tindakan_id' => $tindakan->id]],
        ], ['Authorization' => 'Bearer ' . $this->loginAs($cashier)])->json('data.visit');

        $response = $this->postJson('/api/payments', [
            'visit_id' => $visit['id'],
            'method' => 'cash',
            'amount' => 350000,
        ], ['Authorization' => 'Bearer ' . $this->loginAs($cashier)]);

        $response->assertStatus(201);
        $this->assertSame('confirmed', $response->json('data.payment.status'));
        $this->assertEquals(350000, (float) $response->json('data.payment.amount'));

        // Status invoice → paid
        $freshVisit = Visit::find($visit['id']);
        $this->assertSame('paid', $freshVisit->invoice->payment_status);
    }

    public function test_cash_payment_partial_creates_receivable(): void
    {
        $cashier = $this->cashier();
        $doctor = $this->doctor();
        $patient = $this->patient();
        $tindakan = $this->tindakan(1000000);

        $visit = $this->postJson('/api/visits', [
            'patient_id' => $patient->id,
            'doctor_id' => $doctor->id,
            'visit_date' => '2026-10-01',
            'items' => [['tindakan_id' => $tindakan->id]],
        ], ['Authorization' => 'Bearer ' . $this->loginAs($cashier)])->json('data.visit');

        // Bayar DP 400rb
        $this->postJson('/api/payments', [
            'visit_id' => $visit['id'],
            'method' => 'cash',
            'amount' => 400000,
        ], ['Authorization' => 'Bearer ' . $this->loginAs($cashier)])->assertStatus(201);

        // Status invoice → partial
        $this->assertSame('partial', Visit::find($visit['id'])->invoice->payment_status);

        // Piutang dibuat
        $receivable = Receivable::where('visit_id', $visit['id'])->first();
        $this->assertNotNull($receivable);
        $this->assertEquals(600000, (float) $receivable->remaining);
    }

    public function test_payment_overpay_rejected(): void
    {
        $cashier = $this->cashier();
        $doctor = $this->doctor();
        $patient = $this->patient();
        $tindakan = $this->tindakan(350000);

        $visit = $this->postJson('/api/visits', [
            'patient_id' => $patient->id,
            'doctor_id' => $doctor->id,
            'visit_date' => '2026-10-01',
            'items' => [['tindakan_id' => $tindakan->id]],
        ], ['Authorization' => 'Bearer ' . $this->loginAs($cashier)])->json('data.visit');

        $this->postJson('/api/payments', [
            'visit_id' => $visit['id'],
            'method' => 'cash',
            'amount' => 500000,
        ], ['Authorization' => 'Bearer ' . $this->loginAs($cashier)])
            ->assertStatus(422)
            ->assertJsonFragment(['message' => 'Jumlah melebihi sisa tagihan']);
    }

    // ===================== PEMBAYARAN QRIS =====================

    public function test_qris_payment_pending_then_verify(): void
    {
        $cashier = $this->cashier();
        $doctor = $this->doctor();
        $patient = $this->patient();
        $tindakan = $this->tindakan(350000);

        $visit = $this->postJson('/api/visits', [
            'patient_id' => $patient->id,
            'doctor_id' => $doctor->id,
            'visit_date' => '2026-10-01',
            'items' => [['tindakan_id' => $tindakan->id]],
        ], ['Authorization' => 'Bearer ' . $this->loginAs($cashier)])->json('data.visit');

        $payment = $this->postJson('/api/payments', [
            'visit_id' => $visit['id'],
            'method' => 'qris',
            'amount' => 350000,
        ], ['Authorization' => 'Bearer ' . $this->loginAs($cashier)])->json('data.payment');

        $this->assertSame('pending', $payment['status']);

        // Kasir verifikasi
        $this->postJson("/api/payments/{$payment['id']}/verify", [], [
            'Authorization' => 'Bearer ' . $this->loginAs($cashier),
        ])->assertStatus(200);

        $this->assertSame('paid', Visit::find($visit['id'])->invoice->payment_status);
    }

    // ===================== EDIT VISIT =====================

    public function test_edit_unpaid_visit_recomputes_total(): void
    {
        $cashier = $this->cashier();
        $doctor = $this->doctor();
        $patient = $this->patient();
        $t1 = $this->tindakan(350000);
        $t2 = $this->tindakan(450000);

        $visit = $this->postJson('/api/visits', [
            'patient_id' => $patient->id,
            'doctor_id' => $doctor->id,
            'visit_date' => '2026-10-01',
            'items' => [['tindakan_id' => $t1->id]],
        ], ['Authorization' => 'Bearer ' . $this->loginAs($cashier)])->json('data.visit');

        // Ganti item: tambah tindakan kedua
        $response = $this->putJson("/api/visits/{$visit['id']}", [
            'patient_id' => $patient->id,
            'doctor_id' => $doctor->id,
            'visit_date' => '2026-10-01',
            'items' => [
                ['tindakan_id' => $t1->id],
                ['tindakan_id' => $t2->id],
            ],
        ], ['Authorization' => 'Bearer ' . $this->loginAs($cashier)]);

        $response->assertStatus(200);
        $this->assertEquals(800000, (float) $response->json('data.visit.total'));
    }

    public function test_edit_paid_visit_only_date_and_complaint_allowed(): void
    {
        $cashier = $this->cashier();
        $doctor = $this->doctor();
        $patient = $this->patient();
        $t1 = $this->tindakan(350000);
        $t2 = $this->tindakan(450000);

        $visit = $this->postJson('/api/visits', [
            'patient_id' => $patient->id,
            'doctor_id' => $doctor->id,
            'visit_date' => '2026-10-01',
            'items' => [['tindakan_id' => $t1->id]],
        ], ['Authorization' => 'Bearer ' . $this->loginAs($cashier)])->json('data.visit');

        $this->postJson('/api/payments', [
            'visit_id' => $visit['id'],
            'method' => 'cash',
            'amount' => 350000,
        ], ['Authorization' => 'Bearer ' . $this->loginAs($cashier)]);

        // Coba ganti item → 422
        $this->putJson("/api/visits/{$visit['id']}", [
            'patient_id' => $patient->id,
            'doctor_id' => $doctor->id,
            'visit_date' => '2026-10-01',
            'items' => [['tindakan_id' => $t2->id]],
        ], ['Authorization' => 'Bearer ' . $this->loginAs($cashier)])
            ->assertStatus(422)
            ->assertJsonFragment(['message' => 'Invoice sudah memiliki catatan pembayaran, jadi isinya tidak bisa diubah. Anda hanya bisa mengubah tanggal & keluhan.']);

        // Edit tanggal & keluhan saja → 200
        $this->putJson("/api/visits/{$visit['id']}", [
            'patient_id' => $patient->id,
            'doctor_id' => $doctor->id,
            'visit_date' => '2026-10-02',
            'complaint' => 'Update tanggal',
            'items' => [['tindakan_id' => $t1->id]],
        ], ['Authorization' => 'Bearer ' . $this->loginAs($cashier)])
            ->assertStatus(200);
    }

    // ===================== HAPUS VISIT =====================

    public function test_delete_unpaid_visit(): void
    {
        $cashier = $this->cashier();
        $doctor = $this->doctor();
        $patient = $this->patient();
        $tindakan = $this->tindakan();

        $visit = $this->postJson('/api/visits', [
            'patient_id' => $patient->id,
            'doctor_id' => $doctor->id,
            'visit_date' => '2026-10-01',
            'items' => [['tindakan_id' => $tindakan->id]],
        ], ['Authorization' => 'Bearer ' . $this->loginAs($cashier)])->json('data.visit');

        $this->deleteJson("/api/visits/{$visit['id']}", [], [
            'Authorization' => 'Bearer ' . $this->loginAs($cashier),
        ])->assertStatus(200);

        $this->assertDatabaseMissing('visits', ['id' => $visit['id']]);
        $this->assertDatabaseMissing('invoices', ['visit_id' => $visit['id']]);
    }

    public function test_delete_paid_visit_blocked(): void
    {
        $cashier = $this->cashier();
        $doctor = $this->doctor();
        $patient = $this->patient();
        $tindakan = $this->tindakan();

        $visit = $this->postJson('/api/visits', [
            'patient_id' => $patient->id,
            'doctor_id' => $doctor->id,
            'visit_date' => '2026-10-01',
            'items' => [['tindakan_id' => $tindakan->id]],
        ], ['Authorization' => 'Bearer ' . $this->loginAs($cashier)])->json('data.visit');

        $this->postJson('/api/payments', [
            'visit_id' => $visit['id'],
            'method' => 'cash',
            'amount' => 350000,
        ], ['Authorization' => 'Bearer ' . $this->loginAs($cashier)]);

        $this->deleteJson("/api/visits/{$visit['id']}", [], [
            'Authorization' => 'Bearer ' . $this->loginAs($cashier),
        ])->assertStatus(409);
    }

    // ===================== PELUNASAN PIUTANG =====================

    public function test_settle_receivable_flips_status_to_paid(): void
    {
        $cashier = $this->cashier();
        $doctor = $this->doctor();
        $patient = $this->patient();
        $tindakan = $this->tindakan(1000000);

        $visit = $this->postJson('/api/visits', [
            'patient_id' => $patient->id,
            'doctor_id' => $doctor->id,
            'visit_date' => '2026-10-01',
            'items' => [['tindakan_id' => $tindakan->id]],
        ], ['Authorization' => 'Bearer ' . $this->loginAs($cashier)])->json('data.visit');

        // DP 400rb → partial
        $this->postJson('/api/payments', [
            'visit_id' => $visit['id'],
            'method' => 'cash',
            'amount' => 400000,
        ], ['Authorization' => 'Bearer ' . $this->loginAs($cashier)]);

        $receivable = Receivable::where('visit_id', $visit['id'])->first();

        // Lunasi sisa 600rb
        $this->postJson("/api/receivables/{$receivable->id}/pay", [
            'amount' => 600000,
            'method' => 'cash',
        ], ['Authorization' => 'Bearer ' . $this->loginAs($cashier)])
            ->assertStatus(201);

        $this->assertSame('paid', Visit::find($visit['id'])->invoice->payment_status);
        $this->assertSame('settled', $receivable->fresh()->status);
    }

    // ===================== REPORTS =====================

    public function test_reports_accessible_to_admin(): void
    {
        $admin = $this->admin();
        $token = $this->loginAs($admin);

        foreach (['receivables', 'profit-and-loss', 'cash-flow', 'per-doctor', 'inventory', 'payrolls'] as $report) {
            $this->getJson("/api/admin/reports/{$report}", [
                'Authorization' => 'Bearer ' . $token,
            ])->assertStatus(200);
        }
    }

    // ===================== DOCTOR CRUD =====================

    public function test_doctor_crud(): void
    {
        $admin = $this->admin();
        $token = $this->loginAs($admin);

        $response = $this->postJson('/api/admin/doctors', [
            'name' => 'Dr. Test',
            'email' => 'dr@test.id',
            'password' => 'password',
            'specialist' => 'Ortodonti',
            'employee_number' => 'DOC-TEST',
        ], ['Authorization' => 'Bearer ' . $token]);

        $response->assertStatus(201);
        $doctorId = $response->json('data.doctor.id');

        $this->putJson("/api/admin/doctors/{$doctorId}", [
            'name' => 'Dr. Test Edit',
            'email' => 'dr@test.id',
            'specialist' => 'Ortodonti',
            'employee_number' => 'DOC-TEST',
            'is_active' => true,
        ], ['Authorization' => 'Bearer ' . $token])->assertStatus(200);

$this->deleteJson("/api/admin/doctors/{$doctorId}", [], [
            'Authorization' => 'Bearer ' . $token,
        ])->assertStatus(200);

        $this->assertDatabaseMissing('users', ['id' => $doctorId]);
    }
}