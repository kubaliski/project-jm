<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class CreateAdminUserSeeder extends Seeder
{
    public function run(): void
    {
        User::create([
            'name' => 'Admin',
            'last_name' => 'User',
            'email' => 'admin@admin.com',
            'password' => Hash::make('password')
        ]);
    }
}