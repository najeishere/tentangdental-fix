<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Receivable extends Model
{
    public const STATUS_OPEN = 'open';
    public const STATUS_PARTIAL = 'partial';
    public const STATUS_SETTLED = 'settled';

    protected $fillable = [
        'visit_id', 'total_amount', 'paid_amount', 'remaining', 'due_date', 'status',
    ];

    protected function casts(): array
    {
        return [
            'total_amount' => 'decimal:2',
            'paid_amount' => 'decimal:2',
            'remaining' => 'decimal:2',
            'due_date' => 'date',
        ];
    }

    public function visit(): BelongsTo
    {
        return $this->belongsTo(Visit::class);
    }
}