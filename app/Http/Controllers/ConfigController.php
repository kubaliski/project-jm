<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Log;

class ConfigController extends Controller
{
    public function editorConfig()
    {
        // Agregar logs para debugging
        Log::info('Usuario accediendo a editorConfig', [
            'user_id' => auth()->id(),
            'user' => auth()->user(),
            'tinymce_key_exists' => !empty(config('services.tinymce.key'))
        ]);

        // Verificar si la key existe
        if (!config('services.tinymce.key')) {
            return response()->json([
                'message' => 'TinyMCE API key no configurada'
            ], 500);
        }

        return response()->json([
            'tinymceApiKey' => config('services.tinymce.key')
        ]);
    }
}