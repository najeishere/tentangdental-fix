<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Cek role user terautentikasi (guard-agnostic, cocok untuk API Sanctum).
 *
 * Penggunaan: ->middleware('checkRole:admin,kasir') -> salah satu role boleh.
 */
class CheckPosition
{
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        $user = $request->user();

        if (!$user) {
            return response()->json(['message' => 'Unauthenticated'], 401);
        }

        $allowed = collect($roles)
            ->flatMap(fn ($r) => preg_split('/[|,]/', $r))
            ->filter()
            ->values()
            ->all();

        if (!in_array($user->primaryRole(), $allowed, true)) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        return $next($request);
    }
}