import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { XCircleIcon } from '@heroicons/react/24/solid';
import { selectRolesError } from '@store/admin/selectors/rolesSelectors';
import { SubmitButton } from '@/components/common';

export default function RoleForm({ role = null, onSubmit, onCancel, isSubmitting = false, readOnly = false }) {
    const serverErrors = useSelector(selectRolesError);
    const [errors, setErrors] = useState({});

    const [formData, setFormData] = useState({
        name: '',
        description: ''
    });

    // Efecto para manejar errores del servidor
    useEffect(() => {
        if (serverErrors?.errors) {
            setErrors(serverErrors.errors);
        }
    }, [serverErrors]);

    // Efecto para inicializar el formulario con los datos del rol
    useEffect(() => {
        if (role) {
            setFormData({
                name: role.name || '',
                description: role.description || ''
            });
        }
        setErrors({});
    }, [role]);

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

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validaciones
        const validationErrors = {};
        if (!formData.name.trim()) {
            validationErrors.name = 'El nombre es requerido';
        } else if (formData.name.length < 3) {
            validationErrors.name = 'El nombre debe tener al menos 3 caracteres';
        }
        if (!formData.description.trim()) {
            validationErrors.description = 'La descripción es requerida';
        }

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        try {
            await onSubmit(formData);
        } catch (error) {
            if (error.response?.data?.errors) {
                setErrors(error.response.data.errors);
            } else {
                setErrors({
                    general: 'Ocurrió un error al guardar el rol.'
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

            {/* Descripción */}
            <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    Descripción
                </label>
                <textarea
                    id="description"
                    name="description"
                    rows="3"
                    value={formData.description}
                    onChange={handleChange}
                    readOnly={readOnly}
                    disabled={readOnly}
                    className={`mt-1 block w-full rounded-md shadow-sm py-2 px-3 sm:text-sm
                        ${errors.description
                            ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                            : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'
                        } ${readOnly ? 'bg-gray-50' : ''}`}
                    required
                />
                {errors.description && (
                    <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                )}
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
                            isUpdate={!!role}
                        />
                    </>
                )}
            </div>
        </form>
    );
}

RoleForm.propTypes = {
    role: PropTypes.object,
    onSubmit: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    isSubmitting: PropTypes.bool,
    readOnly: PropTypes.bool
};