<?php

namespace App\Http\Requests\AppInfo;

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
            'legal_representative' => 'nullable|string|max:255',
            'address' => 'nullable|string|max:255',
            'contact_email' => 'nullable|email|max:255',
            'phone_1' => 'nullable|string|max:20',
            'phone_2' => 'nullable|string|max:20',
        ];
    }
}