<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Role;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run()
    {
        // Usuario Administrador
        $adminUser = User::create([
            'name' => 'Admin User',
            'last_name' => 'Admin',
            'email' => 'admin@example.com',
            'password' => Hash::make('password'),
            'email_verified_at' => now(),
        ]);
        $adminUser->assignRole('admin');

        // Usuario Editor
        $editorUser = User::create([
            'name' => 'Editor User',
            'last_name' => 'Editor',
            'email' => 'editor@example.com',
            'password' => Hash::make('password'),
            'email_verified_at' => now(),
        ]);
        $editorUser->assignRole('editor');

        // Usuario Soporte
        $supportUser = User::create([
            'name' => 'Support User',
            'last_name' => 'Support',
            'email' => 'support@example.com',
            'password' => Hash::make('password'),
            'email_verified_at' => now(),
        ]);
        $supportUser->assignRole('support');
    }
}