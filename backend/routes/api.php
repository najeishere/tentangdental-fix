<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ClinicController;
use App\Http\Controllers\Api\CustomerController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\DoctorController;
use App\Http\Controllers\Api\KasirController;
use App\Http\Controllers\Api\LabShipmentController;
use App\Http\Controllers\Api\MasterController;
use App\Http\Controllers\Api\ReportsController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Modul Keuangan Klinik Gigi — Tentang Dental
|--------------------------------------------------------------------------
| Auth: token via POST /api/auth/login -> Authorization: Bearer <token>
| Uji coba cepat: php artisan serve lalu buka /api/clinic/pubinformation (tanpa login)
*/

Route::prefix('auth')->group(function () {
    Route::post('login', [AuthController::class, 'login']);
    Route::post('logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');
});

// Info klinik & QRIS statis (publik, tanpa login — untuk halaman pembayaran)
Route::get('clinic/pubinfo', [ClinicController::class, 'publicInfo']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('me', [AuthController::class, 'me']);
    Route::get('dashboard', [DashboardController::class, 'index']);

    // KASIR & ADMIN — proses kunjungan & pembayaran
    Route::post('visits', [KasirController::class, 'storeVisit'])->middleware('checkRole:admin');
    Route::get('visits', [KasirController::class, 'indexVisits'])->middleware('checkRole:admin');
    Route::put('visits/{visit}', [KasirController::class, 'updateVisit'])->middleware('checkRole:admin');
    Route::delete('visits/{visit}', [KasirController::class, 'destroyVisit'])->middleware('checkRole:admin');
    Route::post('payments', [KasirController::class, 'storePayment'])->middleware('checkRole:admin');
    Route::post('payments/{payment}/verify', [KasirController::class, 'verifyPayment'])->middleware('checkRole:admin');
    Route::post('receivables/{receivable}/pay', [KasirController::class, 'payReceivable'])->middleware('checkRole:admin');

    // CUSTOMER (pasien) — riwayat & tagihan sendiri
    Route::prefix('customer')->middleware('checkRole:admin,customer')->group(function () {
        Route::get('invoices', [CustomerController::class, 'invoices']);
        Route::get('invoices/{visit}', [CustomerController::class, 'invoiceDetail']);
        Route::get('outstanding', [CustomerController::class, 'outstanding']);
        Route::get('payments', [CustomerController::class, 'payments']);
    });

    // DOKTER — tindakan & komisi sendiri
    Route::prefix('doctor')->middleware('checkRole:admin,doctor')->group(function () {
        Route::get('treatments', [DoctorController::class, 'treatments']);
        Route::get('commissions', [DoctorController::class, 'commissions']);
        Route::get('payslips', [DoctorController::class, 'payslips']);
    });

    // KASIR (role kasir + admin) — operasional
    Route::prefix('cashier')->middleware('checkRole:admin')->group(function () {
        Route::get('receivables', [ReportsController::class, 'receivables']);
    });

    // ADMIN/OWNER — master data, pengeluaran, laporan
    Route::prefix('admin')->middleware('checkRole:admin')->group(function () {
        Route::get('options', [MasterController::class, 'options']);
        Route::get('doctors', [MasterController::class, 'indexDoctors']);
        Route::post('doctors', [MasterController::class, 'storeDoctor']);
        Route::put('doctors/{doctor}', [MasterController::class, 'updateDoctor']);
        Route::delete('doctors/{doctor}', [MasterController::class, 'destroyDoctor']);

        Route::get('tindakans', [MasterController::class, 'indexTindakans']);
        Route::post('tindakans', [MasterController::class, 'storeTindakan']);
        Route::put('tindakans/{tindakan}', [MasterController::class, 'updateTindakan']);
        Route::delete('tindakans/{tindakan}', [MasterController::class, 'destroyTindakan']);

        Route::get('inventory', [MasterController::class, 'indexInventory']);
        Route::post('inventory/items', [MasterController::class, 'storeInventoryItem']);
        Route::post('inventory/stock-in', [MasterController::class, 'stockIn']);
        Route::post('inventory/stock-out', [MasterController::class, 'stockOut']);

        Route::get('expenses', [MasterController::class, 'indexExpenses']);
        Route::get('expense-categories', [MasterController::class, 'indexExpenseCategories']);
        Route::post('expenses', [MasterController::class, 'storeExpense']);

        Route::get('reports/profit-and-loss', [ReportsController::class, 'profitAndLoss']);
        Route::get('reports/cash-flow', [ReportsController::class, 'cashFlow']);
        Route::get('reports/per-doctor', [ReportsController::class, 'perDoctor']);
        Route::get('reports/receivables', [ReportsController::class, 'receivables']);
        Route::get('reports/inventory', [ReportsController::class, 'inventory']);
        Route::get('reports/payrolls', [ReportsController::class, 'payrolls']);

        Route::put('clinic/qris', [ClinicController::class, 'updateQris']);

        // Pengiriman lab (vendor)
        Route::get('lab-shipments', [LabShipmentController::class, 'index']);
        Route::post('lab-shipments', [LabShipmentController::class, 'store']);
        Route::put('lab-shipments/{labShipment}', [LabShipmentController::class, 'update']);
        Route::delete('lab-shipments/{labShipment}', [LabShipmentController::class, 'destroy']);
    });
});
