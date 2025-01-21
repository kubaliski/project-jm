import React, { useEffect, useMemo, useCallback } from "react";
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
import { UserModal, UserRolesModal } from "@features/user";
import { formatDateForDisplay } from "@utils/dateUtils";
import { usersTableConfig } from "@config/tables/usersTable";
import { useAuth, useToast } from "@hooks";

// Importar thunks y actions
import { fetchUsers, deleteUser } from "@store/admin/thunks/usersThunks";
import { fetchRoles } from "@store/admin/thunks/rolesThunks";

// Importar acciones del slice
import {
    setFilters,
    setSortConfig,
    setCurrentPage,
    setSelectedUser,
    setEditModalState,
    setDeleteModalState,
    setRolesModalState,
} from "@store/admin/slices/usersSlice";

// Importar selectores de usuarios
import {
    selectPaginatedUsers,
    selectUsersLoading,
    selectUsersError,
    selectUsersFilters,
    selectUsersSortConfig,
    selectUsersPagination,
    selectSelectedUser,
    selectEditModalState,
    selectDeleteModalState,
    selectRolesModalState,
    selectFilteredAndSortedUsers,
} from "@store/admin/selectors/usersSelectors";

// Importar selectores de roles
import { selectRoles } from "@store/admin/selectors/rolesSelectors";
export default function UsersList() {
    const dispatch = useDispatch();
    const { hasPermission, user: currentUser } = useAuth();
    const toast = useToast();

    // Permisos memoizados
    const permissions = useMemo(() => ({
        viewList: hasPermission("user.index"),
        create: hasPermission("user.create"),
        edit: hasPermission("user.edit"),
        delete: hasPermission("user.delete"),
        view: hasPermission("user.view"),
        assignRoles: hasPermission("user.assign-roles")
    }), [hasPermission]);

    // Selectores
    const users = useSelector(selectPaginatedUsers);
    const isLoading = useSelector(selectUsersLoading);
    const error = useSelector(selectUsersError);
    const filters = useSelector(selectUsersFilters);
    const sortConfig = useSelector(selectUsersSortConfig);
    const { currentPage, itemsPerPage } = useSelector(selectUsersPagination);
    const editModal = useSelector(selectEditModalState);
    const deleteModal = useSelector(selectDeleteModalState);
    const rolesModal = useSelector(selectRolesModalState);
    const filteredUsers = useSelector(selectFilteredAndSortedUsers);
    const selectedUser = useSelector(selectSelectedUser);
    const roles = useSelector(selectRoles);
    // Carga inicial de datos
    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                if (!permissions.viewList) return;

                const loadPromises = [
                    dispatch(fetchUsers()).unwrap(),
                    dispatch(fetchRoles()).unwrap()
                ];
                await Promise.all(loadPromises);
            } catch (error) {
                toast.error("Error al cargar los datos: " + error.message);
            }
        };

        fetchInitialData();
    }, []); // Solo se ejecuta al montar el componente

    // Configuración de filtros de roles memoizada
    const roleOptions = useMemo(() => {
        if (!roles.length) return [];

        return [
            { value: "", label: "Todos los roles" },
            ...roles.map((role) => ({
                value: role.id.toString(),
                label: role.name.charAt(0).toUpperCase() + role.name.slice(1),
            })),
        ];
    }, [roles]);

    // Config de tabla memoizada
    const tableConfig = useMemo(() => ({
        ...usersTableConfig,
        filters: usersTableConfig.filters.map(filter =>
            filter.key === "role"
                ? { ...filter, options: roleOptions }
                : filter
        )
    }), [roleOptions]);

    // Handlers memoizados
    const handleFilterChange = useCallback((key, value) => {
        dispatch(setFilters({
            ...filters,
            [key]: value,
        }));
    }, [dispatch, filters]);

    const handleSortChange = useCallback((field, direction) => {
        dispatch(setSortConfig({ field, direction }));
    }, [dispatch]);

    const handlePageChange = useCallback((page) => {
        dispatch(setCurrentPage(page));
    }, [dispatch]);

    const handleCreateClick = useCallback(() => {
        if (permissions.create) {
            dispatch(setSelectedUser(null));
            dispatch(setEditModalState({ isOpen: true, mode: "create" }));
        } else {
            toast.warning("No tienes permisos para crear un nuevo usuario.");
        }
    }, [permissions.create, dispatch, toast]);

    const handleEditClick = useCallback((user) => {
        if (permissions.edit || (permissions.view && !permissions.edit)) {
            dispatch(setSelectedUser(user));
            dispatch(
                setEditModalState({
                    isOpen: true,
                    mode: permissions.edit ? "edit" : "view",
                })
            );
        } else {
            toast.warning("No tienes permisos para ver/editar usuarios");
        }
    }, [permissions.edit, permissions.view, dispatch, toast]);

    const handleRolesClick = useCallback((user) => {
        if (permissions.assignRoles) {
            dispatch(setSelectedUser(user));
            dispatch(setRolesModalState({ isOpen: true }));
        } else {
            toast.warning("No tienes permisos para asignar roles");
        }
    }, [permissions.assignRoles, dispatch, toast]);

    const handleDeleteClick = useCallback((user) => {
        if (permissions.delete && user.id !== currentUser.id) {
            dispatch(setSelectedUser(user));
            dispatch(setDeleteModalState({ isOpen: true }));
        } else if (user.id === currentUser.id) {
            toast.warning("No puedes eliminar tu propio usuario");
        } else {
            toast.warning("No tienes permisos para eliminar usuarios");
        }
    }, [permissions.delete, currentUser.id, dispatch, toast]);

    const handleConfirmDelete = useCallback(async () => {
        if (!selectedUser || !permissions.delete || selectedUser.id === currentUser.id) return;

        try {
            await dispatch(deleteUser(selectedUser.id)).unwrap();
            toast.success(
                `El usuario ${selectedUser.name} ${selectedUser.last_name} ha sido eliminado`
            );

            dispatch(setDeleteModalState({ isOpen: false }));
            dispatch(setSelectedUser(null));
            await dispatch(fetchUsers()).unwrap();
        } catch (error) {
            toast.error("Error al eliminar el usuario: " + error.message);
        }
    }, [selectedUser, permissions.delete, currentUser.id, dispatch, toast]);

    const handleModalSuccess = useCallback(async (action) => {
        try {
            await dispatch(fetchUsers()).unwrap();
            toast.success(
                action === "create"
                    ? "Usuario creado correctamente"
                    : "Usuario actualizado correctamente"
            );
        } catch (error) {
            toast.error(
                "Error al actualizar la lista de usuarios: " + error.message
            );
        }
    }, [dispatch, toast]);

    const handleRolesSuccess = useCallback(async () => {
        try {
            await dispatch(fetchUsers()).unwrap();
            toast.success("Roles actualizados correctamente");
        } catch (error) {
            toast.error("Error al actualizar los roles: " + error.message);
        }
    }, [dispatch, toast]);

    // Columnas memoizadas
    const columns = useMemo(() => [
        {
            key: "user_info",
            header: "Información del usuario",
            render: (user) => (
                <div>
                    <div className="text-sm font-medium text-gray-900">
                        {`${user.name} ${user.last_name}`}
                    </div>
                    <div className="text-sm text-gray-500">{user.email}</div>
                </div>
            ),
        },
        {
            key: "roles",
            header: "Roles",
            render: (user) => (
                <div className="flex flex-wrap gap-1">
                    {user.roles.map((role) => (
                        <span
                            key={role.id}
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                        >
                            {role.name.charAt(0).toUpperCase() +
                                role.name.slice(1)}
                        </span>
                    ))}
                </div>
            ),
        },
        {
            key: "created_at",
            header: "Fecha de registro",
            render: (user) => (
                <span className="text-sm text-gray-500">
                    {formatDateForDisplay(user.created_at)}
                </span>
            ),
        },
        {
            key: "actions",
            header: "Acciones",
            className: "text-right",
            cellClassName: "text-right",
            render: (user) => (
                <div className="flex justify-end space-x-3">
                    {(permissions.view || permissions.edit) && (
                        <button
                            onClick={() => handleEditClick(user)}
                            className="text-indigo-600 hover:text-indigo-900"
                            title={permissions.edit ? "Editar" : "Ver"}
                        >
                            {permissions.edit ? (
                                <PencilIcon className="h-5 w-5" />
                            ) : (
                                <EyeIcon className="h-5 w-5" />
                            )}
                        </button>
                    )}
                    {permissions.assignRoles && user.id !== currentUser.id && (
                        <button
                            onClick={() => handleRolesClick(user)}
                            className="text-blue-600 hover:text-blue-900"
                            title="Asignar roles"
                        >
                            <KeyIcon className="h-5 w-5" />
                        </button>
                    )}
                    {permissions.delete && user.id !== currentUser.id && (
                        <button
                            onClick={() => handleDeleteClick(user)}
                            className="text-red-600 hover:text-red-900"
                            title="Eliminar"
                        >
                            <TrashIcon className="h-5 w-5" />
                        </button>
                    )}
                </div>
            ),
        },
    ], [
        permissions,
        currentUser.id,
        handleEditClick,
        handleRolesClick,
        handleDeleteClick
    ]);
    // Verificación de acceso
    if (!permissions.viewList) {
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
                title="Usuarios"
                titleLevel="h1"
                subtitle="Gestión de usuarios"
                contentClassName="sm:flex sm:items-center sm:justify-between"
            />
            <Paper>
                {permissions.create && (
                    <Button onClick={handleCreateClick}>Nuevo usuario</Button>
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
                                    Error al cargar los usuarios
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
                    data={users}
                    isLoading={isLoading}
                    currentPage={currentPage}
                    totalPages={Math.ceil(filteredUsers.length / itemsPerPage)}
                    totalItems={filteredUsers.length}
                    itemsPerPage={itemsPerPage}
                    onPageChange={handlePageChange}
                    emptyMessage="No hay usuarios registrados"
                    mainColumn="user_info"
                />
            </Paper>

            <UserModal
                isOpen={editModal.isOpen}
                mode={editModal.mode}
                onClose={() => {
                    dispatch(setEditModalState({ isOpen: false, mode: null }));
                    dispatch(setSelectedUser(null));
                }}
                onSuccess={() => handleModalSuccess(editModal.mode)}
                readOnly={selectedUser && !permissions.edit}
            />

            <UserRolesModal
                isOpen={rolesModal.isOpen}
                onClose={() => {
                    dispatch(setRolesModalState({ isOpen: false }));
                    dispatch(setSelectedUser(null));
                }}
                onSuccess={handleRolesSuccess}
            />

            <ConfirmationDialog
                isOpen={deleteModal.isOpen}
                onClose={() => {
                    dispatch(setDeleteModalState({ isOpen: false }));
                    dispatch(setSelectedUser(null));
                }}
                onConfirm={handleConfirmDelete}
                title="Confirmar eliminación"
                message={
                    selectedUser
                        ? `¿Estás seguro de que quieres eliminar el usuario ${selectedUser.name} ${selectedUser.last_name}?`
                        : "Confirmar eliminación de usuario"
                }
                confirmText="Eliminar"
                cancelText="Cancelar"
                confirmButtonStyle="danger"
            />
        </div>
    );
}