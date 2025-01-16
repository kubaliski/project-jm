<?php

namespace App\Policies;

use App\Models\User;

class UserPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->hasPermission('user.index');
    }

    public function view(User $user, User $model): bool
    {
        return $user->hasPermission('user.view');
    }

    public function create(User $user): bool
    {
        return $user->hasPermission('user.create');
    }

    public function update(User $user, User $model): bool
    {
        return $user->hasPermission('user.edit');
    }

    public function delete(User $user, User $model): bool
    {
        return $user->hasPermission('user.delete');
    }

    public function assignRoles(User $user, User $model): bool
    {
        return $user->hasPermission('user.assign-roles');
    }
}