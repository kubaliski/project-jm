import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import { XCircleIcon } from "@heroicons/react/24/solid";
import { selectRolesError } from "@store/admin/selectors/rolesSelectors";
import { SubmitButton, FormInput } from "@/components/common";

export default function RoleForm({
    role = null,
    onSubmit,
    onCancel,
    isSubmitting = false,
    readOnly = false,
}) {
    const serverErrors = useSelector(selectRolesError);
    const [errors, setErrors] = useState({});
    const [formData, setFormData] = useState({
        name: "",
        description: "",
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
                name: role.name || "",
                description: role.description || "",
            });
        }
        setErrors({});
    }, [role]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: null }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validaciones
        const validationErrors = {};
        if (!formData.name.trim()) {
            validationErrors.name = "El nombre es requerido";
        } else if (formData.name.length < 3) {
            validationErrors.name =
                "El nombre debe tener al menos 3 caracteres";
        }
        if (!formData.description.trim()) {
            validationErrors.description = "La descripción es requerida";
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
                    general: "Ocurrió un error al guardar el rol.",
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
                            <XCircleIcon
                                className="h-5 w-5 text-red-400"
                                aria-hidden="true"
                            />
                        </div>
                        <div className="ml-3">
                            <p className="text-sm text-red-700">
                                {errors.general}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Nombre */}
            <FormInput
                id="name"
                name="name"
                label="Nombre"
                value={formData.name}
                onChange={handleChange}
                error={errors.name}
                required
                readOnly={readOnly}
                disabled={readOnly}
            />

            {/* Descripción */}
            <FormInput
                id="description"
                name="description"
                type="textarea"
                label="Descripción"
                value={formData.description}
                onChange={handleChange}
                error={errors.description}
                required
                readOnly={readOnly}
                disabled={readOnly}
                rows={3}
            />

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
    readOnly: PropTypes.bool,
};
