<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        $roles = ['admin', 'doctor', 'customer'];
        foreach ($roles as $role) {
            Role::query()->firstOrCreate(['name' => $role, 'guard_name' => 'web']);
        }

        // Admin / Owner
        $admin = User::query()->firstOrCreate(
            ['email' => 'admin@tentangdental.id'],
            ['name' => 'Admin Owner', 'password' => 'password'],
        );
        $admin->syncRoles('admin');

        // Dokter (2 orang)
        $doctor1 = $this->makeDoctor(
            'Dr. Sari Wijayanti, drg',
            'sari@tentangdental.id',
            'Spesialis Konservasi Gigi',
            'DOK-001',
        );
        $doctor2 = $this->makeDoctor(
            'Dr. Andi Pratama, drg',
            'andi@tentangdental.id',
            'Spesialis Bedah Mulut',
            'DOK-002',
        );

        // Front office (kasir) — bergabung ke role admin (3-role model)
        $cashier = User::query()->firstOrCreate(
            ['email' => 'kasir@tentangdental.id'],
            ['name' => 'Dewi Lestari', 'password' => 'password'],
        );
        $cashier->syncRoles('admin');

        // Customer / Pasien (4 orang)
        foreach ([
            ['Budi Santoso', 'budi@example.com', '081234567001'],
            ['Citra Ayu', 'citra@example.com', '081234567002'],
            ['Dedi Kurniawan', 'dedi@example.com', '081234567003'],
            ['Eka Putri', 'eka@example.com', '081234567004'],
        ] as [$name, $email, $phone]) {
            $user = User::query()->firstOrCreate(
                ['email' => $email],
                ['name' => $name, 'password' => 'password', 'phone' => $phone],
            );
            $user->syncRoles('customer');
        }
    }

    private function makeDoctor(string $name, string $email, string $specialist, string $empNo): User
    {
        $doctor = User::query()->firstOrCreate(
            ['email' => $email],
            [
                'name' => $name,
                'password' => 'password',
                'specialist' => $specialist,
                'employee_number' => $empNo,
            ],
        );
        $doctor->syncRoles('doctor');

        return $doctor;
    }
}