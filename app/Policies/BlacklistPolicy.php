<?php

namespace App\Policies;

use App\Models\User;

class BlacklistPolicy
{
    /**
     * Determine whether the user can view the blocked IPs list.
     */
    public function viewAny(User $user): bool
    {
        return $user->hasPermission('security.view-blocked');
    }

    /**
     * Determine whether the user can block IPs.
     */
    public function block(User $user): bool
    {
        return $user->hasPermission('security.block-ip');
    }

    /**
     * Determine whether the user can unblock IPs.
     */
    public function unblock(User $user): bool
    {
        return $user->hasPermission('security.unblock-ip');
    }

    /**
     * Determine whether the user can view access attempts.
     */
    public function viewAttempts(User $user): bool
    {
        return $user->hasPermission('security.view-attempts');
    }
}