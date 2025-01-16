<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Role extends Model
{
    protected $fillable = [
        'name',
        'description'
    ];

    public function permissions()
    {
        return $this->belongsToMany(Permission::class);
    }

    public function users()
    {
        return $this->belongsToMany(User::class);
    }

    public function givePermissionTo(...$permissions)
    {
        $permissions = collect($permissions)
            ->flatten()
            ->map(function ($permission) {
                return is_string($permission) ? Permission::whereName($permission)->firstOrFail() : $permission;
            });

        $this->permissions()->syncWithoutDetaching($permissions);

        return $this;
    }

    public function revokePermissionTo(...$permissions)
    {
        $permissions = collect($permissions)
            ->flatten()
            ->map(function ($permission) {
                return is_string($permission) ? Permission::whereName($permission)->firstOrFail() : $permission;
            });

        $this->permissions()->detach($permissions);

        return $this;
    }

    public function syncPermissions(...$permissions)
    {
        $permissions = collect($permissions)
            ->flatten()
            ->map(function ($permission) {
                return is_string($permission) ? Permission::whereName($permission)->firstOrFail() : $permission;
            });

        $this->permissions()->sync($permissions);

        return $this;
    }
}