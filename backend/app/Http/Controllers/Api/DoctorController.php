<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\{CommissionEntry, DoctorPayroll, Visit};
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DoctorController extends Controller
{
    /**
     * Kunjungan/tindakan pasien yang ditangani dokter ini.
     */
    public function treatments(Request $request): JsonResponse
    {
        $visits = Visit::query()
            ->where('doctor_id', $request->user()->id)
            ->with(['patient:id,name,phone', 'items', 'payments', 'invoice'])
            ->orderByDesc('visit_date')
            ->paginate($request->get('per_page', 25));

        return response()->json(['success' => true, 'data' => ['visits' => $visits]]);
    }

    /**
     * Rekap komisi dokter ini per periode.
     */
    public function commissions(Request $request): JsonResponse
    {
        if ($request->filled('from')) {
            $from = \Carbon\Carbon::parse($request->string('from'));
        } else {
            $from = now()->startOfMonth();
        }

        if ($request->filled('to')) {
            $to = \Carbon\Carbon::parse($request->string('to'))->endOfDay();
        } else {
            $to = now()->endOfMonth()->endOfDay();
        }

        $entries = CommissionEntry::query()
            ->where('doctor_id', $request->user()->id)
            ->whereBetween('commission_date', [$from, $to])
            ->with(['visit:id,visit_date', 'visit.invoice'])
            ->orderByDesc('created_at')
            ->get();

        return response()->json(['success' => true, 'data' => [
            'period' => ['from' => $from->toDateString(), 'to' => $to->toDateString()],
            'commissions' => $entries->map(fn (CommissionEntry $e) => [
                'id' => $e->id,
                'invoice_number' => $e->visit?->invoice_number,
                'visit_date' => $e->visit?->visit_date?->toDateString(),
                'tarif_name' => $e->invoiceItem?->tarif_name,
                'tarif_price' => $e->tarif_price,
                'komisi_persen' => $e->komisi_persen,
                'amount' => $e->amount,
                'status' => $e->status,
            ]),
            'total_commission' => round((float) $entries->sum('amount'), 2),
        ]]);
    }

    /**
     * Slip gaji (payroll) milik dokter ini.
     */
    public function payslips(Request $request): JsonResponse
    {
        $payrolls = DoctorPayroll::query()
            ->where('doctor_id', $request->user()->id)
            ->orderByDesc('month')
            ->get();

        return response()->json(['success' => true, 'data' => ['payslips' => $payrolls]]);
    }
}