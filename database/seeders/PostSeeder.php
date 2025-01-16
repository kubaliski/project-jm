<?php

namespace Database\Seeders;

use App\Models\Post;
use Illuminate\Database\Seeder;

class PostSeeder extends Seeder
{
    public function run(): void
    {
        // Posts publicados
        Post::factory(15)
            ->published()
            ->create();

        // Posts programados para publicarse en el futuro
        Post::factory(5)
            ->scheduled()
            ->create();

        // Posts en borrador
        Post::factory(8)
            ->draft()
            ->create();

        // Posts listos para publicar (fecha pasada pero no publicados)
        Post::factory(3)
            ->state([
                'is_published' => false,
                'published_at' => now()->subDays(rand(1, 10))
            ])
            ->create();
    }
}