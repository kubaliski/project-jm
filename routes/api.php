<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\PublicPostController;
use Illuminate\Support\Facades\Route;

// Rutas públicas
Route::get('/public/posts', [PublicPostController::class, 'index']);
Route::get('/public/posts/{slug}', [PublicPostController::class, 'show']);
Route::post('/login', [AuthController::class, 'login']);

//Rutas protegidas
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);
    Route::get('posts/count', [PostController::class, 'count']);
    Route::apiResource('posts', PostController::class);

});