<?php

namespace App\Http\Requests\Contact;

use Illuminate\Foundation\Http\FormRequest;

class UpdateStatusRequest extends FormRequest
{
    public function authorize(): bool
    {
        // Movemos la lógica de autorización aquí desde el controlador
        return $this->user()->can('updateStatus', $this->route('contact'));
    }

    public function rules(): array
    {
        return [
            'status' => 'required|in:pending,in_progress,completed,spam'
        ];
    }
}
