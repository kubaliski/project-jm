<?php

namespace App\Http\Requests\User;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Password;


class UpdateRequest extends FormRequest
{
    public function authorize(): bool
    {


        // Obtener el usuario que se está editando
        $userToEdit = $this->route('user');

        // Si intenta cambiar roles (los roles son diferentes a los actuales)
        if ($this->has('roles')) {
            $currentRoleIds = $userToEdit->roles->pluck('id')->toArray();
            $requestedRoleIds = array_map('intval', $this->input('roles', []));
            sort($currentRoleIds);
            sort($requestedRoleIds);

            $rolesAreDifferent = $currentRoleIds !== $requestedRoleIds;



            if ($rolesAreDifferent && !$this->user()->hasPermission('user.assign-roles')) {
                Log::info('Access denied: Attempting to change roles without permission');
                return false;
            }
        }

        // Si intenta cambiar la contraseña
        if ($this->filled('password') && !$this->user()->hasPermission('user.change-password')) {
            Log::info('Access denied: Attempting to change password without permission');
            return false;
        }

        // Verificar permiso base de edición
        $canEdit = $this->user()->hasPermission('user.edit');
        Log::info('Final authorization result:', ['canEdit' => $canEdit]);
        return $canEdit;
    }

    public function rules(): array
    {
        $rules = [
            'name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $this->route('user')->id,
            'roles' => 'array|exists:roles,id',
        ];

        // Solo agregar reglas de password si se está intentando cambiar
        if ($this->filled('password')) {
            $rules['password'] = ['required', Password::defaults()];
        }

        return $rules;
    }

    protected function prepareForValidation(): void
    {
        if ($this->has('roles') && !is_array($this->input('roles'))) {
            $this->merge([
                'roles' => array_filter(explode(',', $this->input('roles')))
            ]);
        }
    }
}