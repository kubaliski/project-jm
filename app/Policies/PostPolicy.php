<?php

namespace App\Policies;

use App\Models\Post;
use App\Models\User;

class PostPolicy
{
    /**
     * Determine whether the user can view any posts.
     */
    public function viewAny(User $user): bool
    {
        return $user->hasPermission('post.index');
    }

    /**
     * Determine whether the user can view the post.
     */
    public function view(User $user, Post $post): bool
    {
        return $user->hasPermission('post.view');
    }

    /**
     * Determine whether the user can view posts stats.
     */
    public function viewStats(User $user): bool
    {
        return $user->hasPermission('stats.posts');
    }
    /**
     * Determine whether the user can create posts.
     */
    public function create(User $user): bool
    {
        return $user->hasPermission('post.create');
    }

    /**
     * Determine whether the user can update the post.
     */
    public function update(User $user, Post $post): bool
    {
        return $user->hasPermission('post.edit');
    }

    /**
     * Determine whether the user can delete the post.
     */
    public function delete(User $user, Post $post): bool
    {
        return $user->hasPermission('post.delete');
    }

    /**
     * Determine whether the user can publish the post.
     */
    public function publish(User $user, Post $post): bool
    {
        return $user->hasPermission('post.publish');
    }
}