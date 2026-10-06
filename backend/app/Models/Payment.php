<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\{BelongsTo, HasOne};

class Payment extends Model
{
    public const METHOD_CASH = 'cash';
    public const METHOD_QRIS = 'qris';
    public const METHOD_TRANSFER = 'transfer';

    public const STATUS_PENDING = 'pending';
    public const STATUS_CONFIRMED = 'confirmed';
    public const STATUS_REFUNDED = 'refunded';

    protected $fillable = [
        'visit_id', 'method', 'status', 'amount', 'change', 'paid_by',
        'paid_at', 'verified_by', 'verified_at', 'payment_proof_url',
    ];

    protected function casts(): array
    {
        return [
            'amount' => 'decimal:2',
            'change' => 'decimal:2',
            'paid_at' => 'datetime',
            'verified_at' => 'datetime',
        ];
    }

    public function visit(): BelongsTo
    {
        return $this->belongsTo(Visit::class);
    }

    public function verifier(): BelongsTo
    {
        return $this->belongsTo(User::class, 'verified_by');
    }

    public function ledgerEntry(): HasOne
    {
        return $this->hasOne(LedgerEntry::class);
    }
}