import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { PencilIcon, TrashIcon, KeyIcon, EyeIcon } from '@heroicons/react/24/solid';
import { Table, TableFilters, ConfirmationDialog } from '@components/common';
import { UserModal, UserRolesModal } from '@features/user';
import { formatDateForDisplay } from '@utils/dateUtils';
import { usersTableConfig } from '@config/tables/usersTable';
import { useAuth } from '@hooks';

// Importar thunks y actions
import {
  fetchUsers,
  deleteUser
} from '@store/admin/thunks/usersThunks';
import { fetchRoles } from '@store/admin/thunks/rolesThunks';

import {
  setFilters,
  setSortConfig,
  setCurrentPage,
  setSelectedUser,
  setEditModalState,
  setDeleteModalState,
  setRolesModalState
} from '@store/admin/slices/usersSlice';

// Importar selectores de usuarios y roles
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
  selectFilteredAndSortedUsers
} from '@store/admin/selectors/usersSelectors';

import {
  selectRoles,
  selectRolesLoading
} from '@store/admin/selectors/rolesSelectors';

export default function UsersList() {
  const dispatch = useDispatch();
  const { permissions, user: currentUser } = useAuth();
  const [tableConfig, setTableConfig] = useState(usersTableConfig);

  // Permisos específicos
  const canViewList = permissions.includes('user.index');
  const canCreate = permissions.includes('user.create');
  const canEdit = permissions.includes('user.edit');
  const canDelete = permissions.includes('user.delete');
  const canView = permissions.includes('user.view');
  const canAssignRoles = permissions.includes('user.assign-roles');

  // Selectors de usuarios
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

  // Selectors de roles
  const roles = useSelector(selectRoles);
  const rolesLoading = useSelector(selectRolesLoading);

  // Cargar datos iniciales
  useEffect(() => {
    if (canViewList) {
      dispatch(fetchUsers());
      dispatch(fetchRoles()); // Cargar roles para los filtros y modales
    }
  }, [dispatch, canViewList]);

  // Configurar opciones de roles para los filtros
  useEffect(() => {
    if (roles.length > 0) {
      const roleOptions = [
        { value: '', label: 'Todos los roles' },
        ...roles.map(role => ({
          value: role.id.toString(),
          label: role.name.charAt(0).toUpperCase() + role.name.slice(1)
        }))
      ];

      setTableConfig(prevConfig => ({
        ...prevConfig,
        filters: prevConfig.filters.map(filter =>
          filter.key === 'role'
            ? { ...filter, options: roleOptions }
            : filter
        )
      }));
    }
  }, [roles]);

  // Event Handlers
  const handleFilterChange = (key, value) => {
    dispatch(setFilters({
      ...filters,
      [key]: value
    }));
  };

  const handleSortChange = (field, direction) => {
    dispatch(setSortConfig({ field, direction }));
  };

  const handlePageChange = (page) => {
    dispatch(setCurrentPage(page));
  };

  const handleCreateClick = () => {
    if (canCreate) {
      dispatch(setSelectedUser(null));
      dispatch(setEditModalState({ isOpen: true, mode: 'create' }));
    }
  };

  const handleEditClick = (user) => {
    if (canEdit || (canView && !canEdit)) {
      dispatch(setSelectedUser(user));
      dispatch(setEditModalState({
        isOpen: true,
        mode: canEdit ? 'edit' : 'view'
      }));
    }
  };

  const handleRolesClick = (user) => {
    if (canAssignRoles) {
      dispatch(setSelectedUser(user));
      dispatch(setRolesModalState({ isOpen: true }));
    }
  };

  const handleDeleteClick = (user) => {
    if (canDelete && user.id !== currentUser.id) {
      dispatch(setSelectedUser(user));
      dispatch(setDeleteModalState({ isOpen: true }));
    }
  };

  const handleConfirmDelete = async () => {
    if (canDelete && selectedUser && selectedUser.id !== currentUser.id) {
      try {
        await dispatch(deleteUser(selectedUser.id)).unwrap();
        dispatch(setDeleteModalState({ isOpen: false }));
        dispatch(setSelectedUser(null));
      } catch (error) {
        console.error('Error al eliminar el usuario:', error);
      }
    }
  };

  const columns = [
    {
      key: 'user_info',
      header: 'Información del usuario',
      render: (user) => (
        <div>
          <div className="text-sm font-medium text-gray-900">
            {`${user.name} ${user.last_name}`}
          </div>
          <div className="text-sm text-gray-500">{user.email}</div>
        </div>
      )
    },
    {
      key: 'roles',
      header: 'Roles',
      render: (user) => (
        <div className="flex flex-wrap gap-1">
          {user.roles.map(role => (
            <span
              key={role.id}
              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
            >
              {role.name.charAt(0).toUpperCase() + role.name.slice(1)}
            </span>
          ))}
        </div>
      )
    },
    {
      key: 'created_at',
      header: 'Fecha de registro',
      render: (user) => (
        <span className="text-sm text-gray-500">
          {formatDateForDisplay(user.created_at)}
        </span>
      )
    },
    {
      key: 'actions',
      header: 'Acciones',
      className: 'text-right',
      cellClassName: 'text-right',
      render: (user) => (
        <div className="flex justify-end space-x-3">
          {(canView || canEdit) && (
            <button
              onClick={() => handleEditClick(user)}
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
          {canAssignRoles && user.id !== currentUser.id && (
            <button
              onClick={() => handleRolesClick(user)}
              className="text-blue-600 hover:text-blue-900"
              title="Asignar roles"
            >
              <KeyIcon className="h-5 w-5" />
            </button>
          )}
          {canDelete && user.id !== currentUser.id && (
            <button
              onClick={() => handleDeleteClick(user)}
              className="text-red-600 hover:text-red-900"
              title="Eliminar"
            >
              <TrashIcon className="h-5 w-5" />
            </button>
          )}
        </div>
      )
    }
  ];

  // Si no tiene permiso para ver la lista
  if (!canViewList) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No tienes permisos para ver esta sección.</p>
      </div>
    );
  }



  return (
    <div className="space-y-6">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Usuarios</h1>
          <p className="mt-2 text-sm text-gray-700">
            Gestión de usuarios y sus roles
          </p>
        </div>
        {canCreate && (
          <div className="mt-4 sm:mt-0">
            <button
              onClick={handleCreateClick}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Crear Usuario
            </button>
          </div>
        )}
      </div>

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
      />

      <UserModal
        isOpen={editModal.isOpen}
        mode={editModal.mode}
        onClose={() => {
          dispatch(setEditModalState({ isOpen: false, mode: null }));
          dispatch(setSelectedUser(null));
        }}
        onSuccess={() => {
          dispatch(fetchUsers());
        }}
        readOnly={selectedUser && !canEdit}
      />

      <UserRolesModal
        isOpen={rolesModal.isOpen}
        onClose={() => {
          dispatch(setRolesModalState({ isOpen: false }));
          dispatch(setSelectedUser(null));
        }}
        onSuccess={() => {
          dispatch(fetchUsers());
        }}
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
            : 'Confirmar eliminación de usuario'
        }
        confirmText="Eliminar"
        cancelText="Cancelar"
        confirmButtonStyle="danger"
      />
    </div>
  );
}