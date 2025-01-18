<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Http\Requests\User\StoreRequest;
use App\Http\Requests\User\UpdateRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Hash;
use Illuminate\Http\Request;

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

    public function store(StoreRequest $request): JsonResponse
    {
        $validated = $request->validated();

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

    public function update(UpdateRequest $request, User $user): JsonResponse
    {
        $validated = $request->validated();

        if (isset($validated['password'])) {
            $validated['password'] = Hash::make($validated['password']);
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