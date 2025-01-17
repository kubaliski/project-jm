<?php

namespace Database\Factories;

use App\Models\Contact;
use Illuminate\Database\Eloquent\Factories\Factory;

class ContactFactory extends Factory
{
    protected $model = Contact::class;

    public function definition(): array
    {
        // Configuramos el faker para español
        $this->faker->locale('es_ES');

        return [
            'full_name' => $this->faker->name(),
            'email' => $this->faker->unique()->safeEmail(),
            'phone' => $this->faker->numerify('6########'), // Formato típico español
            'subject' => $this->faker->sentence(),
            'message' => $this->faker->paragraph(3),
            'status' => $this->faker->randomElement(['pending', 'in_progress', 'completed', 'spam']),
            'observations' => $this->faker->optional(0.7)->sentence(), // 70% tendrán observaciones
            'created_at' => $this->faker->dateTimeBetween('-6 months', 'now'),
            'updated_at' => function (array $attributes) {
                return $this->faker->dateTimeBetween($attributes['created_at'], 'now');
            },
        ];
    }

    /**
     * Estado pendiente
     */
    public function pending()
    {
        return $this->state(function (array $attributes) {
            return [
                'status' => 'pending',
                'observations' => null,
            ];
        });
    }

    /**
     * Estado en proceso
     */
    public function inProgress()
    {
        return $this->state(function (array $attributes) {
            return [
                'status' => 'in_progress',
                'observations' => $this->faker->sentence(),
            ];
        });
    }

    /**
     * Estado completado
     */
    public function completed()
    {
        return $this->state(function (array $attributes) {
            return [
                'status' => 'completed',
                'observations' => $this->faker->sentence(),
            ];
        });
    }

    /**
     * Estado spam
     */
    public function spam()
    {
        return $this->state(function (array $attributes) {
            return [
                'status' => 'spam',
                'observations' => $this->faker->optional(0.5)->sentence(), // 50% de probabilidad de tener observaciones
            ];
        });
    }
}