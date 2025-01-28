<?php

namespace App\Http\Requests\Post;

use App\Services\PostService;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateRequest extends FormRequest
{
    public function __construct(protected PostService $postService)
    {
        parent::__construct();
    }

    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'content' => ['required', 'string'],
            'excerpt' => ['nullable', 'string', 'max:500'],
            'featured_image' => [
                'nullable',
                'sometimes',
                'image',
                'mimes:jpeg,png,jpg,gif,webp',
                'max:10240', // 10MB
                'dimensions:min_width=200,min_height=200,max_width=5000,max_height=5000'
            ],
            'seo_title' => ['nullable', 'string', 'max:60'],
            'seo_description' => ['nullable', 'string', 'max:160'],
            'is_published' => ['required', 'boolean'],
            'published_at' => [
                'nullable',
                'date',
                'required_if:schedule_publication,true',
                function ($attribute, $value, $fail) {
                    $post = $this->route('post');

                    if ($value && $this->input('is_published')) {
                        if (strtotime($value) > time() && !$post->is_published) {
                            $fail('No puedes publicar un post con fecha futura.');
                        }
                    }

                    // Si el post ya estaba publicado, no permitir cambiar la fecha a futuro
                    if ($post->is_published && $value && strtotime($value) > time()) {
                        $fail('No puedes cambiar la fecha de publicación a una fecha futura en un post ya publicado.');
                    }
                }
            ],
            'schedule_publication' => ['nullable', 'boolean'],
        ];
    }

    public function messages(): array
    {
        return [
            'title.required' => 'El título es obligatorio.',
            'title.max' => 'El título no puede tener más de 255 caracteres.',
            'content.required' => 'El contenido es obligatorio.',
            'excerpt.max' => 'El extracto no puede tener más de 500 caracteres.',
            'featured_image.image' => 'El archivo debe ser una imagen.',
            'featured_image.mimes' => 'La imagen debe ser de tipo: jpeg, png, jpg, gif o webp.',
            'featured_image.max' => 'La imagen no debe pesar más de 10MB.',
            'featured_image.dimensions' => 'La imagen debe tener un tamaño entre 200x200 y 5000x5000 píxeles.',
            'seo_title.max' => 'El título SEO no puede tener más de 60 caracteres.',
            'seo_description.max' => 'La descripción SEO no puede tener más de 160 caracteres.',
            'published_at.required_if' => 'La fecha de publicación es obligatoria al programar la publicación.',
            'published_at.date' => 'La fecha de publicación no tiene un formato válido.',
        ];
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'is_published' => filter_var($this->input('is_published'), FILTER_VALIDATE_BOOLEAN),
            'schedule_publication' => filter_var($this->input('schedule_publication'), FILTER_VALIDATE_BOOLEAN),
        ]);

        // No generar metadatos si hay errores en los campos base
        if ($this->anyFilled(['title', 'content'])) {
            $metadata = $this->postService->generateMetadata($this->all());
            $this->merge($metadata);
        }
    }

    public function validated($key = null, $default = null): array
    {
        $validated = parent::validated();

        // Remover campos de control que no van a la base de datos
        unset($validated['schedule_publication']);

        return $validated;
    }
}