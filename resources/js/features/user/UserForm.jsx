import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import { XCircleIcon } from "@heroicons/react/24/solid";
import { selectUsersError } from "@store/admin/selectors/usersSelectors";
import RoleForm from "./UserRoleForm";
import { SubmitButton, FormInput } from "@/components/common";

export default function UserForm({
    user = null,
    roles = [],
    onSubmit,
    onCancel,
    isSubmitting = false,
    readOnly = false,
    mode,
    canEditRoles,
    canRenderRoles,
    canChangePassword,
}) {
    const serverErrors = useSelector(selectUsersError);
    const [errors, setErrors] = useState({});
    const [formData, setFormData] = useState({
        name: "",
        last_name: "",
        email: "",
        password: "",
        password_confirmation: "",
        role_id: null,
    });

    // Efectos se mantienen igual
    useEffect(() => {
        if (serverErrors?.errors) {
            setErrors(serverErrors.errors);
        }
    }, [serverErrors]);

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || "",
                last_name: user.last_name || "",
                email: user.email || "",
                password: "",
                password_confirmation: "",
                role_id: user.roles?.[0]?.id || null,
            });
        } else {
            setFormData({
                name: "",
                last_name: "",
                email: "",
                password: "",
                password_confirmation: "",
                role_id: null,
            });
        }
        setErrors({});
    }, [user]);

    // Handlers se mantienen igual
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

    const handleRoleChange = (roleId) => {
        setFormData((prev) => ({
            ...prev,
            role_id: roleId,
        }));

        if (errors.role_id) {
            setErrors((prev) => ({ ...prev, role_id: null }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validaciones actuales...
        const validationErrors = {};
        if (!formData.name.trim()) {
            validationErrors.name = "El nombre es requerido";
        }
        if (!formData.last_name.trim()) {
            validationErrors.last_name = "El apellido es requerido";
        }
        if (!formData.email.trim()) {
            validationErrors.email = "El email es requerido";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            validationErrors.email = "El email no es válido";
        }

        // Solo validar rol_id en creación o si cambió en edición
        if (mode === "create" && !formData.role_id) {
            validationErrors.role_id = "Debe seleccionar un rol";
        }

        if (!user && !formData.password) {
            validationErrors.password = "La contraseña es requerida";
        }
        if (formData.password && formData.password.length < 8) {
            validationErrors.password = "La contraseña debe tener al menos 8 caracteres";
        }
        if (formData.password !== formData.password_confirmation) {
            validationErrors.password_confirmation = "Las contraseñas no coinciden";
        }

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        try {
            const dataToSubmit = {
                name: formData.name,
                last_name: formData.last_name,
                email: formData.email,
            };

            // Solo incluir roles si:
            // 1. Es una creación nueva, o
            // 2. Es una edición y el rol ha cambiado
            if (mode === "create" || (mode === "edit" && user?.roles?.[0]?.id !== formData.role_id)) {
                dataToSubmit.roles = formData.role_id ? [formData.role_id] : [];
            }

            // Solo incluir password si está presente y no está vacío
            if (formData.password && formData.password.trim() !== '') {
                dataToSubmit.password = formData.password;
                dataToSubmit.password_confirmation = formData.password_confirmation;
            }

            await onSubmit(dataToSubmit);
        } catch (error) {
            // Manejo de errores...
            if (error.response?.data?.errors) {
                setErrors(error.response.data.errors);
            } else if (error.response?.data?.message) {
                setErrors({ general: error.response.data.message });
            } else if (typeof error === 'string') {
                setErrors({ general: error });
            } else {
                setErrors({ general: "Ocurrió un error al guardar el usuario." });
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

            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
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

                {/* Apellido */}
                <FormInput
                    id="last_name"
                    name="last_name"
                    label="Apellido"
                    value={formData.last_name}
                    onChange={handleChange}
                    error={errors.last_name}
                    required
                    readOnly={readOnly}
                    disabled={readOnly}
                />

                {/* Email */}
                <div className="sm:col-span-2">
                    <FormInput
                        id="email"
                        name="email"
                        type="email"
                        label="Email"
                        value={formData.email}
                        onChange={handleChange}
                        error={errors.email}
                        required
                        readOnly={readOnly}
                        disabled={readOnly}
                    />
                </div>

                {/* Password fields - Solo mostrar en crear o si tiene permiso */}
                {(mode === "create" || (mode === "edit" && canChangePassword)) && (
                    <>
                        <FormInput
                            id="password"
                            name="password"
                            type="password"
                            label={mode === "edit" ? "Nueva contraseña (opcional)" : "Contraseña"}
                            value={formData.password}
                            onChange={handleChange}
                            error={errors.password}
                            required={mode === "create"}
                            disabled={readOnly}
                        />

                        <FormInput
                            id="password_confirmation"
                            name="password_confirmation"
                            type="password"
                            label="Confirmar contraseña"
                            value={formData.password_confirmation}
                            onChange={handleChange}
                            error={errors.password_confirmation}
                            required={!!formData.password}
                            disabled={readOnly}
                        />
                    </>
                )}
            </div>

            {/* Sección de Rol */}
             {canRenderRoles && (
                <div className="pt-4">
                    <RoleForm
                        selectedRole={formData.role_id}
                        availableRoles={roles}
                        onRoleChange={handleRoleChange}
                        isSubmitting={isSubmitting}
                        errors={errors}
                        readOnly={readOnly || !canEditRoles}
                    />
                </div>
            )}

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
                            isUpdate={mode === "edit"}
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
    roles: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.number.isRequired,
            name: PropTypes.string.isRequired,
            description: PropTypes.string,
        })
    ),
    onSubmit: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    isSubmitting: PropTypes.bool,
    readOnly: PropTypes.bool,
    mode: PropTypes.oneOf(["create", "edit", "view"]),
    canEditRoles: PropTypes.bool,
    canRenderRoles: PropTypes.bool,
    canChangePassword: PropTypes.bool,
};
