// src/store/admin/selectors/usersSelectors.js
import { createSelector } from '@reduxjs/toolkit';

// Selectores base
export const selectUsers = (state) => state.admin.users.items;
export const selectUsersLoading = (state) => state.admin.users.loading;
export const selectUsersError = (state) => state.admin.users.error;
export const selectUsersFilters = (state) => state.admin.users.filters;
export const selectUsersSortConfig = (state) => state.admin.users.sort;
export const selectUsersPagination = (state) => state.admin.users.pagination;
export const selectSelectedUser = (state) => state.admin.users.selectedUser;
export const selectEditModalState = (state) => state.admin.users.editModal;
export const selectDeleteModalState = (state) => state.admin.users.deleteModal;
export const selectRolesModalState = (state) => state.admin.users.rolesModal;

// Selector para filtrar y ordenar usuarios
export const selectFilteredAndSortedUsers = createSelector(
  [selectUsers, selectUsersFilters, selectUsersSortConfig],
  (users, filters, sortConfig) => {
    let result = [...users];

    // Aplicar filtros
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(user =>
        user.name.toLowerCase().includes(searchLower) ||
        user.last_name.toLowerCase().includes(searchLower) ||
        user.email.toLowerCase().includes(searchLower)
      );
    }

    if (filters.role && filters.role !== '') {
      const roleId = parseInt(filters.role, 10); // Convertir a número
      result = result.filter(user =>
        user.roles.some(role => role.id === roleId)
      );
    }

    // Aplicar ordenamiento
    if (sortConfig.field) {
      result.sort((a, b) => {
        let aValue = a[sortConfig.field];
        let bValue = b[sortConfig.field];

        // Manejar casos especiales
        if (sortConfig.field === 'roles') {
          aValue = a.roles.map(r => r.name).join(', ');
          bValue = b.roles.map(r => r.name).join(', ');
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

// Selector para usuarios paginados
export const selectPaginatedUsers = createSelector(
  [selectFilteredAndSortedUsers, selectUsersPagination],
  (users, pagination) => {
    const { currentPage, itemsPerPage } = pagination;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return users.slice(startIndex, endIndex);
  }
);