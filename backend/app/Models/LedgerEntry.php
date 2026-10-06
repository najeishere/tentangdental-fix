<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class LedgerEntry extends Model
{
    public const TYPE_INCOME = 'income';
    public const TYPE_EXPENSE = 'expense';

    protected $fillable = [
        'date', 'type', 'account', 'description', 'amount',
        'payment_id', 'expense_id', 'payroll_id', 'visit_id',
    ];

    protected function casts(): array
    {
        return [
            'date' => 'date',
            'amount' => 'decimal:2',
        ];
    }

    public function payment(): BelongsTo
    {
        return $this->belongsTo(Payment::class);
    }

    public function expense(): BelongsTo
    {
        return $this->belongsTo(Expense::class);
    }

    public function payroll(): BelongsTo
    {
        return $this->belongsTo(DoctorPayroll::class);
    }

    /**
     * Buat pengeluaran + entri buku besar sekaligus (dalam satu DB transaction).
     */
    public static function createExpenseFor(array $data): Expense
    {
        return \Illuminate\Support\Facades\DB::transaction(function () use ($data) {
            $expense = Expense::query()->create($data);

            static::query()->create([
                'date' => $expense->date,
                'type' => static::TYPE_EXPENSE,
                'account' => 'expense',
                'description' => $expense->description ?: ($expense->category?->name ?? 'Pengeluaran'),
                'amount' => $expense->amount,
                'expense_id' => $expense->id,
            ]);

            return $expense;
        });
    }
}