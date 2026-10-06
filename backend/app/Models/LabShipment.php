<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class LabShipment extends Model
{
    use HasFactory;

    public const STATUS_DRAFT = 'draft';
    public const STATUS_SENT = 'sent';
    public const STATUS_DONE = 'done';

    protected $fillable = [
        'patient_id',
        'patient_name',
        'job_type',
        'vendor',
        'sent_date',
        'estimated_date',
        'cost',
        'instructions',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'sent_date' => 'date',
            'estimated_date' => 'date',
            'cost' => 'decimal:2',
        ];
    }

    public function patient(): BelongsTo
    {
        return $this->belongsTo(User::class, 'patient_id');
    }
}
