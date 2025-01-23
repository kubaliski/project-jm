<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Commands\PublishScheduledPosts;
use App\Commands\PublishScheduledBanners;

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
                PublishScheduledBanners::class,
            ]);
        }
    }
}