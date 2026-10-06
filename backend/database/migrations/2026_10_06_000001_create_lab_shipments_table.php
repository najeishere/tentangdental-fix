<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('lab_shipments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('patient_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('patient_name');
            $table->string('job_type');
            $table->string('vendor');
            $table->date('sent_date');
            $table->date('estimated_date')->nullable();
            $table->decimal('cost', 15, 2)->nullable();
            $table->text('instructions')->nullable();
            $table->string('status')->default('draft');
            $table->timestamps();

            $table->index('status');
            $table->index('sent_date');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('lab_shipments');
    }
};
