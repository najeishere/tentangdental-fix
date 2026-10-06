<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\LabShipment;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class LabShipmentController extends Controller
{
    private function success(array $data, int $status = 200): JsonResponse
    {
        return response()->json(['success' => true, 'data' => $data], $status);
    }

    /**
     * Daftar pengiriman lab (riwayat).
     */
    public function index(): JsonResponse
    {
        $shipments = LabShipment::query()
            ->orderByDesc('sent_date')
            ->orderByDesc('id')
            ->get();

        return $this->success(['shipments' => $shipments]);
    }

    /**
     * Catat pengiriman baru (draft atau terkirim).
     */
    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'patient_name' => ['required', 'string', 'max:191'],
            'job_type' => ['required', 'string', 'max:191'],
            'vendor' => ['required', 'string', 'max:191'],
            'sent_date' => ['required', 'date'],
            'estimated_date' => ['nullable', 'date', 'after_or_equal:sent_date'],
            'cost' => ['nullable', 'numeric', 'min:0'],
            'instructions' => ['nullable', 'string'],
            'status' => ['nullable', 'in:draft,sent'],
        ]);

        $shipment = LabShipment::query()->create([
            'patient_id' => null,
            'patient_name' => $data['patient_name'],
            'job_type' => $data['job_type'],
            'vendor' => $data['vendor'],
            'sent_date' => $data['sent_date'],
            'estimated_date' => $data['estimated_date'] ?? null,
            'cost' => $data['cost'] ?? null,
            'instructions' => $data['instructions'] ?? null,
            'status' => $data['status'] ?? LabShipment::STATUS_SENT,
        ]);

        return $this->success(['shipment' => $shipment], 201);
    }

    /**
     * Ubah status (draft -> terkirim -> selesai) atau detail kiriman.
     */
    public function update(Request $request, LabShipment $labShipment): JsonResponse
    {
        $data = $request->validate([
            'status' => ['sometimes', 'in:draft,sent,done'],
            'estimated_date' => ['sometimes', 'nullable', 'date'],
            'cost' => ['sometimes', 'nullable', 'numeric', 'min:0'],
            'instructions' => ['sometimes', 'nullable', 'string'],
        ]);

        $labShipment->update($data);

        return $this->success(['shipment' => $labShipment->fresh()]);
    }

    /**
     * Hapus kiriman.
     */
    public function destroy(LabShipment $labShipment): JsonResponse
    {
        $labShipment->delete();

        return $this->success(['message' => 'Pengiriman lab dihapus']);
    }
}
