import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import { XCircleIcon } from "@heroicons/react/24/solid";
import { ChevronDownIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { selectRolesError } from "@store/admin/selectors/rolesSelectors";
import { SubmitButton } from "@/components/common";

export default function RolePermissionsForm({
    role,
    permissions = {},
    onSubmit,
    onCancel,
    isSubmitting = false,
    readOnly = false,
}) {
    const serverErrors = useSelector(selectRolesError);
    const [errors, setErrors] = useState({});
    const [selectedPermissions, setSelectedPermissions] = useState(new Set());
    const [expandedGroups, setExpandedGroups] = useState(new Set());

    // Efecto para manejar errores del servidor
    useEffect(() => {
        if (serverErrors?.errors) {
            setErrors(serverErrors.errors);
        }
    }, [serverErrors]);

    // Inicializar permisos seleccionados solo cuando el rol cambia
    useEffect(() => {
        if (role?.permissions) {
            const initialPermissions = new Set(
                role.permissions.map((permission) => permission.id)
            );
            setSelectedPermissions(initialPermissions);

            // También expandimos los grupos que tienen permisos seleccionados
            const groupsToExpand = new Set();
            role.permissions.forEach((permission) => {
                Object.entries(permissions).forEach(([group, groupPerms]) => {
                    if (groupPerms.some((p) => p.id === permission.id)) {
                        groupsToExpand.add(group);
                    }
                });
            });
            setExpandedGroups(groupsToExpand);
        }
    }, [role?.id, permissions, role?.permissions]);

    const handleTogglePermission = (permissionId) => {
        if (readOnly) return;

        setSelectedPermissions((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(permissionId)) {
                newSet.delete(permissionId);
            } else {
                newSet.add(permissionId);
            }
            return newSet;
        });
    };

    const handleToggleGroup = (group) => {
        setExpandedGroups((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(group)) {
                newSet.delete(group);
            } else {
                newSet.add(group);
            }
            return newSet;
        });
    };

    const handleSelectAllGroup = (groupPermissions, e) => {
        e.stopPropagation();
        if (readOnly) return;

        setSelectedPermissions((prev) => {
            const newSet = new Set(prev);
            const allSelected = groupPermissions.every((p) => prev.has(p.id));

            if (allSelected) {
                // Deseleccionar todos los permisos del grupo
                groupPermissions.forEach((p) => newSet.delete(p.id));
            } else {
                // Seleccionar todos los permisos del grupo
                groupPermissions.forEach((p) => newSet.add(p.id));
            }
            return newSet;
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (selectedPermissions.size === 0) {
            setErrors({
                general: "Debe seleccionar al menos un permiso.",
            });
            return;
        }

        try {
            await onSubmit(Array.from(selectedPermissions));
        } catch (error) {
            const errorMessage =
                error?.response?.data?.message ||
                "Ocurrió un error al guardar los permisos.";
            setErrors({
                general: errorMessage,
            });
        }
    };

    const renderError = (error) => {
        if (typeof error === "string") return error;
        if (Array.isArray(error)) return error[0];
        return "Error desconocido";
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error General */}
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
                                {renderError(errors.general)}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Lista de permisos agrupados */}
            <div className="space-y-4">
                {Object.entries(permissions).map(
                    ([group, groupPermissions]) => (
                        <div
                            key={group}
                            className="border rounded-lg overflow-hidden"
                        >
                            {/* Cabecera del grupo */}
                            <div className="bg-gray-50 px-4 py-3">
                                <div className="w-full flex items-center justify-between">
                                    <div
                                        className="flex items-center space-x-3 cursor-pointer"
                                        onClick={() => handleToggleGroup(group)}
                                    >
                                        {/* Icono de expansión */}
                                        {expandedGroups.has(group) ? (
                                            <ChevronDownIcon className="h-5 w-5 text-gray-400" />
                                        ) : (
                                            <ChevronRightIcon className="h-5 w-5 text-gray-400" />
                                        )}
                                        {/* Título del grupo y contador */}
                                        <div className="flex items-center space-x-2">
                                            <span className="font-medium text-gray-900 capitalize">
                                                {group}
                                            </span>
                                            <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-600">
                                                {
                                                    groupPermissions.filter(
                                                        (p) =>
                                                            selectedPermissions.has(
                                                                p.id
                                                            )
                                                    ).length
                                                }{" "}
                                                / {groupPermissions.length}
                                            </span>
                                        </div>
                                    </div>
                                    {/* Botón de selección múltiple */}
                                    {!readOnly && (
                                        <button
                                            type="button"
                                            onClick={(e) =>
                                                handleSelectAllGroup(
                                                    groupPermissions,
                                                    e
                                                )
                                            }
                                            className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
                                        >
                                            {groupPermissions.every((p) =>
                                                selectedPermissions.has(p.id)
                                            )
                                                ? "Deseleccionar todo"
                                                : "Seleccionar todo"}
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Lista de permisos del grupo */}
                            {expandedGroups.has(group) && (
                                <div className="divide-y divide-gray-200">
                                    {groupPermissions.map((permission) => (
                                        <div
                                            key={permission.id}
                                            className="px-4 py-3 hover:bg-gray-50"
                                        >
                                            <div className="relative flex items-start">
                                                {/* Checkbox */}
                                                <div className="flex items-center h-5">
                                                    <input
                                                        type="checkbox"
                                                        id={`permission-${permission.id}`}
                                                        checked={selectedPermissions.has(
                                                            permission.id
                                                        )}
                                                        onChange={() =>
                                                            handleTogglePermission(
                                                                permission.id
                                                            )
                                                        }
                                                        disabled={readOnly}
                                                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                                    />
                                                </div>
                                                {/* Información del permiso */}
                                                <div className="ml-3">
                                                    <label
                                                        htmlFor={`permission-${permission.id}`}
                                                        className="cursor-pointer"
                                                    >
                                                        <span className="block text-sm font-medium text-gray-900">
                                                            {
                                                                permission.display_name
                                                            }
                                                        </span>
                                                        <span className="block text-sm text-gray-500">
                                                            {
                                                                permission.description
                                                            }
                                                        </span>
                                                        <span className="block text-xs text-gray-400 mt-1">
                                                            {permission.name}
                                                        </span>
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )
                )}
            </div>

            {/* Botones de acción */}
            <div className="flex justify-end space-x-3 pt-4 border-t">
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
                            submitText="Guardar permisos"
                            updateText="Guardar permisos"
                            loadingText="Guardando permisos..."
                        />
                    </>
                )}
            </div>
        </form>
    );
}

RolePermissionsForm.propTypes = {
    role: PropTypes.shape({
        id: PropTypes.number,
        name: PropTypes.string,
        permissions: PropTypes.arrayOf(
            PropTypes.shape({
                id: PropTypes.number,
                name: PropTypes.string,
                display_name: PropTypes.string,
                description: PropTypes.string,
            })
        ),
    }),
    permissions: PropTypes.object.isRequired,
    onSubmit: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    isSubmitting: PropTypes.bool,
    readOnly: PropTypes.bool,
};
