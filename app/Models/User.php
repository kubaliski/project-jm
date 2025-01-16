<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'last_name',
        'email',
        'password',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

     // Relación muchos a muchos con roles
     public function roles()
     {
         return $this->belongsToMany(Role::class);
     }

    public function posts()
    {
        return $this->hasMany(Post::class);
    }
    // Verifica si el usuario tiene un rol específico
    public function hasRole($role)
    {
        if (is_string($role)) {
            return $this->roles->contains('name', $role);
        }

        return !!$role->intersect($this->roles)->count();
    }

    // Verifica si el usuario tiene un permiso específico
    public function hasPermission($permission)
    {
        if (is_string($permission)) {
            return $this->getAllPermissions()->contains('name', $permission);
        }

        return !!$permission->intersect($this->getAllPermissions())->count();
    }

    // Obtiene todos los permisos del usuario a través de sus roles
    public function getAllPermissions()
    {
        return $this->roles->flatMap->permissions->unique('id');
    }

    // Asigna roles al usuario
    public function assignRole(...$roles)
    {
        $roles = collect($roles)
            ->flatten()
            ->map(function ($role) {
                return is_string($role) ? Role::whereName($role)->firstOrFail() : $role;
            });

        $this->roles()->syncWithoutDetaching($roles);

        return $this;
    }

    // Remueve roles del usuario
    public function removeRole(...$roles)
    {
        $roles = collect($roles)
            ->flatten()
            ->map(function ($role) {
                return is_string($role) ? Role::whereName($role)->firstOrFail() : $role;
            });

        $this->roles()->detach($roles);

        return $this;
    }

    // Sincroniza los roles del usuario
    public function syncRoles(...$roles)
    {
        $roles = collect($roles)
            ->flatten()
            ->map(function ($role) {
                return is_string($role) ? Role::whereName($role)->firstOrFail() : $role;
            });

        $this->roles()->sync($roles);

        return $this;
    }

}