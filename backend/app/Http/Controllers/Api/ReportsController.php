<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\{
    CommissionEntry,
    DoctorPayroll,
    Expense,
    ExpenseCategory,
    InventoryItem,
    LedgerEntry,
    Payment,
    Receivable,
    User,
    Visit,
};
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;

class ReportsController extends Controller
{
    /**
     * Ambil rentang periode dari query string (from/to), default = bulan berjalan.
     */
    private function period(Request $request): array
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

        return [$from, $to];
    }

    /**
     * Laporan Laba Rugi (P&L) per periode.
     */
    public function profitAndLoss(Request $request): JsonResponse
    {
        [$from, $to] = $this->period($request);

        $revenueConfirmed = (float) Payment::query()
            ->where('status', Payment::STATUS_CONFIRMED)
            ->whereBetween('paid_at', [$from, $to])
            ->sum('amount');

        // Pengeluaran buku besar: beban operasional + komisi dokter yang dibayar
        $expenseEntries = LedgerEntry::query()
            ->where('type', LedgerEntry::TYPE_EXPENSE)
            ->whereBetween('date', [$from, $to])
            ->get();

        $breakdown = $expenseEntries
            ->groupBy('account')
            ->map(fn ($items) => round((float) $items->sum('amount'), 2));

        $doctorCommissionsPaid = (float) $expenseEntries
            ->where('account', 'salary')
            ->sum('amount');

        $expenseTotal = (float) $expenseEntries->sum('amount');
        $netProfit = $revenueConfirmed - $expenseTotal;

        // Komisi terakrual periode berjalan (belum dibayar) — informatif
        $commissionsAccrued = (float) CommissionEntry::query()
            ->whereBetween('commission_date', [$from, $to])
            ->sum('amount');

        return response()->json(['success' => true, 'data' => [
            'period' => ['from' => $from->toDateString(), 'to' => $to->toDateString()],
            'method' => 'Basis kas (pendapatan = pembayaran terkonfirmasi; beban = kas keluar buku besar)',
            'revenue' => [
                'total_revenue' => round($revenueConfirmed, 2),
            ],
            'expenses' => [
                'breakdown' => $breakdown,
                'doctor_commissions_paid' => round($doctorCommissionsPaid, 2),
                'total_expenses' => round($expenseTotal, 2),
            ],
            'net_profit' => round($netProfit, 2),
            'memo' => [
                'doctor_commissions_accrued_period' => round($commissionsAccrued, 2),
                'note' => 'Komisi terakrual belum memengaruhi kas sampai dibayarkan via payroll.',
            ],
        ]]);
    }

    /**
     * Laporan Arus Kas (masuk vs keluar) per periode degan saldo.
     */
    public function cashFlow(Request $request): JsonResponse
    {
        [$from, $to] = $this->period($request);

        $cashIn = (float) Payment::query()
            ->where('status', Payment::STATUS_CONFIRMED)
            ->where('method', Payment::METHOD_CASH)
            ->whereBetween('paid_at', [$from, $to])
            ->sum('amount');

        $qrisIn = (float) Payment::query()
            ->where('status', Payment::STATUS_CONFIRMED)
            ->where('method', Payment::METHOD_QRIS)
            ->whereBetween('paid_at', [$from, $to])
            ->sum('amount');

        $cashOut = (float) LedgerEntry::query()
            ->where('type', LedgerEntry::TYPE_EXPENSE)
            ->whereBetween('date', [$from, $to])
            ->sum('amount');

        $inflows = LedgerEntry::query()
            ->where('type', LedgerEntry::TYPE_INCOME)
            ->whereBetween('date', [$from, $to])
            ->get()
            ->groupBy(fn ($e) => $e->payment?->method ?? 'receivable')
            ->map(fn ($items) => round((float) $items->sum('amount'), 2));

        return response()->json(['success' => true, 'data' => [
            'period' => ['from' => $from->toDateString(), 'to' => $to->toDateString()],
            'inflow' => [
                'cash' => round($cashIn, 2),
                'qris' => round($qrisIn, 2),
                'total_inflow' => round($cashIn + $qrisIn, 2),
            ],
            'outflow' => [
                'operational_expenses' => round($cashOut, 2),
                'total_outflow' => round($cashOut, 2),
            ],
            'net_cash_flow' => round($cashIn + $qrisIn - $cashOut, 2),
        ]]);
    }

    /**
     * Rekap pendapatan & komisi per dokter.
     */
    public function perDoctor(Request $request): JsonResponse
    {
        [$from, $to] = $this->period($request);

        $doctors = User::query()
            ->role('doctor')
            ->withCount(['doctorVisits' => fn ($q) => $q->whereBetween('visit_date', [$from, $to])])
            ->get();

        $rows = $doctors->map(function (User $doctor) use ($from, $to) {
            $commissions = CommissionEntry::query()
                ->where('doctor_id', $doctor->id)
                ->whereBetween('commission_date', [$from, $to])
                ->get();

            $revenue = (float) Payment::query()
                ->where('status', Payment::STATUS_CONFIRMED)
                ->whereHas('visit', fn ($q) => $q->where('doctor_id', $doctor->id))
                ->whereBetween('paid_at', [$from, $to])
                ->sum('amount');

            return [
                'doctor_id' => $doctor->id,
                'doctor_name' => $doctor->name,
                'specialist' => $doctor->specialist,
                'collected_revenue' => round($revenue, 2),
                'total_commission' => round((float) $commissions->sum('amount'), 2),
                'commission_percentage' => round(
                    $revenue > 0 ? ((float) $commissions->sum('amount') / $revenue) * 100 : 0,
                    2,
                ),
                'clinic_share' => round($revenue - (float) $commissions->sum('amount'), 2),
                'visits_count' => $doctor->doctor_visits_count,
            ];
        });

        return response()->json(['success' => true, 'data' => [
            'period' => ['from' => $from->toDateString(), 'to' => $to->toDateString()],
            'note' => 'Realisasi = kas masuk terkonfirmasi; komisi = akrual bulan berjalan (beban tetap meski pasien belum bayar lunas).',
            'doctors' => $rows,
            'summary' => [
                'total_collected_revenue' => round($rows->sum('collected_revenue'), 2),
                'total_commission' => round($rows->sum('total_commission'), 2),
                'clinic_share' => round($rows->sum('clinic_share'), 2),
            ],
        ]]);
    }

    /**
     * Daftar piutang (tagihan belum lunas).
     */
    public function receivables(): JsonResponse
    {
        $rows = Receivable::query()
            ->where('status', '!=', Receivable::STATUS_SETTLED)
            ->with(['visit.patient:id,name,phone', 'visit.doctor:id,name', 'visit.invoice'])
            ->orderBy('due_date')
            ->get()
            ->map(fn (Receivable $r) => [
                'id' => $r->id,
                'invoice_number' => $r->visit?->invoice_number,
                'patient' => $r->visit?->patient?->name,
                'phone' => $r->visit?->patient?->phone,
                'doctor' => $r->visit?->doctor?->name,
                'total_amount' => $r->total_amount,
                'paid_amount' => $r->paid_amount,
                'remaining' => $r->remaining,
                'due_date' => $r->due_date?->toDateString(),
                'status' => $r->status,
                'days_overdue' => $r->due_date && now()->gt($r->due_date)
                    ? (int) $r->due_date->diffInDays(now())
                    : 0,
            ]);

        return response()->json(['success' => true, 'data' => [
            'receivables' => $rows,
            'total_outstanding' => round($rows->sum('remaining'), 2),
            'total_overdue' => round($rows->where('days_overdue', '>', 0)->sum('remaining'), 2),
        ]]);
    }

    /**
     * Laporan nilai stok & peringatan stok minim.
     */
    public function inventory(): JsonResponse
    {
        $items = InventoryItem::query()
            ->orderBy('name')
            ->get()
            ->map(fn (InventoryItem $item) => [
                'id' => $item->id,
                'code' => $item->code,
                'name' => $item->name,
                'unit' => $item->unit,
                'stock' => $item->stock,
                'min_stock' => $item->min_stock,
                'unit_cost' => $item->unit_cost,
                'stock_value' => round((float) $item->stock * (float) $item->unit_cost, 2),
                'low_stock' => (float) $item->stock <= (float) $item->min_stock,
            ]);

        return response()->json(['success' => true, 'data' => [
            'items' => $items,
            'total_value' => round($items->sum('stock_value'), 2),
            'low_stock_count' => $items->where('low_stock', true)->count(),
        ]]);
    }

    /**
     * Rekap gaji/komisi dokter per bulan.
     */
    public function payrolls(Request $request): JsonResponse
    {
        $query = DoctorPayroll::query()->with('doctor:id,name,specialist');

        if ($request->filled('month')) {
            $query->where('month', $request->month);
        }

        $payrolls = $query->orderByDesc('month')->get();

        return response()->json(['success' => true, 'data' => [
            'payrolls' => $payrolls,
            'total_gross' => round((float) $payrolls->sum('total_gross'), 2),
            'total_paid' => round((float) $payrolls->where('status', DoctorPayroll::STATUS_PAID)->sum('net_paid'), 2),
        ]]);
    }
}