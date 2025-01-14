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
            $schedule->command('posts:publish-scheduled')
                ->everyMinute()
                ->appendOutputTo(storage_path('logs/scheduler.log'));
        });
    }
}