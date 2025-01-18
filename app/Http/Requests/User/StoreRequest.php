<?php

namespace App\Http\Requests\User;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Password;

class StoreRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => ['required', Password::defaults()],
            'roles' => 'array|exists:roles,id'
        ];
    }

    protected function prepareForValidation(): void
    {
        // Si necesitamos alguna transformación de datos antes de la validación
        if ($this->has('roles') && !is_array($this->input('roles'))) {
            $this->merge([
                'roles' => array_filter(explode(',', $this->input('roles')))
            ]);
        }
    }
}