<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Gate;
use App\Models\AppInfo;
use App\Policies\AppInfoPolicy;
use App\Models\Banner;
use App\Policies\BannerPolicy;
use App\Models\Contact;
use App\Policies\ContactPolicy;
use App\Models\Post;
use App\Policies\PostPolicy;
use App\Models\Role;
use App\Policies\RolePolicy;
use App\Models\User;
use App\Policies\UserPolicy;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The model to policy mappings for the application.
     *
     * @var array<class-string, class-string>
     */
    protected $policies = [
        AppInfo::class => AppInfoPolicy::class,
        Banner::class => BannerPolicy::class,
        Contact::class => ContactPolicy::class,
        Post::class => PostPolicy::class,
        Role::class => RolePolicy::class,
        User::class => UserPolicy::class,
    ];

    /**
     * Register any authentication / authorization services.
     */
    public function boot(): void
    {
        // Registrar las policies
        foreach ($this->policies as $model => $policy) {
            Gate::policy($model, $policy);
        }
    }

    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }
}