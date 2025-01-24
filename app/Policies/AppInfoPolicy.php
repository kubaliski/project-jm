<?php

namespace App\Policies;

use App\Models\User;
use App\Models\AppInfo;

class AppInfoPolicy
{
    public function viewAny(User $user): bool
    {
        return true;
    }

    public function view(User $user, AppInfo $appInfo): bool
    {
        return $user->hasPermission('appinfo.show');
    }

    public function update(User $user, AppInfo $appInfo): bool
    {
        return $user->hasPermission('appinfo.update');
    }
}