<?php

namespace App\Policies;

use App\Models\Contact;
use App\Models\User;

class ContactPolicy
{
    /**
     * Determine whether the user can view any contacts.
     */
    public function viewAny(User $user): bool
    {
        return $user->hasPermission('contact.index');
    }

    /**
     * Determine whether the user can view the contact.
     */
    public function view(User $user, Contact $contact): bool
    {
        return $user->hasPermission('contact.view');
    }

    /**
     * Determine whether the user can view statistics.
     */
    public function viewStats(User $user): bool
    {
        return $user->hasPermission('stats.contacts');
    }

    /**
     * Determine whether the user can create contacts.
     */
    public function create(User $user): bool
    {
        return $user->hasPermission('contact.create');
    }

    /**
     * Determine whether the user can update the contact.
     */
    public function update(User $user, Contact $contact): bool
    {
        return $user->hasPermission('contact.edit');
    }

    /**
     * Determine whether the user can delete the contact.
     */
    public function delete(User $user, Contact $contact): bool
    {
        return $user->hasPermission('contact.delete');
    }

    /**
     * Determine whether the user can update the status.
     */
    public function updateStatus(User $user, Contact $contact): bool
    {
        return $user->hasPermission('contact.update-status');
    }


}