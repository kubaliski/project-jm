<?php

namespace App\Http\Controllers;

use App\Models\Role;
use App\Models\Permission;
use App\Http\Requests\Role\StoreRequest;
use App\Http\Requests\Role\UpdateRequest;
use App\Http\Requests\Role\UpdatePermissionsRequest;
use App\Http\Requests\Role\AddPermissionsRequest;
use App\Http\Requests\Role\RemovePermissionsRequest;
use Illuminate\Http\JsonResponse;

class RoleController extends Controller
{
   public function __construct()
   {
       $this->authorizeResource(Role::class, 'role');
   }

   /**
    * Display a listing of the roles.
    */
   public function index(): JsonResponse
   {
       $roles = Role::with('permissions')->get();
       return response()->json($roles);
   }

   /**
    * Store a newly created role in storage.
    */
   public function store(StoreRequest $request): JsonResponse
   {
       $role = Role::create($request->validated());

       if ($request->has('permissions')) {
           $role->syncPermissions($request->permissions);
       }

       return response()->json([
           'message' => 'Rol creado correctamente',
           'role' => $role->load('permissions')
       ], 201);
   }

   /**
    * Display the specified role.
    */
   public function show(Role $role): JsonResponse
   {
       return response()->json($role->load('permissions'));
   }

   /**
    * Update the specified role in storage.
    */
   public function update(UpdateRequest $request, Role $role): JsonResponse
   {
       $role->update($request->validated());

       if ($request->has('permissions')) {
           $role->syncPermissions($request->permissions);
       }

       return response()->json([
           'message' => 'Rol actualizado correctamente',
           'role' => $role->load('permissions')
       ]);
   }

   /**
    * Remove the specified role from storage.
    */
   public function destroy(Role $role): JsonResponse
   {
       $role->permissions()->detach();
       $role->delete();

       return response()->json([
           'message' => 'Rol eliminado correctamente'
       ], 200);
   }

   /**
    * Update all permissions for a role.
    */
   public function updatePermissions(UpdatePermissionsRequest $request, Role $role): JsonResponse
   {
       $this->authorize('managePermissions', $role);

       $role->syncPermissions($request->permissions);

       return response()->json([
           'message' => 'Permisos actualizados correctamente',
           'role' => $role->load('permissions')
       ]);
   }

   /**
    * Add permissions to a role.
    */
   public function addPermissions(AddPermissionsRequest $request, Role $role): JsonResponse
   {
       $this->authorize('managePermissions', $role);

       $role->givePermissionTo($request->permissions);

       return response()->json([
           'message' => 'Permisos agregados correctamente',
           'role' => $role->load('permissions')
       ]);
   }

   /**
    * Remove permissions from a role.
    */
   public function removePermissions(RemovePermissionsRequest $request, Role $role): JsonResponse
   {
       $this->authorize('managePermissions', $role);

       $role->revokePermissionTo($request->permissions);

       return response()->json([
           'message' => 'Permisos eliminados correctamente',
           'role' => $role->load('permissions')
       ]);
   }

   /**
    * Get all available permissions grouped by their type.
    */
   public function getAllPermissions(): JsonResponse
   {
       $this->authorize('viewAny', Role::class);

       $permissions = Permission::getByGroup();
       return response()->json($permissions);
   }
}