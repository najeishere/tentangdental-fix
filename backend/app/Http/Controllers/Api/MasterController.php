<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\{CommissionEntry, Expense, ExpenseCategory, InventoryItem, InventoryTransaction, Tindakan, User};
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class MasterController extends Controller
{
    public function success(array $data, int $status = 200): \Illuminate\Http\JsonResponse
    {
        return response()->json(['success' => true, 'data' => $data], $status);
    }

    // ======================= OPTIONS (form billing) =======================
    public function options(): \Illuminate\Http\JsonResponse
    {
        $patients = User::query()->customers()
            ->orderBy('name')
            ->get(['id', 'name', 'phone']);
        $doctors = User::query()->doctors()
            ->orderBy('name')
            ->get(['id', 'name', 'specialist']);

        return $this->success([
            'patients' => $patients,
            'doctors' => $doctors,
        ]);
    }

    // ======================= DOKTER (akses dokter) =======================
    public function indexDoctors(): \Illuminate\Http\JsonResponse
    {
        $doctors = User::query()->doctors()
            ->withCount('doctorVisits')
            ->orderByDesc('is_active')
            ->orderBy('name')
            ->get(['id', 'name', 'email', 'phone', 'specialist', 'employee_number', 'is_active']);

        return $this->success(['doctors' => $doctors]);
    }

    public function storeDoctor(Request $request): \Illuminate\Http\JsonResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:191'],
            'email' => ['required', 'email', 'max:191', 'unique:users,email'],
            'phone' => ['nullable', 'string', 'max:20'],
            'specialist' => ['nullable', 'string', 'max:191'],
            'employee_number' => ['nullable', 'string', 'max:50'],
            'password' => ['required', 'string', 'min:6'],
            'is_active' => ['nullable', 'boolean'],
        ]);

        $doctor = DB::transaction(function () use ($data) {
            $user = User::query()->create([
                'name' => $data['name'],
                'email' => $data['email'],
                'phone' => $data['phone'] ?? null,
                'specialist' => $data['specialist'] ?? null,
                'employee_number' => $data['employee_number'] ?? null,
                'is_active' => (bool) ($data['is_active'] ?? true),
                'password' => $data['password'],
            ]);
            $user->assignRole('doctor');

            return $user;
        });

        return $this->success(['doctor' => $doctor->fresh()], 201);
    }

    public function updateDoctor(Request $request, User $doctor): \Illuminate\Http\JsonResponse
    {
        abort_unless($doctor->hasRole('doctor'), 404);

        $data = $request->validate([
            'name' => ['required', 'string', 'max:191'],
            'email' => ['required', 'email', 'max:191', Rule::unique('users', 'email')->ignore($doctor->id)],
            'phone' => ['nullable', 'string', 'max:20'],
            'specialist' => ['nullable', 'string', 'max:191'],
            'employee_number' => ['nullable', 'string', 'max:50'],
            'password' => ['nullable', 'string', 'min:6'],
            'is_active' => ['nullable', 'boolean'],
        ]);

        $fill = [
            'name' => $data['name'],
            'email' => $data['email'],
            'phone' => $data['phone'] ?? null,
            'specialist' => $data['specialist'] ?? null,
            'employee_number' => $data['employee_number'] ?? null,
            'is_active' => (bool) ($data['is_active'] ?? true),
        ];

        if (!empty($data['password'])) {
            $fill['password'] = $data['password'];
        }

        DB::transaction(function () use ($doctor, $fill) {
            $doctor->update($fill);
            $doctor->syncRoles(['doctor']);
        });

        return $this->success(['doctor' => $doctor->fresh()]);
    }

    public function destroyDoctor(User $doctor): \Illuminate\Http\JsonResponse
    {
        abort_unless($doctor->hasRole('doctor'), 404);

        if (CommissionEntry::query()->where('doctor_id', $doctor->id)->exists()) {
            return response()->json([
                'success' => false,
                'message' => 'Dokter sudah memiliki data komisi/bagi hasil sehingga tidak bisa dihapus. Nonaktifkan saja.',
            ], 422);
        }

        // doctor_id pada visits bernilai nullOnDelete, sehingga aman
        $doctor->delete();

        return $this->success(['message' => 'Dokter berhasil dihapus']);
    }

    // ======================= TINDAKAN =======================
    public function indexTindakans(Request $request)
    {
        $query = Tindakan::query()->orderBy('name');

        if ($request->boolean('active_only')) {
            $query->where('is_active', true);
        }

        return $this->success(['tindakans' => $query->paginate($request->get('per_page', 25))]);
    }

    public function storeTindakan(Request $request)
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:191'],
            'description' => ['nullable', 'string'],
            'price' => ['required', 'numeric', 'min:0'],
            'komisi_persen' => ['required', 'numeric', 'between:0,100'],
            'is_active' => ['boolean'],
        ]);

        $tindakan = Tindakan::query()->create($data);

        return $this->success(['tindakan' => $tindakan], 201);
    }

    public function updateTindakan(Request $request, Tindakan $tindakan)
    {
        $data = $request->validate([
            'name' => ['sometimes', 'string', 'max:191'],
            'description' => ['nullable', 'string'],
            'price' => ['sometimes', 'numeric', 'min:0'],
            'komisi_persen' => ['sometimes', 'numeric', 'between:0,100'],
            'is_active' => ['boolean'],
        ]);

        $tindakan->update($data);

        return $this->success(['tindakan' => $tindakan->fresh()]);
    }

    public function destroyTindakan(Tindakan $tindakan)
    {
        $tindakan->delete();

        return $this->success(['message' => 'Tindakan dihapus']);
    }

    // ======================= INVENTORY =======================
    public function indexInventory(Request $request)
    {
        $query = InventoryItem::query()
            ->withSum('transactions as total_qty', 'quantity')
            ->orderBy('name')
            ->paginate($request->get('per_page', 25));

        $query->each(function (InventoryItem $item) {
            $item->low_stock = (float) $item->stock <= (float) $item->min_stock;
            unset($item->total_qty);
        });

        return $this->success(['items' => $query]);
    }

    public function storeInventoryItem(Request $request)
    {
        $data = $request->validate([
            'code' => ['nullable', 'string', 'max:50', Rule::unique('inventory_items', 'code')],
            'name' => ['required', 'string', 'max:191'],
            'unit' => ['required', 'string', 'max:30'],
            'stock' => ['required', 'numeric', 'min:0'],
            'min_stock' => ['required', 'numeric', 'min:0'],
            'unit_cost' => ['required', 'numeric', 'min:0'],
        ]);

        $item = InventoryItem::query()->create($data);

        return $this->success(['item' => $item], 201);
    }

    public function stockIn(Request $request)
    {
        $data = $request->validate([
            'inventory_item_id' => ['required', 'exists:inventory_items,id'],
            'quantity' => ['required', 'numeric', 'gt:0'],
            'unit_cost' => ['required', 'numeric', 'min:0'],
            'note' => ['nullable', 'string'],
        ]);

        $item = InventoryItem::findOrFail($data['inventory_item_id']);

        InventoryTransaction::query()->create([
            'inventory_item_id' => $item->id,
            'type' => 'purchase',
            'quantity' => $data['quantity'],
            'unit_cost' => $data['unit_cost'],
            'note' => $data['note'] ?? 'Pembelian stok',
        ]);

        $item->increment('stock', $data['quantity']);
        $item->update(['unit_cost' => $data['unit_cost']]);

        return $this->success(['item' => $item->fresh()]);
    }

    public function stockOut(Request $request)
    {
        $data = $request->validate([
            'inventory_item_id' => ['required', 'exists:inventory_items,id'],
            'quantity' => ['required', 'numeric', 'gt:0'],
            'note' => ['nullable', 'string'],
        ]);

        $item = InventoryItem::findOrFail($data['inventory_item_id']);

        if ((float) $item->stock < (float) $data['quantity']) {
            return response()->json([
                'message' => 'Stok tidak mencukupi',
            ], 422);
        }

        InventoryTransaction::query()->create([
            'inventory_item_id' => $item->id,
            'type' => 'usage',
            'quantity' => -$data['quantity'],
            'unit_cost' => $item->unit_cost,
            'note' => $data['note'] ?? 'Pemakaian bahan',
        ]);

        $item->decrement('stock', $data['quantity']);

        return $this->success(['item' => $item->fresh()]);
    }

    // ======================= PENGELUARAN =======================
    public function indexExpenses(Request $request)
    {
        $query = Expense::query()
            ->with('category')
            ->orderByDesc('date');

        if ($request->filled('from')) {
            $query->whereDate('date', '>=', $request->date('from'));
        }
        if ($request->filled('to')) {
            $query->whereDate('date', '<=', $request->date('to'));
        }

        return $this->success(['expenses' => $query->paginate($request->get('per_page', 25))]);
    }

    public function indexExpenseCategories()
    {
        return $this->success([
            'categories' => ExpenseCategory::query()->orderBy('name')->get(),
        ]);
    }

    public function storeExpense(Request $request)
    {
        $data = $request->validate([
            'expense_category_id' => ['required', 'exists:expense_categories,id'],
            'date' => ['required', 'date'],
            'amount' => ['required', 'numeric', 'gt:0'],
            'description' => ['nullable', 'string'],
        ]);

        $expense = \App\Models\LedgerEntry::createExpenseFor($data);

        return $this->success(['expense' => $expense], 201);
    }
}