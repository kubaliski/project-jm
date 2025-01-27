<?php

namespace App\Http\Controllers;

use App\Models\AppInfo;
use App\Http\Requests\AppInfo\UpdateRequest;
use Illuminate\Http\JsonResponse;

class AppInfoController extends Controller
{
    public function __construct()
    {
        $this->authorizeResource(AppInfo::class, 'app_info');
    }

    public function update(UpdateRequest $request, AppInfo $appInfo): JsonResponse
    {
        $appInfo->update($request->validated());

        return response()->json([
            'message' => 'Información actualizada correctamente',
            'app_info' => $appInfo
        ]);
    }
}