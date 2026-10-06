<?php

namespace Database\Seeders;

use App\Models\{ExpenseCategory, InventoryItem, Tindakan};
use Illuminate\Database\Seeder;

class MasterSeeder extends Seeder
{
    public function run(): void
    {
        // ===== TINDAKAN (tarif & komisi; default 40% dokter = 60% klinik) =====
        $tindakans = [
            ['Scaling / Pembersihan Karang Gigi', 350000, 40.00],
            ['Cabut Gigi Bungsu (Molar)', 800000, 50.00],
            ['Tambal Gigi (Composite)', 450000, 40.00],
            ['Gigi Tiruan / PDL Akrilik', 1200000, 50.00],
            ['Veneer Gigi', 2500000, 60.00],
            ['Perawatan Saluran Akar / Root Canal', 2000000, 55.00],
            ['Pemasangan Crown Gigi', 1800000, 50.00],
            ['Rontgen Panoramic', 200000, 20.00],
            ['Pembersihan Karang Gigi + Poles', 400000, 40.00],
            ['Konsultasi & Pemeriksaan Awal', 100000, 30.00],
        ];
        foreach ($tindakans as [$name, $price, $komisi]) {
            Tindakan::query()->firstOrCreate(
                ['name' => $name],
                ['price' => $price, 'komisi_persen' => $komisi, 'is_active' => true],
            );
        }

        // ===== INVENTORY (bahan habis pakai) =====
        foreach ([
            ['INV-001', 'Alginate (cetak gigi)', 'pak', 200000, 30, 5],
            ['INV-002', 'Anestesi lokal (lidocaine)', 'pcs', 35000, 40, 10],
            ['INV-003', 'Bahan tambal composite A2', 'tube', 400000, 12, 2],
            ['INV-004', 'Sarung tangan medis', 'box', 75000, 20, 5],
            ['INV-005', 'Masker medis', 'box', 45000, 15, 5],
            ['INV-006', 'Gips batu', 'pak', 150000, 10, 2],
            ['INV-007', 'Bahan steril (kapas & kasa)', 'pak', 50000, 25, 5],
        ] as [$code, $name, $unit, $unitCost, $stock, $minStock]) {
            InventoryItem::query()->firstOrCreate(
                ['code' => $code],
                [
                    'name' => $name,
                    'unit' => $unit,
                    'unit_cost' => $unitCost,
                    'stock' => $stock,
                    'min_stock' => $minStock,
                ],
            );
        }

        // ===== KATEGORI PENGELUARAN =====
        foreach ([
            ['Sewa Tempat', 'operational'],
            ['Listrik, Air & Internet', 'operational'],
            ['Gaji Tenaga Non-Dokter', 'salary'],
            ['Perawatan & Perbaikan Alat', 'operational'],
            ['Pembelian Bahan Habis Pakai', 'inventory'],
            ['Pemasaran', 'other'],
        ] as [$name, $type]) {
            ExpenseCategory::query()->firstOrCreate(
                ['name' => $name],
                ['type' => $type],
            );
        }
    }
}