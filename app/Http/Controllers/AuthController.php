<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required'],
        ]);

        if (Auth::attempt($credentials)) {
            $user = Auth::user();
            $token = $user->createToken('auth-token')->plainTextToken;

            // Cargar roles y permisos
            $user->load('roles.permissions');

            // Crear una estructura más limpia y plana de permisos
            $permissions = $user->getAllPermissions()->pluck('name')->unique()->values();

            return response()->json([
                'user' => $user,
                'permissions' => $permissions,
                'token' => $token
            ]);
        }

        throw ValidationException::withMessages([
            'email' => ['Las credenciales proporcionadas son incorrectas.'],
        ]);
    }

    public function logout(Request $request)
    {
        try {
            if ($request->user()) {
                $request->user()->tokens()->delete();
                return response()->json(['message' => 'Sesión cerrada correctamente']);
            }
            return response()->json(['message' => 'No hay sesión activa'], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error al cerrar sesión'], 500);
        }
    }

    public function user(Request $request)
    {
        try {
            $user = $request->user();
            if ($user) {
                // Cargar roles y permisos también aquí
                $user->load('roles.permissions');
                $permissions = $user->getAllPermissions()->pluck('name')->unique()->values();

                return response()->json([
                    'user' => $user,
                    'permissions' => $permissions,
                ]);
            }
            return response()->json(['message' => 'Usuario no autenticado'], 401);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error al obtener usuario'], 500);
        }
    }
}