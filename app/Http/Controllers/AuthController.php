<?php

namespace App\Http\Controllers;

use App\Http\Requests\Auth\ResetPasswordRequest;
use App\Services\IpBlacklistService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Http\JsonResponse;

class AuthController extends Controller
{
    private readonly IpBlacklistService $blacklistService;

    public function __construct(IpBlacklistService $blacklistService)
    {
        $this->blacklistService = $blacklistService;
    }

    /**
     * Handle user login.
     */
    public function login(Request $request): JsonResponse
    {
        // Check if IP is blacklisted
        if ($this->blacklistService->isBlacklisted($request->ip())) {
            Log::warning('Login attempt from blacklisted IP', [
                'ip' => $request->ip(),
                'email' => $request->input('email')
            ]);

            return response()->json([
                'message' => 'Access temporarily blocked due to multiple failed attempts.'
            ], 403);
        }

        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required'],
        ]);

        if (Auth::attempt($credentials)) {
            $user = Auth::user();
            $token = $user->createToken('auth-token')->plainTextToken;

            // Reset attempts on successful login
            $this->blacklistService->resetAttempts($request->ip(), 'login');

            Log::info('Successful login', [
                'user_id' => $user->id,
                'email' => $user->email,
                'ip' => $request->ip()
            ]);

            $user->load('roles.permissions');
            $permissions = $user->getAllPermissions()->pluck('name')->unique()->values();

            return response()->json([
                'user' => $user,
                'permissions' => $permissions,
                'token' => $token
            ]);
        }

        // Record failed attempt
        $isBlocked = $this->blacklistService->recordAttempt($request->ip(), 'login');

        Log::warning('Failed login attempt', [
            'ip' => $request->ip(),
            'email' => $request->input('email'),
            'is_blocked' => $isBlocked
        ]);

        if ($isBlocked) {
            return response()->json([
                'message' => 'Access blocked temporarily due to multiple failed attempts.'
            ], 403);
        }

        throw ValidationException::withMessages([
            'email' => ['Las credenciales proporcionadas son incorrectas.'],
        ]);
    }

    /**
     * Handle user logout.
     */
    public function logout(Request $request): JsonResponse
    {
        try {
            if ($request->user()) {
                $request->user()->tokens()->delete();

                Log::info('User logged out', [
                    'user_id' => $request->user()->id
                ]);

                return response()->json([
                    'message' => 'Sesión cerrada correctamente'
                ]);
            }

            return response()->json([
                'message' => 'No hay sesión activa'
            ], 200);
        } catch (\Exception $e) {
            Log::error('Error during logout', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'message' => 'Error al cerrar sesión'
            ], 500);
        }
    }

    /**
     * Get authenticated user information.
     */
    public function user(Request $request): JsonResponse
    {
        try {
            $user = $request->user();
            if ($user) {
                $user->load('roles.permissions');
                $permissions = $user->getAllPermissions()->pluck('name')->unique()->values();

                return response()->json([
                    'user' => $user,
                    'permissions' => $permissions,
                ]);
            }

            return response()->json([
                'message' => 'Usuario no autenticado'
            ], 401);
        } catch (\Exception $e) {
            Log::error('Error fetching user info', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'message' => 'Error al obtener usuario'
            ], 500);
        }
    }

    /**
     * Handle password reset request.
     */
    public function forgotPassword(Request $request): JsonResponse
    {
        // Check if IP is blacklisted
        if ($this->blacklistService->isBlacklisted($request->ip())) {
            Log::warning('Password reset attempt from blacklisted IP', [
                'ip' => $request->ip(),
                'email' => $request->input('email')
            ]);

            return response()->json([
                'message' => 'Access temporarily blocked due to multiple failed attempts.'
            ], 403);
        }

        $request->validate([
            'email' => 'required|email',
        ]);

        $status = Password::sendResetLink(
            $request->only('email')
        );

        if ($status === Password::RESET_LINK_SENT) {
            Log::info('Password reset link sent', [
                'email' => $request->input('email')
            ]);

            return response()->json([
                'message' => 'Se ha enviado el enlace de recuperación a tu correo.'
            ]);
        }

        // Record failed attempt
        $isBlocked = $this->blacklistService->recordAttempt($request->ip(), 'password_reset');

        Log::warning('Failed password reset attempt', [
            'ip' => $request->ip(),
            'email' => $request->input('email'),
            'is_blocked' => $isBlocked
        ]);

        if ($isBlocked) {
            return response()->json([
                'message' => 'Access blocked temporarily due to multiple attempts.'
            ], 403);
        }

        throw ValidationException::withMessages([
            'email' => [trans($status)],
        ]);
    }

    /**
     * Handle password reset.
     */
    public function resetPassword(ResetPasswordRequest $request): JsonResponse
    {
        $status = Password::reset(
            $request->only('email', 'password', 'password_confirmation', 'token'),
            function ($user, $password) {
                $user->forceFill([
                    'password' => Hash::make($password)
                ])->setRememberToken(Str::random(60));

                $user->save();

                event(new PasswordReset($user));

                Log::info('Password reset successful', [
                    'user_id' => $user->id,
                    'email' => $user->email
                ]);
            }
        );

        if ($status === Password::PASSWORD_RESET) {
            return response()->json([
                'message' => 'Contraseña actualizada correctamente'
            ]);
        }

        throw ValidationException::withMessages([
            'email' => [trans($status)],
        ]);
    }
}