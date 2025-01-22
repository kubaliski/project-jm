<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Banner;

class BannerPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->hasPermission('banner.index');
    }

    public function view(User $user, Banner $banner): bool
    {
        return $user->hasPermission('banner.view');
    }

    public function create(User $user): bool
    {
        return $user->hasPermission('banner.create');
    }

    public function update(User $user, Banner $banner): bool
    {
        return $user->hasPermission('banner.edit');
    }

    public function updatePriority(User $user, Banner $banner): bool
    {
    return $user->hasPermission('banner.update-priority');
    }

    public function delete(User $user, Banner $banner): bool
    {
        return $user->hasPermission('banner.delete');
    }
}