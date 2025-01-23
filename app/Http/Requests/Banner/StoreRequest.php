<?php

namespace App\Http\Requests\Banner;

use App\Models\Banner;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'text' => 'required|string|max:255',
            'background_color' => 'required|string|max:25',
            'text_color' => 'required|string|max:25',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'is_active' => 'boolean',
            'priority' => 'integer|min:0',
            'custom_class' => [
                'nullable',
                'string',
                Rule::in(array_keys(Banner::AVAILABLE_CLASSES))
            ],
        ];
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'is_active' => $this->boolean('is_active'),
            'custom_class' => $this->custom_class ?: 'default'
        ]);
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'custom_class.in' => 'La clase personalizada seleccionada no es válida.'
        ];
    }
}