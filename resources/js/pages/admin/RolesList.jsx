import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { PencilIcon, TrashIcon, KeyIcon, EyeIcon } from '@heroicons/react/24/solid';
import { Table, TableFilters, ConfirmationDialog } from '@components/common';
import { RoleModal, RolePermissionsModal } from '@features/role';
import { formatDateForDisplay } from '@utils/dateUtils';
import { rolesTableConfig } from '@config/tables/rolesTable';
import { useAuth } from '@hooks';

// Import thunks and actions
import {
  fetchRoles,
  fetchAllPermissions,
  deleteRole
} from '@store/admin/thunks/rolesThunks';

import {
  setFilters,
  setSortConfig,
  setCurrentPage,
  setSelectedRole,
  setEditModalState,
  setDeleteModalState,
  setPermissionsModalState
} from '@store/admin/slices/rolesSlice';

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
  selectFilteredAndSortedRoles
} from '@store/admin/selectors/rolesSelectors';



export default function RoleList() {
  const dispatch = useDispatch();
  const { permissions } = useAuth();
  const [tableConfig] = useState(rolesTableConfig);

  // Specific permissions
  const canViewList = permissions.includes('role.index');
  const canCreate = permissions.includes('role.create');
  const canEdit = permissions.includes('role.edit');
  const canDelete = permissions.includes('role.delete');
  const canView = permissions.includes('role.view');
  const canManagePermissions = permissions.includes('role.manage-permissions');

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

  // Load initial data
  useEffect(() => {
    if (canViewList) {
      dispatch(fetchRoles());
      dispatch(fetchAllPermissions());
    }
  }, [dispatch, canViewList]);

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
      dispatch(setSelectedRole(null));
      dispatch(setEditModalState({ isOpen: true, mode: 'create' }));
    }
  };

  const handleEditClick = (role) => {
    if (canEdit || (canView && !canEdit)) {
      dispatch(setSelectedRole(role));
      dispatch(setEditModalState({
        isOpen: true,
        mode: canEdit ? 'edit' : 'view'
      }));
    }
  };

  const handlePermissionsClick = (role) => {
    if (canManagePermissions) {
      dispatch(setSelectedRole(role));
      dispatch(setPermissionsModalState({ isOpen: true }));
    }
  };

  const handleDeleteClick = (role) => {
    if (canDelete) {
      dispatch(setSelectedRole(role));
      dispatch(setDeleteModalState({ isOpen: true }));
    }
  };

  const handleConfirmDelete = async () => {
    if (canDelete && selectedRole) {
      try {
        await dispatch(deleteRole(selectedRole.id)).unwrap();
        dispatch(setDeleteModalState({ isOpen: false }));
        dispatch(setSelectedRole(null));
      } catch (error) {
        console.error('Error al eliminar el rol:', error);
      }
    }
  };

  const columns = [
    {
      key: 'role_info',
      header: 'Información del rol',
      render: (role) => (
        <div>
          <div className="text-sm font-medium text-gray-900">
            {role.name}
          </div>
          <div className="text-sm text-gray-500">
            {role.description}
          </div>
        </div>
      )
    },
    {
      key: 'created_at',
      header: 'Fecha de creación',
      render: (role) => (
        <span className="text-sm text-gray-500">
          {formatDateForDisplay(role.created_at)}
        </span>
      )
    },
    {
      key: 'actions',
      header: 'Acciones',
      className: 'text-right',
      cellClassName: 'text-right',
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
      )
    }
  ];

  // If no permission to view list
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
          <h1 className="text-2xl font-semibold text-gray-900">Roles</h1>
          <p className="mt-2 text-sm text-gray-700">
            Gestión de roles y sus permisos
          </p>
        </div>
        {canCreate && (
          <div className="mt-4 sm:mt-0">
            <button
              onClick={handleCreateClick}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Crear Rol
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

      <RoleModal
        isOpen={editModal.isOpen}
        mode={editModal.mode}
        onClose={() => {
          dispatch(setEditModalState({ isOpen: false, mode: null }));
          dispatch(setSelectedRole(null));
        }}
        onSuccess={() => {
          dispatch(fetchRoles());
        }}
        readOnly={selectedRole && !canEdit}
      />

      <RolePermissionsModal
        isOpen={permissionsModal.isOpen}
        onClose={() => {
          dispatch(setPermissionsModalState({ isOpen: false }));
          dispatch(setSelectedRole(null));
        }}
        onSuccess={() => {
          dispatch(fetchRoles());
        }}
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
            : 'Confirmar eliminación de rol'
        }
        confirmText="Eliminar"
        cancelText="Cancelar"
        confirmButtonStyle="danger"
      />
    </div>
  );
}