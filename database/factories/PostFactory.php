<?php

namespace Database\Factories;

use App\Models\Post;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class PostFactory extends Factory
{
    protected $model = Post::class;

    public function definition()
    {
        $title = fake()->unique()->sentence();
        $content = fake()->paragraphs(3, true);

        return [
            'user_id' => 1, // Usuario fijo como solicitado
            'title' => $title,
            'slug' => Str::slug($title),
            'content' => $content,
            'excerpt' => str()->words(strip_tags($content), 50),
            'featured_image' => null, // Sin imágenes como solicitado
            'seo_title' => fake()->sentence(),
            'seo_description' => fake()->text(160),
            'is_published' => fake()->boolean(80), // 80% de probabilidad de estar publicado
            'published_at' => fake()->dateTimeBetween('-1 year', '+1 month'),
        ];
    }

    /**
     * Estado para posts publicados
     */
    public function published()
    {
        return $this->state(function (array $attributes) {
            return [
                'is_published' => true,
                'published_at' => fake()->dateTimeBetween('-1 year', 'now'),
            ];
        });
    }

    /**
     * Estado para posts programados
     */
    public function scheduled()
    {
        return $this->state(function (array $attributes) {
            return [
                'is_published' => false,
                'published_at' => fake()->dateTimeBetween('now', '+1 month'),
            ];
        });
    }

    /**
     * Estado para posts borrador (sin fecha de publicación)
     */
    public function draft()
    {
        return $this->state(function (array $attributes) {
            return [
                'is_published' => false,
                'published_at' => null,
            ];
        });
    }
}