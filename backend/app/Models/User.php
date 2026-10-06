<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasApiTokens, HasFactory, Notifiable, HasRoles;

    protected $fillable = [
        'name', 'email', 'password', 'phone', 'specialist', 'employee_number', 'is_active',
    ];

    public function scopeDoctors($query)
    {
        return $query->role('doctor');
    }

    public function scopeCustomers($query)
    {
        return $query->role('customer');
    }

    public function primaryRole(): ?string
    {
        return $this->roles->first()?->name;
    }

    public function doctorVisits()
    {
        return $this->hasMany(Visit::class, 'doctor_id');
    }

    public function patientVisits()
    {
        return $this->hasMany(Visit::class, 'patient_id');
    }

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }
}
