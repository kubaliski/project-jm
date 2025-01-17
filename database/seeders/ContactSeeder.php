<?php

namespace Database\Seeders;

use App\Models\Contact;
use Illuminate\Database\Seeder;

class ContactSeeder extends Seeder
{
    public function run(): void
    {
        // Crear 40 contactos con estado aleatorio
        Contact::factory(40)->create();

        // Crear específicamente algunos contactos en cada estado
        Contact::factory(15)->pending()->create();      // Más pendientes
        Contact::factory(10)->inProgress()->create();   // Algunos en proceso
        Contact::factory(12)->completed()->create();    // Completados
        Contact::factory(5)->spam()->create();         // Unos pocos spam
    }
}