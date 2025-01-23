<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Console\Scheduling\Schedule;

class ScheduleServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        //
    }

    public function boot(): void
    {
        $this->app->afterResolving(Schedule::class, function (Schedule $schedule) {
            // Comando existente de posts
            $schedule->command('posts:publish-scheduled')
                ->everyMinute()
                ->appendOutputTo(storage_path('logs/scheduler.log'));

            // Nuevo comando de banners a las 12 de la noche
            $schedule->command('banners:publish-scheduled')
                ->dailyAt('00:00')
                ->appendOutputTo(storage_path('logs/banners-scheduler.log'));
        });
    }
}