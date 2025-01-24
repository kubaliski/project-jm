<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\AppInfoController;
use App\Http\Controllers\BannerController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\PublicContactController;
use App\Http\Controllers\PublicPostController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

// Rutas públicas
Route::prefix('public')->group(function () {
    // Posts públicos
    Route::get('/posts/latest-posts', [PublicPostController::class, 'latestPosts']);
    Route::get('/posts/{slug}', [PublicPostController::class, 'show']);
    Route::get('/posts', [PublicPostController::class, 'index']);

    // Contactos públicos
    Route::post('/contacts', [PublicContactController::class, 'store']);

    // Banner público activo
    Route::get('/banner/active', [BannerController::class, 'active']);

    // Información de la aplicación
    Route::get('/app-info', [AppInfoController::class, 'index']);
});

// Autenticación y gestión de contraseña
Route::controller(AuthController::class)->group(function () {
    Route::post('/login', 'login');
    Route::post('/forgot-password', 'forgotPassword')->name('password.email');
    Route::post('/reset-password', 'resetPassword')->name('password.update');
});

// Rutas protegidas
Route::middleware('auth:sanctum')->group(function () {
    // Auth
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);

    // Información de la aplicación
    Route::put('app-info/{app_info}', [AppInfoController::class, 'update']);

    // Banners
    Route::patch('banners/{banner}/priority', [BannerController::class, 'updatePriority'])
        ->name('banners.update-priority');
    Route::apiResource('banners', BannerController::class);

    // Contactos
    Route::get('/contacts/count', [ContactController::class, 'count']);
    Route::patch('/contacts/{contact}/status', [ContactController::class, 'updateStatus']);
    Route::apiResource('contacts', ContactController::class);

    // Posts
    Route::get('posts/count', [PostController::class, 'count']);
    Route::apiResource('posts', PostController::class);


    // Usuarios y roles
    Route::post('/users/{user}/roles', [UserController::class, 'assignRoles'])
        ->name('users.assign-roles');
    Route::put('/users/profile', [UserController::class, 'updateProfile'])
        ->name('users.update-profile');
    Route::apiResource('users', UserController::class);

    // Roles y permisos
    Route::get('permissions', [RoleController::class, 'getAllPermissions']);
    Route::put('roles/{role}/permissions', [RoleController::class, 'updatePermissions']);
    Route::post('roles/{role}/permissions', [RoleController::class, 'addPermissions']);
    Route::delete('roles/{role}/permissions', [RoleController::class, 'removePermissions']);
    Route::apiResource('roles', RoleController::class);

});