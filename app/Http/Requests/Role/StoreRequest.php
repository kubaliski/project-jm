<?php

namespace App\Http\Requests\Role;

use Illuminate\Foundation\Http\FormRequest;

class StoreRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // La autorización ya se maneja en el controlador
    }

    public function rules(): array
    {
        return [
            'name' => 'required|string|unique:roles,name',
            'description' => 'nullable|string',
            'permissions' => 'array|nullable',
            'permissions.*' => 'exists:permissions,name'
        ];
    }
}