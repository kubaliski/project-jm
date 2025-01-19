import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    PencilIcon,
    TrashIcon,
    KeyIcon,
    EyeIcon,
} from "@heroicons/react/24/solid";
import {
    Table,
    TableFilters,
    ConfirmationDialog,
    Paper,
    Button,
} from "@components/common";
import { RoleModal, RolePermissionsModal } from "@features/role";
import { formatDateForDisplay } from "@utils/dateUtils";
import { rolesTableConfig } from "@config/tables/rolesTable";
import { useAuth, useToast } from "@hooks";

// Import thunks and actions
import {
    fetchRoles,
    fetchAllPermissions,
    deleteRole,
} from "@store/admin/thunks/rolesThunks";

import {
    setFilters,
    setSortConfig,
    setCurrentPage,
    setSelectedRole,
    setEditModalState,
    setDeleteModalState,
    setPermissionsModalState,
} from "@store/admin/slices/rolesSlice";

// Import selectors
import {
    selectPaginatedRoles,
    selectRolesLoading,
    selectRolesError,
    selectRolesFilters,
    selectRolesSortConfig,
    selectRolesPagination,
    selectSelectedRole,
    selectEditModalState,
    selectDeleteModalState,
    selectPermissionsModalState,
    selectFilteredAndSortedRoles,
} from "@store/admin/selectors/rolesSelectors";

export default function RoleList() {
    const dispatch = useDispatch();
    const { hasPermission } = useAuth();
    const toast = useToast();
    const [tableConfig] = useState(rolesTableConfig);

    //Permisos de la vista
    const canViewList = hasPermission("role.index");
    const canCreate = hasPermission("role.create");
    const canEdit = hasPermission("role.edit");
    const canDelete = hasPermission("role.delete");
    const canView = hasPermission("role.view");
    const canManagePermissions = hasPermission(
        "role.manage-permissions"
    );

    // Selectors
    const roles = useSelector(selectPaginatedRoles);
    const isLoading = useSelector(selectRolesLoading);
    const error = useSelector(selectRolesError);
    const filters = useSelector(selectRolesFilters);
    const sortConfig = useSelector(selectRolesSortConfig);
    const { currentPage, itemsPerPage } = useSelector(selectRolesPagination);
    const editModal = useSelector(selectEditModalState);
    const deleteModal = useSelector(selectDeleteModalState);
    const permissionsModal = useSelector(selectPermissionsModalState);
    const filteredRoles = useSelector(selectFilteredAndSortedRoles);
    const selectedRole = useSelector(selectSelectedRole);

    // carga inicial de datos
    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                if (canViewList) {
                    await dispatch(fetchRoles()).unwrap();
                    await dispatch(fetchAllPermissions()).unwrap();
                }
            } catch (error) {
                toast.error("Error al cargar los datos: " + error.message);
            }
        };

        fetchInitialData();
    }, [dispatch, canViewList]);

    // Event Handlers
    const handleFilterChange = (key, value) => {
        dispatch(
            setFilters({
                ...filters,
                [key]: value,
            })
        );
    };

    const handleSortChange = (field, direction) => {
        dispatch(setSortConfig({ field, direction }));
    };

    const handlePageChange = (page) => {
        dispatch(setCurrentPage(page));
    };

    const handleCreateClick = () => {
        if (canCreate) {
            dispatch(setSelectedRole(null));
            dispatch(setEditModalState({ isOpen: true, mode: "create" }));
        } else {
            toast.warning("No tienes permisos para crear roles");
        }
    };

    const handleEditClick = (role) => {
        if (canEdit || (canView && !canEdit)) {
            dispatch(setSelectedRole(role));
            dispatch(
                setEditModalState({
                    isOpen: true,
                    mode: canEdit ? "edit" : "view",
                })
            );
        } else {
            toast.warning("No tienes permisos para editar roles");
        }
    };

    const handlePermissionsClick = (role) => {
        if (canManagePermissions) {
            dispatch(setSelectedRole(role));
            dispatch(setPermissionsModalState({ isOpen: true }));
        } else {
            toast.warning("No tienes permisos para gestionar permisos");
        }
    };

    const handleDeleteClick = (role) => {
        if (canDelete) {
            dispatch(setSelectedRole(role));
            dispatch(setDeleteModalState({ isOpen: true }));
        } else {
            toast.warning("No tienes permisos para eliminar roles");
        }
    };

    const handleConfirmDelete = async () => {
        if (canDelete && selectedRole) {
            try {
                await dispatch(deleteRole(selectedRole.id)).unwrap();
                toast.success(`El rol ${selectedRole.name} ha sido eliminado`);

                dispatch(setDeleteModalState({ isOpen: false }));
                dispatch(setSelectedRole(null));
            } catch (error) {
                toast.error("Error al eliminar el rol: " + error.message);
            }
        }
    };

    const handleModalSuccess = async (action) => {
        try {
            await dispatch(fetchRoles()).unwrap();
            toast.success(
                action === 'create'
                    ? "Rol creado correctamente"
                    : "Rol actualizado correctamente"
            );
        } catch (error) {
            toast.error("Error al actualizar la lista de roles: " + error.message);
        }
    };

    const handlePermissionsSuccess = async () => {
        try {
            await dispatch(fetchRoles()).unwrap();
            toast.success("Permisos del rol actualizados correctamente");
        } catch (error) {
            toast.error("Error al actualizar los permisos del rol: " + error.message);
        }
    };

    const columns = [
        {
            key: "role_info",
            header: "Información del rol",
            render: (role) => (
                <div>
                    <div className="text-sm font-medium text-gray-900">
                        {role.name}
                    </div>
                    <div className="text-sm text-gray-500">
                        {role.description}
                    </div>
                </div>
            ),
        },
        {
            key: "created_at",
            header: "Fecha de creación",
            render: (role) => (
                <span className="text-sm text-gray-500">
                    {formatDateForDisplay(role.created_at)}
                </span>
            ),
        },
        {
            key: "actions",
            header: "Acciones",
            className: "text-right",
            cellClassName: "text-right",
            render: (role) => (
                <div className="flex justify-end space-x-3">
                    {(canView || canEdit) && (
                        <button
                            onClick={() => handleEditClick(role)}
                            className="text-indigo-600 hover:text-indigo-900"
                            title={canEdit ? "Editar" : "Ver"}
                        >
                            {canEdit ? (
                                <PencilIcon className="h-5 w-5" />
                            ) : (
                                <EyeIcon className="h-5 w-5" />
                            )}
                        </button>
                    )}
                    {canManagePermissions && (
                        <button
                            onClick={() => handlePermissionsClick(role)}
                            className="text-blue-600 hover:text-blue-900"
                            title="Gestionar permisos"
                        >
                            <KeyIcon className="h-5 w-5" />
                        </button>
                    )}
                    {canDelete && (
                        <button
                            onClick={() => handleDeleteClick(role)}
                            className="text-red-600 hover:text-red-900"
                            title="Eliminar"
                        >
                            <TrashIcon className="h-5 w-5" />
                        </button>
                    )}
                </div>
            ),
        },
    ];

    // If no permission to view list
    if (!canViewList) {
        return (
            <Paper title="Acceso denegado" titleLevel="h1">
                <p className="text-gray-500">
                    No tienes permisos para ver esta sección.
                </p>
            </Paper>
        );
    }

    return (
        <div className="space-y-6">
            <Paper
                title="Roles"
                titleLevel="h1"
                subtitle="Gestión de roles y sus permisos"
                contentclassName="sm:flex sm:items-center sm:justify-between"
            ></Paper>
            <Paper>
                {canCreate && (
                    <Button onClick={handleCreateClick}>Crear rol</Button>
                )}
                <TableFilters
                    config={tableConfig}
                    filters={filters}
                    sortConfig={sortConfig}
                    onFilterChange={handleFilterChange}
                    onSortChange={handleSortChange}
                />

                {error && (
                    <div className="rounded-md bg-red-50 p-4">
                        <div className="flex">
                            <div className="ml-3">
                                <h3 className="text-sm font-medium text-red-800">
                                    Error al cargar los roles
                                </h3>
                                <div className="mt-2 text-sm text-red-700">
                                    {error}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <Table
                    columns={columns}
                    data={roles}
                    isLoading={isLoading}
                    currentPage={currentPage}
                    totalPages={Math.ceil(filteredRoles.length / itemsPerPage)}
                    totalItems={filteredRoles.length}
                    itemsPerPage={itemsPerPage}
                    onPageChange={handlePageChange}
                    emptyMessage="No hay roles registrados"
                />
            </Paper>

            <RoleModal
                isOpen={editModal.isOpen}
                mode={editModal.mode}
                onClose={() => {
                    dispatch(setEditModalState({ isOpen: false, mode: null }));
                    dispatch(setSelectedRole(null));
                }}
                onSuccess={() => handleModalSuccess(editModal.mode)}
                readOnly={selectedRole && !canEdit}
            />

            <RolePermissionsModal
                isOpen={permissionsModal.isOpen}
                onClose={() => {
                    dispatch(setPermissionsModalState({ isOpen: false }));
                    dispatch(setSelectedRole(null));
                }}
                onSuccess={handlePermissionsSuccess}
                readOnly={!canManagePermissions}
            />

            <ConfirmationDialog
                isOpen={deleteModal.isOpen}
                onClose={() => {
                    dispatch(setDeleteModalState({ isOpen: false }));
                    dispatch(setSelectedRole(null));
                }}
                onConfirm={handleConfirmDelete}
                title="Confirmar eliminación"
                message={
                    selectedRole
                        ? `¿Estás seguro de que quieres eliminar el rol ${selectedRole.name}?`
                        : "Confirmar eliminación de rol"
                }
                confirmText="Eliminar"
                cancelText="Cancelar"
                confirmButtonStyle="danger"
            />
        </div>
    );
}
