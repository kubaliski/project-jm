<?php

namespace App\Commands;

use App\Models\Banner;
use Illuminate\Console\Command;

class PublishScheduledBanners extends Command
{
    protected $signature = 'banners:publish-scheduled';
    protected $description = 'Publish scheduled banners that have reached their publication date';

    public function handle()
    {
        $today = now()->startOfDay();

        // Buscar banners inactivos que deberían estar activos hoy
        $bannersToActivate = Banner::where('is_active', false)
            ->where(function ($query) use ($today) {
                $query->where(function ($q) use ($today) {
                    // Caso 1: Solo fecha de inicio y ya pasó
                    $q->whereNotNull('start_date')
                      ->whereNull('end_date')
                      ->where('start_date', '<=', $today);
                })->orWhere(function ($q) use ($today) {
                    // Caso 2: Solo fecha de fin y aún no ha llegado
                    $q->whereNull('start_date')
                      ->whereNotNull('end_date')
                      ->where('end_date', '>=', $today);
                })->orWhere(function ($q) use ($today) {
                    // Caso 3: Ambas fechas y estamos en el rango
                    $q->whereNotNull('start_date')
                      ->whereNotNull('end_date')
                      ->where('start_date', '<=', $today)
                      ->where('end_date', '>=', $today);
                });
            })
            ->get();

        if ($bannersToActivate->isEmpty()) {
            $this->info('No hay banners para activar.');
            return;
        }

        foreach ($bannersToActivate as $banner) {
            $banner->update(['is_active' => true]);
            $this->info("Banner ID {$banner->id} activado: {$banner->text}");
        }

        $this->info("Se activaron {$bannersToActivate->count()} banners.");
    }
}