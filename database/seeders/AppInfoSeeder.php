<?php

namespace Database\Seeders;

use App\Models\AppInfo;
use Illuminate\Database\Seeder;

class AppInfoSeeder extends Seeder
{
    public function run(): void
    {
        AppInfo::firstOrCreate(
            [],
            [
                'legal_representative' => 'John Doe',
                'address' => '123 Main Street, City, Country',
                'contact_email' => 'contact@example.com',
                'phone_1' => '+34 666 666 666',
                'phone_2' => '+34 999 999 999'
            ]
        );
    }
}