<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\{BelongsTo, HasOne};

class CommissionEntry extends Model
{
    public const STATUS_ACCRUED = 'accrued';
    public const STATUS_PAID = 'paid';

    protected $fillable = [
        'doctor_id', 'visit_id', 'invoice_item_id', 'commission_date', 'tarif_price',
        'komisi_persen', 'amount', 'status', 'payroll_id',
    ];

    protected function casts(): array
    {
        return [
            'commission_date' => 'date',
            'tarif_price' => 'decimal:2',
            'komisi_persen' => 'decimal:2',
            'amount' => 'decimal:2',
        ];
    }

    public function doctor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'doctor_id');
    }

    public function visit(): BelongsTo
    {
        return $this->belongsTo(Visit::class);
    }

    public function invoiceItem(): BelongsTo
    {
        return $this->belongsTo(InvoiceItem::class);
    }

    public function payroll(): BelongsTo
    {
        return $this->belongsTo(DoctorPayroll::class);
    }
}