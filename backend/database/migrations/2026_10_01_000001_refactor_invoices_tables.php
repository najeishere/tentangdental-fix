<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Pisahkan data tagihan dari tabel `visits` ke tabel `invoices`,
     * lalu ganti `visits_items` menjadi `invoice_items`.
     */
    public function up(): void
    {
        // ===================== INVOICE (TAGIHAN) =====================
        Schema::create('invoices', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('visit_id')->unique();
            $table->string('invoice_number')->unique();
            $table->decimal('subtotal', 15, 2)->default(0);
            $table->decimal('discount', 15, 2)->default(0);
            $table->decimal('total', 15, 2)->default(0);
            $table->string('payment_status', 30)->default('unpaid'); // unpaid | partial | paid
            $table->date('issued_at')->nullable();
            $table->timestamps();

            $table->foreign('visit_id')->references('id')->on('visits')->cascadeOnDelete();
        });

        // ===================== ITEM TAGIHAN =====================
        Schema::create('invoice_items', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('invoice_id');
            $table->unsignedBigInteger('tindakan_id')->nullable();
            $table->string('tarif_name');
            $table->decimal('price', 15, 2);
            $table->decimal('komisi_persen', 5, 2)->default(40.00);
            $table->decimal('discount', 15, 2)->default(0);
            $table->decimal('total', 15, 2);
            $table->timestamps();

            $table->foreign('invoice_id')->references('id')->on('invoices')->cascadeOnDelete();
            $table->foreign('tindakan_id')->references('id')->on('tindakans')->nullOnDelete();
        });

        // ===================== SALIN DATA EXISTING =====================
        $now = now()->toDateTimeString();

        DB::table('invoices')->insertUsing(
            [
                'visit_id', 'invoice_number', 'subtotal', 'discount', 'total',
                'payment_status', 'issued_at', 'created_at', 'updated_at',
            ],
            DB::table('visits')->select(
                'id as visit_id',
                'invoice_number',
                'subtotal',
                'discount',
                'total',
                'payment_status',
                'visit_date as issued_at',
                DB::raw("'{$now}' as created_at"),
                DB::raw("'{$now}' as updated_at")
            )
        );

        DB::table('invoice_items')->insertUsing(
            [
                'id', 'invoice_id', 'tindakan_id', 'tarif_name', 'price',
                'komisi_persen', 'discount', 'total', 'created_at', 'updated_at',
            ],
            DB::table('visits_items as vi')
                ->join('invoices as i', 'i.visit_id', '=', 'vi.visit_id')
                ->select(
                    'vi.id',
                    'i.id as invoice_id',
                    'vi.tindakan_id',
                    'vi.tarif_name',
                    'vi.price',
                    'vi.komisi_persen',
                    'vi.discount',
                    'vi.total',
                    DB::raw("'{$now}' as created_at"),
                    DB::raw("'{$now}' as updated_at")
                )
        );

        // ===================== ARAHKAN RELASI KOMISI → INVOICE_ITEMS =====================
        Schema::table('commission_entries', function (Blueprint $table) {
            $table->dropForeign(['visits_item_id']);
            $table->renameColumn('visits_item_id', 'invoice_item_id');
        });

        Schema::table('commission_entries', function (Blueprint $table) {
            $table->foreign('invoice_item_id')->references('id')->on('invoice_items')->cascadeOnDelete();
        });

        // ===================== BUANG TABEL/COLOM LAMA =====================
        Schema::dropIfExists('visits_items');

        Schema::table('visits', function (Blueprint $table) {
            $table->dropUnique(['invoice_number']);
        });

        Schema::table('visits', function (Blueprint $table) {
            $table->dropColumn(['invoice_number', 'payment_status', 'subtotal', 'discount', 'total']);
        });
    }

    public function down(): void
    {
        $now = now()->toDateTimeString();

        // Kembalikan kolom invoicing ke `visits`
        Schema::table('visits', function (Blueprint $table) {
            $table->string('invoice_number')->nullable();
            $table->string('payment_status', 30)->default('unpaid');
            $table->decimal('subtotal', 15, 2)->default(0);
            $table->decimal('discount', 15, 2)->default(0);
            $table->decimal('total', 15, 2)->default(0);
        });

        DB::table('visits')
            ->join('invoices', 'invoices.visit_id', '=', 'visits.id')
            ->update([
                'visits.invoice_number' => DB::raw('invoices.invoice_number'),
                'visits.payment_status' => DB::raw('invoices.payment_status'),
                'visits.subtotal' => DB::raw('invoices.subtotal'),
                'visits.discount' => DB::raw('invoices.discount'),
                'visits.total' => DB::raw('invoices.total'),
            ]);

        Schema::table('visits', function (Blueprint $table) {
            $table->unique('invoice_number');
        });

        // Kembalikan `invoice_items` → `visits_items`
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

        DB::table('visits_items')->insertUsing(
            [
                'id', 'visit_id', 'tindakan_id', 'tarif_name', 'price',
                'komisi_persen', 'discount', 'total', 'created_at', 'updated_at',
            ],
            DB::table('invoice_items as ii')
                ->join('invoices as i', 'i.id', '=', 'ii.invoice_id')
                ->select(
                    'ii.id',
                    'i.visit_id',
                    'ii.tindakan_id',
                    'ii.tarif_name',
                    'ii.price',
                    'ii.komisi_persen',
                    'ii.discount',
                    'ii.total',
                    DB::raw("'{$now}' as created_at"),
                    DB::raw("'{$now}' as updated_at")
                )
        );

        // Kembalikan relasi kolom komisi
        Schema::table('commission_entries', function (Blueprint $table) {
            $table->dropForeign(['invoice_item_id']);
            $table->renameColumn('invoice_item_id', 'visits_item_id');
        });

        Schema::table('commission_entries', function (Blueprint $table) {
            $table->foreign('visits_item_id')->references('id')->on('visits_items')->cascadeOnDelete();
        });

        Schema::dropIfExists('invoice_items');
        Schema::dropIfExists('invoices');
    }
};