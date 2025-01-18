<?php

namespace App\Http\Requests\Post;

use App\Services\PostService;
use Illuminate\Foundation\Http\FormRequest;

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
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'excerpt' => 'nullable|string',
            'featured_image' => 'nullable|sometimes|image|mimes:jpeg,png,jpg,gif|max:10240',
            'seo_title' => 'nullable|string|max:255',
            'seo_description' => 'nullable|string',
            'is_published' => 'required|boolean',
            'published_at' => 'nullable|date',
        ];
    }

    protected function prepareForValidation(): void
    {
        $metadata = $this->postService->generateMetadata($this->all());

        $this->merge([
            'is_published' => filter_var($this->input('is_published'), FILTER_VALIDATE_BOOLEAN),
            ...$metadata
        ]);
    }
}
