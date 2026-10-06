<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\{
    CommissionEntry,
    DoctorPayroll,
    Expense,
    LedgerEntry,
    Payment,
    Receivable,
    Tindakan,
    User,
    Visit,
};
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    /**
     * Ringkasan dashboard berdasarkan role user yang login.
     */
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();

        $data = match ($user->primaryRole()) {
            'admin' => $this->adminDashboard(),
            'doctor' => $this->doctorDashboard($user),
            default => $this->customerDashboard($user),
        };

        return response()->json(['success' => true, 'data' => $data]);
    }

    private function adminDashboard(): array
    {
        $now = now();
        $monthStart = $now->copy()->startOfMonth();
        $monthEnd = $now->copy()->endOfMonth();

        $income = (float) LedgerEntry::query()
            ->where('type', LedgerEntry::TYPE_INCOME)
            ->whereBetween('date', [$monthStart, $monthEnd])
            ->sum('amount');

        $commission = (float) CommissionEntry::query()
            ->whereBetween('commission_date', [$monthStart, $monthEnd])
            ->sum('amount');

        $otherExpenses = (float) LedgerEntry::query()
            ->where('type', LedgerEntry::TYPE_EXPENSE)
            ->whereBetween('date', [$monthStart, $monthEnd])
            ->sum('amount');

        $clinicShare = $income - $otherExpenses;

        $today = $now->copy()->startOfDay();

        return [
            'period' => [
                'month' => $now->format('Y-m'),
                'start' => $monthStart->toDateString(),
                'end' => $monthEnd->toDateString(),
            ],
            'daily' => [
                'visits_today' => Visit::query()->where('visit_date', $today->toDateString())->count(),
                'cash_income_today' => round(
                    (float) Payment::query()
                        ->where('method', 'cash')
                        ->where('status', Payment::STATUS_CONFIRMED)
                        ->where('paid_at', '>=', $today)
                        ->sum('amount'),
                    2,
                ),
                'qris_income_today' => round(
                    (float) Payment::query()
                        ->where('method', 'qris')
                        ->where('status', Payment::STATUS_CONFIRMED)
                        ->where('paid_at', '>=', $today)
                        ->sum('amount'),
                    2,
                ),
            ],
            'totals' => [
                'revenue' => round($income, 2),
                'doctor_commissions' => round($commission, 2),
                'expenses' => round($otherExpenses, 2),
                'net_clinic_profit' => round($clinicShare, 2),
            ],
            'patients' => User::query()->customers()->count(),
            'doctors' => User::query()->doctors()->count(),
            'open_receivables' => round(
                (float) Receivable::query()->where('status', '!=', Receivable::STATUS_SETTLED)->sum('remaining'),
                2,
            ),
            'visits_this_month' => Visit::query()
                ->whereMonth('visit_date', $now->month)
                ->whereYear('visit_date', $now->year)
                ->count(),
            'recent_visits' => Visit::query()
                ->with(['patient:id,name', 'doctor:id,name', 'invoice'])
                ->latest('visit_date')
                ->limit(5)
                ->get()
                ->map(fn (Visit $v) => [
                    'id' => $v->id,
                    'invoice_number' => $v->invoice_number,
                    'patient_name' => $v->patient?->name,
                    'doctor_name' => $v->doctor?->name,
                    'visit_date' => $v->visit_date->toDateString(),
                    'total' => $v->total,
                    'payment_status' => $v->payment_status,
                ]),
        ];
    }

    private function doctorDashboard(User $doctor): array
    {
        $commissionTotal = (float) CommissionEntry::query()
            ->where('doctor_id', $doctor->id)
            ->sum('amount');

        $paid = (float) CommissionEntry::query()
            ->where('doctor_id', $doctor->id)
            ->where('status', CommissionEntry::STATUS_PAID)
            ->sum('amount');

        return [
            'doctor' => [
                'id' => $doctor->id,
                'name' => $doctor->name,
                'specialist' => $doctor->specialist,
                'employee_number' => $doctor->employee_number,
            ],
            'totals' => [
                'total_commission' => round($commissionTotal, 2),
                'payout_received' => round($paid, 2),
                'pending_commission' => round($commissionTotal - $paid, 2),
                'visits_handled' => Visit::query()->where('doctor_id', $doctor->id)->count(),
                'patients_handled' => Visit::query()->where('doctor_id', $doctor->id)->distinct('patient_id')->count('patient_id'),
            ],
            'monthly_commission' => CommissionEntry::query()
                ->where('doctor_id', $doctor->id)
                ->whereBetween('commission_date', [now()->startOfMonth(), now()->endOfMonth()])
                ->sum('amount'),
        ];
    }

    private function customerDashboard(User $user): array
    {
        $visits = Visit::query()
            ->where('patient_id', $user->id)
            ->with(['items', 'invoice'])
            ->latest('visit_date')
            ->get();

        return [
            'totals' => [
                'total_visits' => $visits->count(),
                'total_spent' => round((float) $visits->sum('total'), 2),
                'outstanding_balance' => round(
                    (float) Receivable::query()
                        ->whereHas('visit', fn ($q) => $q->where('patient_id', $user->id))
                        ->where('status', '!=', Receivable::STATUS_SETTLED)
                        ->sum('remaining'),
                    2,
                ),
            ],
            'visits' => $visits->map(fn (Visit $v) => [
                'id' => $v->id,
                'invoice_number' => $v->invoice_number,
                'date' => $v->visit_date->toDateString(),
                'doctor' => $v->doctor?->name,
                'total' => $v->total,
                'payment_status' => $v->payment_status,
                'items' => $v->items->map(fn ($i) => [
                    'name' => $i->tarif_name,
                    'price' => $i->total,
                ]),
            ]),
        ];
    }
}