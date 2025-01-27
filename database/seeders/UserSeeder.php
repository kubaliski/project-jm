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
            'name' => 'Angel',
            'last_name' => 'Caparros',
            'email' => 'angel.ccapb@gmail.com',
            'password' => Hash::make('45023PokE!'),
            'email_verified_at' => now(),
        ]);
        $adminUser->assignRole('admin');
    }
}