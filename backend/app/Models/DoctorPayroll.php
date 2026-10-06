<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\{BelongsTo, HasMany};

class DoctorPayroll extends Model
{
    public const STATUS_DRAFT = 'draft';
    public const STATUS_PAID = 'paid';

    protected $fillable = [
        'payroll_number', 'doctor_id', 'month',
        'total_commission', 'total_gross', 'deductions', 'net_paid',
        'status', 'paid_date',
    ];

    protected function casts(): array
    {
        return [
            'total_commission' => 'decimal:2',
            'total_gross' => 'decimal:2',
            'deductions' => 'decimal:2',
            'net_paid' => 'decimal:2',
            'paid_date' => 'date',
        ];
    }

    public static function generateNumber(): string
    {
        return 'GJ-' . date('Ym') . '-' . strtoupper(uniqid());
    }

    public function doctor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'doctor_id');
    }

    public function commissionEntries(): HasMany
    {
        return $this->hasMany(CommissionEntry::class);
    }
}