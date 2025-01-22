<?php

namespace App\Http\Controllers;

use App\Models\Banner;
use App\Http\Requests\Banner\StoreRequest;
use App\Http\Requests\Banner\UpdateRequest;
use App\Http\Requests\Banner\UpdatePriorityRequest;
use Illuminate\Http\JsonResponse;

class BannerController extends Controller
{
    public function __construct()
    {
        $this->authorizeResource(Banner::class, 'banner');
    }

    public function index(): JsonResponse
    {
        $banners = Banner::orderBy('created_at', 'desc')->get();
        return response()->json($banners);
    }

    public function store(StoreRequest $request): JsonResponse
    {
        $validated = $request->validated();

        // Si no se proporciona prioridad, establecer como la siguiente disponible
        if (!isset($validated['priority'])) {
            $maxPriority = Banner::max('priority') ?? -1;
            $validated['priority'] = $maxPriority + 1;
        }

        $banner = Banner::create($validated);
        return response()->json($banner, 201);
    }

    public function show(Banner $banner): JsonResponse
    {
        return response()->json($banner);
    }

    public function update(UpdateRequest $request, Banner $banner): JsonResponse
    {
        $banner->update($request->validated());
        return response()->json($banner);
    }

    public function destroy(Banner $banner): JsonResponse
    {
        $banner->delete();
        return response()->json(null, 204);
    }

    public function active(): JsonResponse
    {
        $banner = Banner::where('is_active', true)
            ->get()
            ->first(function ($banner) {
                return $banner->isValidForDisplay();
            });

        return response()->json($banner);
    }
    public function updatePriority(UpdatePriorityRequest $request, Banner $banner): JsonResponse
    {
        $newPriority = $request->priority;
        $oldPriority = $banner->priority;

        // Comenzar transacción para asegurar la integridad de los datos
        \DB::transaction(function () use ($banner, $newPriority, $oldPriority) {
            if ($newPriority > $oldPriority) {
                // Moviendo hacia abajo en la lista (prioridad mayor)
                Banner::where('priority', '>', $oldPriority)
                      ->where('priority', '<=', $newPriority)
                      ->decrement('priority');
            } else {
                // Moviendo hacia arriba en la lista (prioridad menor)
                Banner::where('priority', '>=', $newPriority)
                      ->where('priority', '<', $oldPriority)
                      ->increment('priority');
            }

            $banner->priority = $newPriority;
            $banner->save();
        });

        return response()->json($banner->fresh());
    }
}