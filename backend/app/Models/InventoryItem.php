<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class InventoryItem extends Model
{
    protected $fillable = [
        'code', 'name', 'unit', 'stock', 'min_stock', 'unit_cost',
    ];

    protected function casts(): array
    {
        return [
            'stock' => 'decimal:2',
            'min_stock' => 'decimal:2',
            'unit_cost' => 'decimal:2',
        ];
    }

    public function transactions(): HasMany
    {
        return $this->hasMany(InventoryTransaction::class);
    }
}