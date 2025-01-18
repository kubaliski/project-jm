import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { XCircleIcon } from '@heroicons/react/24/solid';
import { selectUsersError } from '@store/admin/selectors/usersSelectors';
import RoleForm from './UserRoleForm';
import { SubmitButton } from '@/components/common';

export default function UserForm({
    user = null,
    roles = [],
    onSubmit,
    onCancel,
    isSubmitting = false,
    readOnly = false,
    mode
}) {
    const serverErrors = useSelector(selectUsersError);
    const [errors, setErrors] = useState({});

    const [formData, setFormData] = useState({
        name: '',
        last_name: '',
        email: '',
        password: '',
        password_confirmation: '',
        role_id: null
    });

    // Efecto para manejar errores del servidor
    useEffect(() => {
        if (serverErrors?.errors) {
            setErrors(serverErrors.errors);
        }
    }, [serverErrors]);

    // Efecto para inicializar el formulario con los datos del usuario
    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                last_name: user.last_name || '',
                email: user.email || '',
                password: '',
                password_confirmation: '',
                role_id: user.roles?.[0]?.id || null // Tomamos el primer rol
            });
        } else {
            setFormData({
                name: '',
                last_name: '',
                email: '',
                password: '',
                password_confirmation: '',
                role_id: null
            });
        }
        setErrors({});
    }, [user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    const handleRoleChange = (roleId) => {
        setFormData(prev => ({
            ...prev,
            role_id: roleId
        }));

        if (errors.role_id) {
            setErrors(prev => ({ ...prev, role_id: null }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validaciones
        const validationErrors = {};
        if (!formData.name.trim()) {
            validationErrors.name = 'El nombre es requerido';
        }
        if (!formData.last_name.trim()) {
            validationErrors.last_name = 'El apellido es requerido';
        }
        if (!formData.email.trim()) {
            validationErrors.email = 'El email es requerido';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            validationErrors.email = 'El email no es válido';
        }
        if (!formData.role_id) {
            validationErrors.role_id = 'Debe seleccionar un rol';
        }

        // Validación de contraseña solo para nuevos usuarios o si se intenta cambiar
        if (!user && !formData.password) {
            validationErrors.password = 'La contraseña es requerida';
        }
        if (formData.password && formData.password.length < 8) {
            validationErrors.password = 'La contraseña debe tener al menos 8 caracteres';
        }
        if (formData.password !== formData.password_confirmation) {
            validationErrors.password_confirmation = 'Las contraseñas no coinciden';
        }

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        try {
            const dataToSubmit = {
                ...formData,
                roles: formData.role_id ? [formData.role_id] : []
            };

            if (mode === 'edit' && !formData.password) {
                delete dataToSubmit.password;
                delete dataToSubmit.password_confirmation;
            }

            await onSubmit(dataToSubmit);
        } catch (error) {
            if (error.response?.data?.errors) {
                setErrors(error.response.data.errors);
            } else {
                setErrors({
                    general: 'Ocurrió un error al guardar el usuario.'
                });
            }
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {errors.general && (
                <div className="bg-red-50 border-l-4 border-red-400 p-4">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <XCircleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
                        </div>
                        <div className="ml-3">
                            <p className="text-sm text-red-700">{errors.general}</p>
                        </div>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                {/* Nombre */}
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                        Nombre
                    </label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        readOnly={readOnly}
                        disabled={readOnly}
                        className={`mt-1 block w-full rounded-md shadow-sm py-2 px-3 sm:text-sm
                            ${errors.name
                                ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                                : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'
                            } ${readOnly ? 'bg-gray-50' : ''}`}
                        required
                    />
                    {errors.name && (
                        <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                    )}
                </div>

                {/* Apellido */}
                <div>
                    <label htmlFor="last_name" className="block text-sm font-medium text-gray-700">
                        Apellido
                    </label>
                    <input
                        type="text"
                        id="last_name"
                        name="last_name"
                        value={formData.last_name}
                        onChange={handleChange}
                        readOnly={readOnly}
                        disabled={readOnly}
                        className={`mt-1 block w-full rounded-md shadow-sm py-2 px-3 sm:text-sm
                            ${errors.last_name
                                ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                                : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'
                            } ${readOnly ? 'bg-gray-50' : ''}`}
                        required
                    />
                    {errors.last_name && (
                        <p className="mt-1 text-sm text-red-600">{errors.last_name}</p>
                    )}
                </div>

                {/* Email */}
                <div className="sm:col-span-2">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        Email
                    </label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        readOnly={readOnly}
                        disabled={readOnly}
                        className={`mt-1 block w-full rounded-md shadow-sm py-2 px-3 sm:text-sm
                            ${errors.email
                                ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                                : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'
                            } ${readOnly ? 'bg-gray-50' : ''}`}
                        required
                    />
                    {errors.email && (
                        <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                    )}
                </div>

                {/* Password - Solo mostrar en crear o editar */}
                {!readOnly && (
                    <>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                {mode === 'edit' ? 'Nueva contraseña (opcional)' : 'Contraseña'}
                            </label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className={`mt-1 block w-full rounded-md shadow-sm py-2 px-3 sm:text-sm
                                    ${errors.password
                                        ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                                        : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'
                                    }`}
                                required={!user}
                            />
                            {errors.password && (
                                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-700">
                                Confirmar contraseña
                            </label>
                            <input
                                type="password"
                                id="password_confirmation"
                                name="password_confirmation"
                                value={formData.password_confirmation}
                                onChange={handleChange}
                                className={`mt-1 block w-full rounded-md shadow-sm py-2 px-3 sm:text-sm
                                    ${errors.password_confirmation
                                        ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                                        : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'
                                    }`}
                                required={!!formData.password}
                            />
                            {errors.password_confirmation && (
                                <p className="mt-1 text-sm text-red-600">{errors.password_confirmation}</p>
                            )}
                        </div>
                    </>
                )}
            </div>

            {/* Sección de Rol */}
            <div className="pt-4">
                <RoleForm
                    selectedRole={formData.role_id}
                    availableRoles={roles}
                    onRoleChange={handleRoleChange}
                    isSubmitting={isSubmitting}
                    errors={errors}
                    readOnly={readOnly}
                />
            </div>

            {/* Botones de acción */}
            <div className="flex justify-end space-x-3 pt-4">
                {readOnly ? (
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Cerrar
                    </button>
                ) : (
                    <>
                        <button
                            type="button"
                            onClick={onCancel}
                            disabled={isSubmitting}
                            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Cancelar
                        </button>
                        <SubmitButton
                            isSubmitting={isSubmitting}
                            isUpdate={mode === 'edit'}
                            submitText="Crear usuario"
                            updateText="Actualizar usuario"
                            loadingText="Guardando usuario..."
                        />
                    </>
                )}
            </div>
        </form>
    );
}

UserForm.propTypes = {
    user: PropTypes.object,
    roles: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
        description: PropTypes.string
    })),
    onSubmit: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    isSubmitting: PropTypes.bool,
    readOnly: PropTypes.bool,
    mode: PropTypes.oneOf(['create', 'edit', 'view'])
};