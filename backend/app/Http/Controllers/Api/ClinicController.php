<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ClinicController extends Controller
{
    /**
     * Info klinik yang tampil di halaman pembayaran (nama, alamat, QRIS).
     */
    public function publicInfo(): JsonResponse
    {
        return response()->json(['success' => true, 'data' => [
            'clinic_name' => Setting::get('clinic_name', 'Tentang Dental'),
            'clinic_address' => Setting::get('clinic_address'),
            'clinic_phone' => Setting::get('clinic_phone'),
            'qris' => [
                'value' => Setting::get('clinic_qris_value'),
                'instruction' => Setting::get('qris_instruction'),
            ],
        ]]);
    }

    /**
     * Update QRIS statis klinik (foto / value QR dirender di FE sebagai gambar).
     */
    public function updateQris(Request $request): JsonResponse
    {
        $request->validate([
            'qris_value' => ['required', 'string'],
            'instruction' => ['nullable', 'string'],
        ]);

        Setting::set('clinic_qris_value', $request->qris_value);
        if ($request->filled('instruction')) {
            Setting::set('qris_instruction', $request->instruction);
        }

        return $this->publicInfo();
    }
}