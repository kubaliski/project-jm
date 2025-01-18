// src/store/admin/selectors/rolesSelectors.js
import { createSelector } from '@reduxjs/toolkit';

// Selectores base
export const selectRoles = (state) => state.admin.roles.items;
export const selectPermissions = (state) => state.admin.roles.permissions;
export const selectRolesLoading = (state) => state.admin.roles.loading;
export const selectRolesError = (state) => state.admin.roles.error;
export const selectRolesFilters = (state) => state.admin.roles.filters;
export const selectRolesSortConfig = (state) => state.admin.roles.sort;
export const selectRolesPagination = (state) => state.admin.roles.pagination;
export const selectSelectedRole = (state) => state.admin.roles.selectedRole;
export const selectEditModalState = (state) => state.admin.roles.editModal;
export const selectDeleteModalState = (state) => state.admin.roles.deleteModal;
export const selectPermissionsModalState = (state) => state.admin.roles.permissionsModal;

// Selector para filtrar y ordenar roles
export const selectFilteredAndSortedRoles = createSelector(
  [selectRoles, selectRolesFilters, selectRolesSortConfig],
  (roles, filters, sortConfig) => {
    let result = [...roles];

    // Aplicar filtros
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(role =>
        role.name.toLowerCase().includes(searchLower) ||
        role.description?.toLowerCase().includes(searchLower)
      );
    }

    // Aplicar ordenamiento
    if (sortConfig.field) {
      result.sort((a, b) => {
        let aValue = a[sortConfig.field];
        let bValue = b[sortConfig.field];

        // Manejar casos especiales
        if (sortConfig.field === 'permissions') {
          aValue = a.permissions.map(p => p.name).join(', ');
          bValue = b.permissions.map(p => p.name).join(', ');
        }

        // Manejar valores nulos o undefined
        if (aValue === null || aValue === undefined) aValue = '';
        if (bValue === null || bValue === undefined) bValue = '';

        // Invertir el orden si es descendente
        const comparison = aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
        return sortConfig.direction === 'desc' ? -comparison : comparison;
      });
    }

    return result;
  }
);

// Selector para roles paginados
export const selectPaginatedRoles = createSelector(
  [selectFilteredAndSortedRoles, selectRolesPagination],
  (roles, pagination) => {
    const { currentPage, itemsPerPage } = pagination;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return roles.slice(startIndex, endIndex);
  }
);

// Selector para permisos organizados por grupo
export const selectPermissionsByGroup = createSelector(
  [selectPermissions],
  (permissions) => permissions
);

// Selector para obtener los nombres de los permisos de un rol
export const selectRolePermissionNames = createSelector(
  [selectSelectedRole],
  (role) => role ? role.permissions.map(permission => permission.name) : []
);

// Selector para verificar si un rol tiene un permiso específico
export const makeSelectHasPermission = () => {
  return createSelector(
    [selectSelectedRole, (_, permissionName) => permissionName],
    (role, permissionName) => {
      if (!role) return false;
      return role.permissions.some(permission => permission.name === permissionName);
    }
  );
};