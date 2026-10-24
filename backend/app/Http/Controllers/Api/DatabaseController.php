<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class DatabaseController
{
    private const HIDDEN_COLUMNS = [
        'password',
        'remember_token',
        'token',
        'last_used_token',
    ];

    public function tables(): JsonResponse
    {
        $tables = collect(Schema::getTableListing())
            ->reject(fn (string $table) => in_array($table, ['cache', 'cache_locks', 'jobs', 'job_batches', 'failed_jobs', 'sessions'], true))
            ->map(function (string $table): array {
                return [
                    'name' => $table,
                    'columns' => collect(Schema::getColumns($table))->map(fn (array $column): array => [
                        'name' => $column['name'],
                        'type' => $column['type_name'] ?? $column['type'],
                        'nullable' => $column['nullable'],
                        'default' => $column['default'],
                    ])->values(),
                    'count' => DB::table($table)->count(),
                ];
            })
            ->values();

        return response()->json(['success' => true, 'data' => ['tables' => $tables]]);
    }

    public function rows(Request $request, string $table): JsonResponse
    {
        $allowedTables = collect(Schema::getTableListing())
            ->reject(fn (string $name) => in_array($name, ['cache', 'cache_locks', 'jobs', 'job_batches', 'failed_jobs', 'sessions'], true));

        abort_unless($allowedTables->contains($table), 404, 'Tabel tidak ditemukan.');

        $perPage = min(max((int) $request->integer('per_page', 25), 1), 100);
        $columns = collect(Schema::getColumnListing($table))
            ->reject(fn (string $column) => in_array($column, self::HIDDEN_COLUMNS, true))
            ->values()
            ->all();

        $rows = DB::table($table)
            ->select($columns)
            ->orderByDesc($columns[0] ?? 'id')
            ->paginate($perPage);

        $rows->getCollection()->transform(function (object $row): array {
            return collect((array) $row)->map(function (mixed $value, string $key): mixed {
                return in_array($key, self::HIDDEN_COLUMNS, true) ? '[REDACTED]' : $value;
            })->all();
        });

        return response()->json(['success' => true, 'data' => [
            'table' => $table,
            'columns' => $columns,
            'rows' => $rows,
        ]]);
    }
}
