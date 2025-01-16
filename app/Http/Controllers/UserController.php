<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;

class UserController extends Controller
{
    public function __construct()
    {
        $this->authorizeResource(User::class, 'user');
    }

    public function index(): JsonResponse
    {
        $users = User::with('roles.permissions')
            ->orderBy('name')
            ->get();

        return response()->json($users);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => ['required', Password::defaults()],
            'roles' => 'array|exists:roles,id'
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'last_name' => $validated['last_name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
        ]);

        if (isset($validated['roles'])) {
            $this->authorize('assignRoles', $user);
            $user->roles()->sync($validated['roles']);
        }

        return response()->json([
            'message' => 'Usuario creado correctamente',
            'user' => $user->load('roles.permissions')
        ], 201);
    }

    public function show(User $user): JsonResponse
    {
        return response()->json($user->load('roles.permissions'));
    }

    public function update(Request $request, User $user): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $user->id,
            'password' => ['sometimes', Password::defaults()],
            'roles' => 'array|exists:roles,id'
        ]);

        if (isset($validated['password'])) {
            $validated['password'] = Hash::make($validated['password']);
        } else {
            unset($validated['password']);
        }

        $user->update($validated);

        if (isset($validated['roles'])) {
            $this->authorize('assignRoles', $user);
            $user->roles()->sync($validated['roles']);
        }

        return response()->json([
            'message' => 'Usuario actualizado correctamente',
            'user' => $user->load('roles.permissions')
        ]);
    }

    public function destroy(User $user): JsonResponse
    {
        if ($user->id === auth()->id()) {
            return response()->json([
                'message' => 'No puedes eliminar tu propio usuario'
            ], 403);
        }

        $user->delete();

        return response()->json([
            'message' => 'Usuario eliminado correctamente'
        ]);
    }

    public function assignRoles(Request $request, User $user): JsonResponse
    {
        $this->authorize('assignRoles', $user);

        $validated = $request->validate([
            'roles' => 'required|array|exists:roles,id'
        ]);

        $user->roles()->sync($validated['roles']);

        return response()->json([
            'message' => 'Roles actualizados correctamente',
            'user' => $user->load('roles.permissions')
        ]);
    }
}