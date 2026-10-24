<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    /**
     * Login untuk semua role (admin, doctor, customer).
     */
    public function login(Request $request): JsonResponse
    {
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required', 'string'],
        ]);

        $user = User::query()
            ->where('email', $credentials['email'])
            ->where('is_active', true)
            ->first();

        if (!$user || !Hash::check($credentials['password'], $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['Email atau password salah.'],
            ]);
        }

        $token = $user->createToken('auth', [$user->primaryRole()])->plainTextToken;
        $role = $user->primaryRole();
        $payload = $this->userPayload($user, $role);

        return response()->json([
            'success' => true,
            'data' => [
                'token' => $token,
                'access_token' => $token,
                'token_type' => 'Bearer',
                'user' => $payload,
                'admin' => $payload,
            ],
        ]);
    }

    /**
     * Profil user yang sedang login.
     */
    public function me(Request $request): JsonResponse
    {
        $user = $request->user();

        return $this->success([
            'user' => $this->userPayload($user, $user->primaryRole()),
        ]);
    }

    /**
     * Update profil user yang sedang login.
     */
    public function updateProfile(Request $request): JsonResponse
    {
        $user = $request->user();

        $data = $request->validate([
            'name' => ['sometimes', 'string', 'max:255'],
            'phone' => ['sometimes', 'string', 'max:20'],
            'password' => ['sometimes', 'string', 'min:6', 'confirmed'],
        ]);

        if (isset($data['name'])) {
            $user->name = $data['name'];
        }
        if (isset($data['phone'])) {
            $user->phone = $data['phone'];
        }
        if (isset($data['password'])) {
            $user->password = Hash::make($data['password']);
        }

        $user->save();

        return $this->success([
            'user' => $this->userPayload($user, $user->primaryRole()),
            'message' => 'Profil berhasil diperbarui',
        ]);
    }

    /**
     * Logout — mencabut token aktif.
     */
    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();

        return $this->success(['message' => 'Logout berhasil']);
    }

    protected function userPayload(User $user, ?string $role): array
    {
        return [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'phone' => $user->phone,
            'role' => $role,
            'specialist' => $user->specialist,
            'employee_number' => $user->employee_number,
            'profile_photo_url' => null,
        ];
    }

    protected function success(array $data): JsonResponse
    {
        return response()->json(['success' => true, 'data' => $data]);
    }
}
