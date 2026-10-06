<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\{
    BelongsTo,
    HasMany,
    HasManyThrough,
    HasOne,
};

class Visit extends Model
{
    public const STATUS_DRAFT = 'draft';
    public const STATUS_COMPLETED = 'completed';
    public const STATUS_CANCELLED = 'cancelled';

    public const PAY_UNPAID = 'unpaid';
    public const PAY_PARTIAL = 'partial';
    public const PAY_PAID = 'paid';

    protected $fillable = [
        'patient_id', 'doctor_id', 'cashier_id',
        'visit_date', 'complaint', 'status',
    ];

    protected $appends = [
        'invoice_number', 'payment_status', 'subtotal', 'discount', 'total',
    ];

    protected function casts(): array
    {
        return [
            'visit_date' => 'date',
        ];
    }

    public function patient(): BelongsTo
    {
        return $this->belongsTo(User::class, 'patient_id');
    }

    public function doctor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'doctor_id');
    }

    public function cashier(): BelongsTo
    {
        return $this->belongsTo(User::class, 'cashier_id');
    }

    public function invoice(): HasOne
    {
        return $this->hasOne(Invoice::class);
    }

    public function items(): HasManyThrough
    {
        return $this->hasManyThrough(
            InvoiceItem::class,
            Invoice::class,
            'visit_id',
            'invoice_id',
            'id',
            'id'
        );
    }

    public function payments(): HasMany
    {
        return $this->hasMany(Payment::class);
    }

    public function receivable(): HasOne
    {
        return $this->hasOne(Receivable::class);
    }

    public function commissionEntries(): HasMany
    {
        return $this->hasMany(CommissionEntry::class);
    }

    public function getInvoiceNumberAttribute(): ?string
    {
        return $this->invoice?->invoice_number;
    }

    public function getPaymentStatusAttribute(): string
    {
        return $this->invoice?->payment_status ?? self::PAY_UNPAID;
    }

    public function getSubtotalAttribute(): float
    {
        return (float) ($this->invoice?->subtotal ?? 0);
    }

    public function getDiscountAttribute(): float
    {
        return (float) ($this->invoice?->discount ?? 0);
    }

    public function getTotalAttribute(): float
    {
        return (float) ($this->invoice?->total ?? 0);
    }
}