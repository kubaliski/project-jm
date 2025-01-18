<?php

namespace App\Http\Requests\Role;

use Illuminate\Foundation\Http\FormRequest;

class UpdateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => 'string|unique:roles,name,' . $this->role->id,
            'description' => 'nullable|string',
            'permissions' => 'array|nullable',
            'permissions.*' => 'exists:permissions,name'
        ];
    }
}