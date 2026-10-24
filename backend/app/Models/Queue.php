<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Queue extends Model
{
    protected $fillable = [
        'queue_number', 'patient_id', 'doctor_id', 'queue_date', 'queue_time',
        'complaint', 'status', 'validated_by', 'validated_at',
    ];

    protected function casts(): array
    {
        return [
            'queue_date' => 'date',
            'validated_at' => 'datetime',
        ];
    }

    public function patient() { return $this->belongsTo(User::class, 'patient_id'); }
    public function doctor() { return $this->belongsTo(User::class, 'doctor_id'); }
}
