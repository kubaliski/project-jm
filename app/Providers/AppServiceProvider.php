<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Commands\PublishScheduledPosts;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        if ($this->app->runningInConsole()) {
            $this->commands([
                PublishScheduledPosts::class,
            ]);
        }
    }
}