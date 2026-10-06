<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\{BelongsTo, HasOne};

class InvoiceItem extends Model
{
    protected $fillable = [
        'invoice_id', 'tindakan_id', 'quantity', 'tarif_name', 'price',
        'komisi_persen', 'discount', 'total',
    ];

    protected function casts(): array
    {
        return [
            'price' => 'decimal:2',
            'komisi_persen' => 'decimal:2',
            'discount' => 'decimal:2',
            'total' => 'decimal:2',
        ];
    }

    public function invoice(): BelongsTo
    {
        return $this->belongsTo(Invoice::class);
    }

    public function tindakan(): BelongsTo
    {
        return $this->belongsTo(Tindakan::class);
    }

    public function commission(): HasOne
    {
        return $this->hasOne(CommissionEntry::class, 'invoice_item_id');
    }
}