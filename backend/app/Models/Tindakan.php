<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Tindakan extends Model
{
    protected $fillable = [
        'service_id', 'name', 'description', 'price', 'komisi_persen', 'is_active',
    ];

    protected function casts(): array
    {
        return [
            'price' => 'decimal:2',
            'komisi_persen' => 'decimal:2',
            'is_active' => 'boolean',
        ];
    }

    public function invoiceItems(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(InvoiceItem::class);
    }
}