<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Tambahan kolom untuk role dokter/kasir pada tabel users bawaan Laravel
        Schema::table('users', function (Blueprint $table) {
            $table->string('phone', 20)->nullable()->after('email');
            $table->string('specialist', 100)->nullable()->after('phone');
            $table->string('employee_number')->nullable()->unique()->after('specialist');
            $table->boolean('is_active')->default(true)->after('employee_number');
        });

        // ===================== MASTER TINDAKAN =====================
        Schema::create('tindakans', function (Blueprint $table) {
            $table->id();
            // service_id: relasi opsional ke tabel `services` pada modul marketing (FE).
            // Hanya indeks, tanpa foreign key, supaya modul keuangan dapat berdiri sendiri.
            $table->unsignedBigInteger('service_id')->nullable()->index();
            $table->string('name');
            $table->text('description')->nullable();
            $table->decimal('price', 15, 2)->default(0);
            $table->decimal('komisi_persen', 5, 2)->default(40.00); // 40% dokter
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        // ===================== MASTER INVENTORY =====================
        Schema::create('inventory_items', function (Blueprint $table) {
            $table->id();
            $table->string('code', 50)->nullable()->unique();
            $table->string('name');
            $table->string('unit', 30)->default('pcs'); // pcs, box, tube, botol
            $table->decimal('stock', 15, 2)->default(0);
            $table->decimal('min_stock', 15, 2)->default(0);
            $table->decimal('unit_cost', 15, 2)->default(0); // harga beli
            $table->timestamps();
        });

        Schema::create('inventory_transactions', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('inventory_item_id')->index();
            $table->string('type'); // purchase | usage | adjusting
            $table->decimal('quantity', 15, 2);
            $table->decimal('unit_cost', 15, 2)->default(0);
            $table->string('reference_type')->nullable();
            $table->unsignedBigInteger('reference_id')->nullable();
            $table->text('note')->nullable();
            $table->timestamps();

            $table->foreign('inventory_item_id')
                ->references('id')->on('inventory_items')
                ->cascadeOnDelete();
        });

        // ===================== PENGELUARAN =====================
        Schema::create('expense_categories', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('type'); // operational | inventory | salary | other
            $table->timestamps();
        });

        Schema::create('expenses', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('expense_category_id')->index();
            $table->date('date');
            $table->decimal('amount', 15, 2);
            $table->string('description')->nullable();
            $table->timestamps();

            $table->foreign('expense_category_id')
                ->references('id')->on('expense_categories')
                ->restrictOnDelete();
        });

        // ===================== VISIT (KUNJUNGAN) =====================
        Schema::create('visits', function (Blueprint $table) {
            $table->id();
            $table->string('invoice_number')->unique();
            $table->unsignedBigInteger('patient_id')->index();
            $table->unsignedBigInteger('doctor_id')->nullable()->index();
            $table->unsignedBigInteger('cashier_id')->nullable()->index();
            $table->date('visit_date');
            $table->text('complaint')->nullable();
            $table->string('status', 30)->default('draft'); // draft | completed | cancelled
            $table->string('payment_status', 30)->default('unpaid'); // unpaid | partial | paid
            $table->decimal('subtotal', 15, 2)->default(0);
            $table->decimal('discount', 15, 2)->default(0);
            $table->decimal('total', 15, 2)->default(0);
            $table->timestamps();

            $table->foreign('patient_id')->references('id')->on('users')->restrictOnDelete();
            $table->foreign('doctor_id')->references('id')->on('users')->nullOnDelete();
            $table->foreign('cashier_id')->references('id')->on('users')->nullOnDelete();
        });

        Schema::create('visits_items', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('visit_id');
            $table->unsignedBigInteger('tindakan_id')->nullable();
            $table->string('tarif_name');
            $table->decimal('price', 15, 2);
            $table->decimal('komisi_persen', 5, 2)->default(40.00);
            $table->decimal('discount', 15, 2)->default(0);
            $table->decimal('total', 15, 2);
            $table->timestamps();

            $table->foreign('visit_id')->references('id')->on('visits')->cascadeOnDelete();
            $table->foreign('tindakan_id')->references('id')->on('tindakans')->nullOnDelete();
        });

        // ===================== PEMBAYARAN =====================
        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('visit_id')->index();
            $table->string('method', 20); // cash | qris
            $table->string('status', 20)->default('pending'); // pending | confirmed | refunded
            $table->decimal('amount', 15, 2);
            $table->decimal('change', 15, 2)->default(0);
            $table->string('paid_by', 50)->nullable();
            $table->timestamp('paid_at')->nullable();
            $table->unsignedBigInteger('verified_by')->nullable()->index();
            $table->timestamp('verified_at')->nullable();
            $table->string('payment_proof_url')->nullable();
            $table->timestamps();

            $table->foreign('visit_id')->references('id')->on('visits')->restrictOnDelete();
            $table->foreign('verified_by')->references('id')->on('users')->nullOnDelete();
        });

        // ===================== PIUTANG =====================
        Schema::create('receivables', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('visit_id')->index();
            $table->decimal('total_amount', 15, 2);
            $table->decimal('paid_amount', 15, 2)->default(0);
            $table->decimal('remaining', 15, 2);
            $table->date('due_date')->nullable();
            $table->string('status', 20)->default('open'); // open | partial | settled
            $table->timestamps();

            $table->foreign('visit_id')->references('id')->on('visits')->restrictOnDelete();
        });

        // ===================== GAJI DOKTER =====================
        Schema::create('doctor_payrolls', function (Blueprint $table) {
            $table->id();
            $table->string('payroll_number')->unique();
            $table->unsignedBigInteger('doctor_id')->index();
            $table->string('month', 7); // "2026-09"
            $table->decimal('total_commission', 15, 2)->default(0);
            $table->decimal('total_gross', 15, 2)->default(0);
            $table->decimal('deductions', 15, 2)->default(0);
            $table->decimal('net_paid', 15, 2)->default(0);
            $table->string('status', 20)->default('draft'); // draft | paid
            $table->date('paid_date')->nullable();
            $table->timestamps();

            $table->foreign('doctor_id')->references('id')->on('users')->restrictOnDelete();
        });

        // ===================== KOMISI DOKTER =====================
        Schema::create('commission_entries', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('doctor_id')->index();
            $table->unsignedBigInteger('visit_id')->index();
            $table->unsignedBigInteger('visits_item_id')->nullable();
            $table->date('commission_date')->index();
            $table->decimal('tarif_price', 15, 2);
            $table->decimal('komisi_persen', 5, 2);
            $table->decimal('amount', 15, 2);
            $table->string('status', 20)->default('accrued'); // accrued | paid
            $table->unsignedBigInteger('payroll_id')->nullable()->index();
            $table->timestamps();

            $table->foreign('doctor_id')->references('id')->on('users')->restrictOnDelete();
            $table->foreign('visit_id')->references('id')->on('visits')->restrictOnDelete();
            $table->foreign('visits_item_id')->references('id')->on('visits_items')->cascadeOnDelete();
            $table->foreign('payroll_id')->references('id')->on('doctor_payrolls')->nullOnDelete();
        });

        // ===================== BUKU BESAR (SINGLE LEDGER) =====================
        Schema::create('ledger_entries', function (Blueprint $table) {
            $table->id();
            $table->date('date');
            $table->string('type'); // income | expense
            $table->string('account'); // revenue, receivable, expense, salary
            $table->string('description');
            $table->decimal('amount', 15, 2);
            $table->unsignedBigInteger('payment_id')->nullable()->index();
            $table->unsignedBigInteger('expense_id')->nullable()->index();
            $table->unsignedBigInteger('payroll_id')->nullable()->index();
            $table->unsignedBigInteger('visit_id')->nullable()->index();
            $table->timestamps();

            $table->foreign('payment_id')->references('id')->on('payments')->nullOnDelete();
            $table->foreign('expense_id')->references('id')->on('expenses')->nullOnDelete();
            $table->foreign('payroll_id')->references('id')->on('doctor_payrolls')->nullOnDelete();
            $table->foreign('visit_id')->references('id')->on('visits')->nullOnDelete();
        });

        // ===================== SETTING KLINIK / QRIS =====================
        Schema::create('settings', function (Blueprint $table) {
            $table->id();
            $table->string('key')->unique();
            $table->text('value')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('ledger_entries');
        Schema::dropIfExists('receivables');
        Schema::dropIfExists('payments');
        Schema::dropIfExists('expenses');
        Schema::dropIfExists('expense_categories');
        Schema::dropIfExists('visits_items');
        Schema::dropIfExists('visits');
        Schema::dropIfExists('inventory_transactions');
        Schema::dropIfExists('inventory_items');
        Schema::dropIfExists('tindakans');

        Schema::dropIfExists('commission_entries');
        Schema::dropIfExists('doctor_payrolls');

        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['phone', 'specialist', 'employee_number', 'is_active']);
        });

        Schema::dropIfExists('model_has_roles');
        Schema::dropIfExists('model_has_permissions');
        Schema::dropIfExists('role_has_permissions');
        Schema::dropIfExists('roles');
        Schema::dropIfExists('permissions');

        Schema::dropIfExists('settings');
    }
};