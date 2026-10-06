<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\{Payment, Receivable, Visit};
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CustomerController extends Controller
{
    /**
     * Riwayat kunjungan & invoice milik pasien yang login.
     */
    public function invoices(Request $request): JsonResponse
    {
        $visits = Visit::query()
            ->where('patient_id', $request->user()->id)
            ->with(['doctor:id,name', 'items', 'payments', 'invoice'])
            ->orderByDesc('visit_date')
            ->paginate($request->get('per_page', 25));

        return response()->json(['success' => true, 'data' => ['invoices' => $visits]]);
    }

    /**
     * Detail invoice + status pembayaran.
     */
    public function invoiceDetail(Request $request, Visit $visit): JsonResponse
    {
        abort_unless($visit->patient_id === $request->user()->id, 403, 'Bukan invoice Anda');

        $visit->load(['doctor:id,name', 'items', 'payments', 'invoice']);

        return response()->json(['success' => true, 'data' => ['invoice' => $visit]]);
    }

    /**
     * Tagihan (piutang) pasien yang belum lunas.
     */
    public function outstanding(Request $request): JsonResponse
    {
        $receivables = Receivable::query()
            ->where('status', '!=', Receivable::STATUS_SETTLED)
            ->whereHas('visit', fn ($q) => $q->where('patient_id', $request->user()->id))
            ->with(['visit:id,visit_date', 'visit.invoice'])
            ->get();

        return response()->json(['success' => true, 'data' => [
            'receivables' => $receivables,
            'total_outstanding' => round((float) $receivables->sum('remaining'), 2),
        ]]);
    }

    /**
     * Riwayat pembayaran pasien.
     */
    public function payments(Request $request): JsonResponse
    {
        $payments = Payment::query()
            ->where('status', Payment::STATUS_CONFIRMED)
            ->whereHas('visit', fn ($q) => $q->where('patient_id', $request->user()->id))
            ->with(['visit:id', 'visit.invoice'])
            ->orderByDesc('paid_at')
            ->paginate($request->get('per_page', 25));

        return response()->json(['success' => true, 'data' => ['payments' => $payments]]);
    }
}