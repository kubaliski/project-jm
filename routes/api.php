<?php
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\PublicContactController;
use App\Http\Controllers\PublicPostController;
use Illuminate\Support\Facades\Route;

// Rutas públicas
Route::post('/public/contacts', [PublicContactController::class, 'store']);
Route::get('/public/posts', [PublicPostController::class, 'index']);
Route::get('/public/posts/latest-posts', [PublicPostController::class, 'latestPosts']); // Primero las rutas específicas
Route::get('/public/posts/{slug}', [PublicPostController::class, 'show']); // Después las rutas con parámetros

Route::post('/login', [AuthController::class, 'login']);

//Rutas protegidas
Route::middleware('auth:sanctum')->group(function () {

    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);
    Route::get('posts/count', [PostController::class, 'count']);
    Route::apiResource('posts', PostController::class);

   // Rutas de contactos
   Route::get('/contacts/count', [ContactController::class, 'count']);
   Route::get('/contacts', [ContactController::class, 'index']);
   Route::post('/contacts', [ContactController::class, 'store']);
   Route::get('/contacts/{contact}', [ContactController::class, 'show']);
   Route::put('/contacts/{contact}', [ContactController::class, 'update']);
   Route::patch('/contacts/{contact}/status', [ContactController::class, 'updateStatus']);
   Route::delete('/contacts/{contact}', [ContactController::class, 'destroy']);
});