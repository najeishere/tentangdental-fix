<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\{BelongsTo, HasMany};

class Invoice extends Model
{
    public const PAY_UNPAID = 'unpaid';
    public const PAY_PARTIAL = 'partial';
    public const PAY_PAID = 'paid';

    protected $fillable = [
        'visit_id', 'invoice_number', 'subtotal', 'discount', 'total',
        'payment_status', 'issued_at',
    ];

    protected function casts(): array
    {
        return [
            'subtotal' => 'decimal:2',
            'discount' => 'decimal:2',
            'total' => 'decimal:2',
            'issued_at' => 'date',
        ];
    }

    public function visit(): BelongsTo
    {
        return $this->belongsTo(Visit::class);
    }

    public function items(): HasMany
    {
        return $this->hasMany(InvoiceItem::class);
    }
}