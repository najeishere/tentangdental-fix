<?php

namespace App\Http\Controllers\Api;

use App\Models\Queue;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class QueueController
{
    public function index(Request $request): JsonResponse
    {
        $date = $request->date('date')?->toDateString() ?? now()->toDateString();
        $queues = Queue::query()->with(['patient:id,name,phone', 'doctor:id,name,specialist'])
            ->whereDate('queue_date', $date)->orderBy('queue_time')->orderBy('id')->get();

        return response()->json(['success' => true, 'data' => ['queues' => $queues, 'date' => $date]]);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'patient_id' => ['required', 'exists:users,id'],
            'doctor_id' => ['nullable', 'exists:users,id'],
            'queue_date' => ['required', 'date'],
            'queue_time' => ['nullable', 'date_format:H:i'],
            'complaint' => ['nullable', 'string'],
        ]);

        $queue = DB::transaction(function () use ($data) {
            $last = Queue::whereDate('queue_date', $data['queue_date'])->lockForUpdate()->count();
            return Queue::create($data + [
                'queue_number' => 'A-' . str_pad((string) ($last + 1), 3, '0', STR_PAD_LEFT),
                'status' => 'waiting',
            ]);
        });

        return response()->json(['success' => true, 'data' => ['queue' => $queue->load(['patient:id,name,phone', 'doctor:id,name'])]], 201);
    }

    public function validateQueue(Request $request, Queue $queue): JsonResponse
    {
        $queue->update(['status' => 'in_progress', 'validated_by' => $request->user()->id, 'validated_at' => now()]);
        return response()->json(['success' => true, 'data' => ['queue' => $queue->fresh(['patient:id,name,phone', 'doctor:id,name'])]]);
    }
}
