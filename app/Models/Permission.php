<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Permission extends Model
{
    protected $fillable = [
        'name',
        'display_name',
        'group',
        'description'
    ];

    // Relación muchos a muchos con roles
    public function roles()
    {
        return $this->belongsToMany(Role::class);
    }

    // Método helper para obtener permisos por grupo
    public static function getByGroup()
    {
        return static::all()->groupBy('group');
    }
}