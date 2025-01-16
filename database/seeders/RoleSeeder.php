<?php

namespace Database\Seeders;

use App\Models\Role;
use App\Models\Permission;
use Illuminate\Database\Seeder;

class RoleSeeder extends Seeder
{
    public function run()
    {
        // Admin Role
        $adminRole = Role::create([
            'name' => 'admin',
            'description' => 'Administrator with full access'
        ]);

        // Dar todos los permisos al admin
        $adminRole->syncPermissions(Permission::all());

        // Editor Role
        $editorRole = Role::create([
            'name' => 'editor',
            'description' => 'Can manage posts and content'
        ]);

        // Permisos para editor
        $editorPermissions = Permission::whereIn('name', [
            'post.index',
            'post.create',
            'post.edit',
            'post.view',
            'post.publish',
            'stats.posts'
        ])->get();

        $editorRole->syncPermissions($editorPermissions);

        // Support Role
        $supportRole = Role::create([
            'name' => 'support',
            'description' => 'Can manage contacts and support requests'
        ]);

        // Permisos para soporte
        $supportPermissions = Permission::whereIn('name', [
            'contact.index',
            'contact.view',
            'contact.edit',
            'contact.update-status',
            'stats.contacts'
        ])->get();

        $supportRole->syncPermissions($supportPermissions);
    }
}