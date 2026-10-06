<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\{
    CommissionEntry,
    Invoice,
    InvoiceItem,
    LedgerEntry,
    Payment,
    Receivable,
    Visit,
};
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class KasirController extends Controller
{
    /**
     * Hitung total & siapkan payload item dari pilihan tindakan.
     * Melempar error bila ada tindakan non-aktif.
     *
     * @return array{items: array<int, array<string, mixed>>, subtotal: float}
     */
    private function resolveItemEntries(array $entries): array
    {
        $items = [];
        $subtotal = 0;

        foreach ($entries as $entry) {
            $tindakan = \App\Models\Tindakan::query()->findOrFail($entry['tindakan_id']);
            if (!$tindakan->is_active) {
                throw \Illuminate\Validation\ValidationException::withMessages([
                    'items.*.tindakan_id' => ["Tindakan {$tindakan->name} non-aktif"],
                ]);
            }

            $qty = max(1, (int) ($entry['quantity'] ?? 1));
            $price = (float) $tindakan->price * $qty;
            $subtotal += $price;

            $items[] = [
                'tindakan_id' => $tindakan->id,
                'quantity' => $qty,
                'tarif_name' => $tindakan->name,
                'price' => $price,
                'komisi_persen' => (float) $tindakan->komisi_persen,
                'discount' => 0,
                'total' => $price,
            ];
        }

        return ['items' => $items, 'subtotal' => $subtotal];
    }

    /**
     * Re-generate item, komisi, dan catatan ledger pendapatan milik invoice.
     */
    private function regenerateItems(Visit $visit, Invoice $invoice, array $resolvedItems): void
    {
        CommissionEntry::query()->where('visit_id', $visit->id)->delete();
        LedgerEntry::query()->where('visit_id', $visit->id)->delete();
        InvoiceItem::query()->where('invoice_id', $invoice->id)->delete();

        foreach ($resolvedItems as $item) {
            $vi = InvoiceItem::query()->create(array_merge($item, ['invoice_id' => $invoice->id]));

            CommissionEntry::query()->create([
                'doctor_id' => $visit->doctor_id,
                'visit_id' => $visit->id,
                'invoice_item_id' => $vi->id,
                'commission_date' => $visit->visit_date,
                'tarif_price' => $vi->total,
                'komisi_persen' => $vi->komisi_persen,
                'amount' => $vi->total * ($vi->komisi_persen / 100),
                'status' => CommissionEntry::STATUS_ACCRUED,
            ]);

            LedgerEntry::query()->create([
                'date' => $visit->visit_date,
                'type' => LedgerEntry::TYPE_INCOME,
                'account' => 'revenue',
                'description' => "Pendapatan layanan {$vi->tarif_name}",
                'amount' => $vi->total,
                'visit_id' => $visit->id,
            ]);
        }
    }

    /**
     * Buat kunjungan baru beserta daftar tindakan.
     */
    public function storeVisit(Request $request): JsonResponse
    {
        $request->validate([
            'patient_id' => ['required', 'exists:users,id'],
            'doctor_id' => ['required', 'exists:users,id'],
            'visit_date' => ['required', 'date'],
            'complaint' => ['nullable', 'string'],
            'items' => ['required', 'array', 'min:1'],
            'items.*.tindakan_id' => ['required', 'exists:tindakans,id'],
            'items.*.quantity' => ['sometimes', 'integer', 'min:1'],
        ]);

        $resolved = $this->resolveItemEntries($request->items);

        $visit = DB::transaction(function () use ($request, $resolved) {
            $subtotal = $resolved['subtotal'];

            $visit = Visit::query()->create([
                'patient_id' => $request->patient_id,
                'doctor_id' => $request->doctor_id,
                'cashier_id' => $request->user()->id,
                'visit_date' => $request->visit_date,
                'complaint' => $request->complaint,
                'status' => Visit::STATUS_COMPLETED,
            ]);

            $invoice = Invoice::query()->create([
                'visit_id' => $visit->id,
                'invoice_number' => 'INV-' . now()->format('ym') . '-' . strtoupper(Str::random(6)),
                'subtotal' => $subtotal,
                'discount' => 0,
                'total' => $subtotal,
                'payment_status' => Visit::PAY_UNPAID,
                'issued_at' => $visit->visit_date,
            ]);

            $this->regenerateItems($visit, $invoice, $resolved['items']);

            return $visit->load(['patient:id,name', 'doctor:id,name', 'items', 'invoice']);
        });

        return response()->json(['success' => true, 'data' => ['visit' => $visit]], 201);
    }

    /**
     * Ubah data kunjungan/invoice.
     * Jika sudah ada pembayaran, hanya tanggal & keluhan yang boleh berubah.
     */
    public function updateVisit(Request $request, Visit $visit): JsonResponse
    {
        $request->validate([
            'patient_id' => ['required', 'exists:users,id'],
            'doctor_id' => ['required', 'exists:users,id'],
            'visit_date' => ['required', 'date'],
            'complaint' => ['nullable', 'string'],
            'items' => ['required', 'array', 'min:1'],
            'items.*.tindakan_id' => ['required', 'exists:tindakans,id'],
            'items.*.quantity' => ['sometimes', 'integer', 'min:1'],
        ]);

        $hasPayments = $visit->payments()->exists();

        $resolved = $this->resolveItemEntries($request->items);

        // Bandingkan item lama vs yang dikirim (multiset tindakan+total)
        $requestedItems = collect($resolved['items'])
            ->map(fn ($i) => [(int) $i['tindakan_id'], (float) $i['total']])
            ->sort()->values()->all();
        $existingItems = $visit->items()->get(['invoice_items.tindakan_id', 'invoice_items.total'])
            ->map(fn ($i) => [(int) $i->tindakan_id, (float) $i->total])
            ->sort()->values()->all();
        $itemsChanged = $requestedItems !== $existingItems;

        if ($hasPayments && ((int) $request->patient_id !== (int) $visit->patient_id
            || (int) $request->doctor_id !== (int) $visit->doctor_id
            || $itemsChanged)) {
            return response()->json([
                'success' => false,
                'message' => 'Invoice sudah memiliki catatan pembayaran, jadi isinya tidak bisa diubah. Anda hanya bisa mengubah tanggal & keluhan.',
            ], 422);
        }

        DB::transaction(function () use ($request, $visit, $hasPayments, $resolved) {
            $visit->fill([
                'patient_id' => $request->patient_id,
                'doctor_id' => $request->doctor_id,
                'visit_date' => $request->visit_date,
                'complaint' => $request->complaint,
            ]);

            $visit->save();

            $invoice = $visit->invoice;
            if (!$invoice) {
                $invoice = Invoice::query()->create([
                    'visit_id' => $visit->id,
                    'invoice_number' => 'INV-' . now()->format('ym') . '-' . strtoupper(Str::random(6)),
                    'payment_status' => Invoice::PAY_UNPAID,
                ]);
            }

            $invoice->issued_at = $visit->visit_date;

            if (!$hasPayments) {
                $invoice->subtotal = $resolved['subtotal'];
                $invoice->discount = 0;
                $invoice->total = $resolved['subtotal'];
                $invoice->payment_status = Invoice::PAY_UNPAID;
            }

            $invoice->save();

            if (!$hasPayments) {
                $this->regenerateItems($visit, $invoice, $resolved['items']);
            }
        });

        $visit->refresh();
        $visit->load(['patient:id,name', 'doctor:id,name', 'items', 'invoice']);

        return response()->json(['success' => true, 'data' => ['visit' => $visit]]);
    }

    /**
     * Hapus invoice yang belum memiliki pembayaran.
     */
    public function destroyVisit(Request $request, Visit $visit): JsonResponse
    {
        if ($visit->payments()->exists()) {
            return response()->json([
                'success' => false,
                'message' => 'Invoice sudah memiliki catatan pembayaran sehingga tidak bisa dihapus.',
            ], 409);
        }

        DB::transaction(function () use ($visit) {
            CommissionEntry::query()->where('visit_id', $visit->id)->delete();
            LedgerEntry::query()->where('visit_id', $visit->id)->delete();
            Receivable::query()->where('visit_id', $visit->id)->delete();
            Payment::query()->where('visit_id', $visit->id)->delete();
            $visit->delete(); // invoice & invoice_items ikut terhapus via cascade
        });

        return response()->json(['success' => true, 'data' => ['message' => 'Invoice berhasil dihapus']]);
    }

    /**
     * Catat pembayaran untuk sebuah kunjungan (lunas/DP/angsuran).
     */
    public function storePayment(Request $request): JsonResponse
    {
        $request->validate([
            'visit_id' => ['required', 'exists:visits,id'],
            'method' => ['required', 'in:cash,qris'],
            'amount' => ['required', 'numeric', 'gt:0'],
            'paid_by' => ['nullable', 'string', 'max:50'],
        ]);

        $visit = Visit::query()->withSum('payments as total_paid_amount', 'amount')->findOrFail($request->visit_id);

        if ($visit->status === Visit::STATUS_CANCELLED) {
            return response()->json(['message' => 'Kunjungan telah dibatalkan'], 422);
        }

        $alreadyPaid = (float) $visit->payments
            ->where('status', Payment::STATUS_CONFIRMED)
            ->sum('amount');
        $remaining = (float) $visit->total - $alreadyPaid;

        if ($request->amount > $remaining + 0.0001) {
            return response()->json([
                'message' => 'Jumlah melebihi sisa tagihan',
                'remaining' => $remaining,
            ], 422);
        }

        $payment = DB::transaction(function () use ($request, $visit, $alreadyPaid) {
            $isCash = $request->method === Payment::METHOD_CASH;
            $isFull = (float) $request->amount >= ((float) $visit->total - $alreadyPaid);

            $payment = Payment::query()->create([
                'visit_id' => $visit->id,
                'method' => $request->method,
                'status' => $isCash ? Payment::STATUS_CONFIRMED : Payment::STATUS_PENDING,
                'amount' => $request->amount,
                'change' => 0,
                'paid_by' => $request->paid_by,
                'paid_at' => $isCash ? now() : null,
                'verified_by' => $isCash ? $request->user()->id : null,
                'verified_at' => $isCash ? now() : null,
            ]);

            if ($isCash) {
                $this->postPaymentLedger($payment);
                $this->syncReceivableAndVisit($visit, $isFull);
            }

            return $payment->load(['visit', 'visit.invoice']);
        });

        $message = $request->method === Payment::METHOD_CASH
            ? 'Pembayaran tunai tercatat'
            : 'Pembayaran QRIS menunggu verifikasi kasir';

        return response()->json([
            'success' => true,
            'data' => ['payment' => $payment, 'message' => $message],
        ], 201);
    }

    /**
     * Konfirmasi pembayaran QRIS setelah kasir memastikan dana masuk.
     */
    public function verifyPayment(Request $request, Payment $payment): JsonResponse
    {
        if ($payment->status !== Payment::STATUS_PENDING) {
            return response()->json(['message' => 'Pembayaran bukan status pending'], 422);
        }

        DB::transaction(function () use ($request, $payment) {
            $payment->update([
                'status' => Payment::STATUS_CONFIRMED,
                'verified_by' => $request->user()->id,
                'verified_at' => now(),
            ]);

            $totalConfirmed = (float) $payment->visit->payments()
                ->where('status', Payment::STATUS_CONFIRMED)
                ->sum('amount');
            $isFull = $totalConfirmed >= (float) $payment->visit->total;

            $this->postPaymentLedger($payment);
            $this->syncReceivableAndVisit($payment->visit, $isFull);
        });

        return response()->json([
            'success' => true,
            'data' => ['payment' => $payment->fresh()],
        ]);
    }

    /**
     * Daftar kunjungan + pembayaran (untuk layar kasir).
     */
    public function indexVisits(Request $request): JsonResponse
    {
        $visits = Visit::query()
            ->with(['patient:id,name', 'doctor:id,name', 'items', 'payments'])
            ->orderByDesc('visit_date')
            ->paginate($request->get('per_page', 25));

        return response()->json(['success' => true, 'data' => ['visits' => $visits]]);
    }

    private function postPaymentLedger(Payment $payment): void
    {
        LedgerEntry::query()->create([
            'date' => $payment->verified_at?->toDateString() ?? now()->toDateString(),
            'type' => LedgerEntry::TYPE_INCOME,
            'account' => 'revenue',
            'description' => "Penerimaan pembayaran {$payment->method} — {$payment->visit->invoice_number}",
            'amount' => $payment->amount,
            'payment_id' => $payment->id,
            'visit_id' => $payment->visit_id,
        ]);
    }

    private function syncReceivableAndVisit(Visit $visit, bool $isFull): void
    {
        $confirmed = (float) $visit->payments()
            ->where('status', Payment::STATUS_CONFIRMED)
            ->sum('amount');

        if ($isFull) {
            if ($visit->receivable) {
                $visit->receivable->update([
                    'paid_amount' => $confirmed,
                    'remaining' => 0,
                    'status' => Receivable::STATUS_SETTLED,
                ]);
            }
            $visit->invoice?->update(['payment_status' => Invoice::PAY_PAID]);
        } else {
            $visit->invoice?->update(['payment_status' => Invoice::PAY_PARTIAL]);

            Receivable::query()->updateOrCreate(
                ['visit_id' => $visit->id],
                [
                    'total_amount' => $visit->total,
                    'paid_amount' => $confirmed,
                    'remaining' => $visit->total - $confirmed,
                    'due_date' => now()->addDays(14)->toDateString(),
                    'status' => Receivable::STATUS_PARTIAL,
                ],
            );
        }
    }

    /**
     * Terima pelunasan piutang pasien.
     */
    public function payReceivable(Request $request, Receivable $receivable): JsonResponse
    {
        $request->validate([
            'amount' => ['required', 'numeric', 'gt:0'],
            'method' => ['required', 'in:cash,qris'],
        ]);

        $remaining = (float) $receivable->remaining;

        if ($request->amount > $remaining + 0.0001) {
            return response()->json(['message' => 'Melebihi sisa piutang', 'remaining' => $remaining], 422);
        }

        $payment = DB::transaction(function () use ($request, $receivable, $remaining) {
            $visit = $receivable->visit;

            $isCash = $request->method === Payment::METHOD_CASH;

            $payment = Payment::query()->create([
                'visit_id' => $visit->id,
                'method' => $request->method,
                'status' => $isCash ? Payment::STATUS_CONFIRMED : Payment::STATUS_PENDING,
                'amount' => $request->amount,
                'change' => 0,
                'paid_by' => $request->paid_by ?? null,
                'paid_at' => $isCash ? now() : null,
                'verified_by' => $isCash ? $request->user()->id : null,
                'verified_at' => $isCash ? now() : null,
            ]);

            if ($isCash) {
                $this->postPaymentLedger($payment);

                $newPaid = (float) $receivable->paid_amount + (float) $request->amount;
                $newRemaining = (float) $receivable->remaining - (float) $request->amount;

                $receivable->update([
                    'paid_amount' => $newPaid,
                    'remaining' => max(0, $newRemaining),
                    'status' => $newRemaining <= 0 ? Receivable::STATUS_SETTLED : Receivable::STATUS_PARTIAL,
                ]);

                if ($newRemaining <= 0) {
                    $visit->invoice?->update(['payment_status' => Invoice::PAY_PAID]);
                } else {
                    $visit->invoice?->update(['payment_status' => Invoice::PAY_PARTIAL]);
                }
            }

            return $payment;
        });

        return response()->json([
            'success' => true,
            'data' => [
                'payment' => $payment,
                'receivable' => $receivable->fresh(),
            ],
        ], 201);
    }
}