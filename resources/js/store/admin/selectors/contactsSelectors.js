// src/store/admin/selectors/contactsSelectors.js
import { createSelector } from '@reduxjs/toolkit';

// Selectores base
export const selectContacts = (state) => state.admin.contacts.items;
export const selectContactsLoading = (state) => state.admin.contacts.loading;
export const selectContactsError = (state) => state.admin.contacts.error;
export const selectContactsFilters = (state) => state.admin.contacts.filters;
export const selectContactsSortConfig = (state) => state.admin.contacts.sort;
export const selectContactsPagination = (state) => state.admin.contacts.pagination;
export const selectSelectedContact = (state) => state.admin.contacts.selectedContact;
export const selectEditModalState = (state) => state.admin.contacts.editModal;
export const selectDeleteModalState = (state) => state.admin.contacts.deleteModal;

// Selectores para estadísticas
export const selectContactsStats = (state) => state.admin.contacts.stats;
export const selectTotalContacts = (state) => state.admin.contacts.stats.total_contacts;
export const selectStatsLoading = (state) => state.admin.contacts.stats.loading;
export const selectStatsError = (state) => state.admin.contacts.stats.error;

// Selector para filtrar y ordenar contactos
export const selectFilteredAndSortedContacts = createSelector(
  [selectContacts, selectContactsFilters, selectContactsSortConfig],
  (contacts, filters, sortConfig) => {
    let result = [...contacts];

    // Aplicar filtros
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(contact =>
        contact.full_name.toLowerCase().includes(searchLower) ||
        contact.email.toLowerCase().includes(searchLower) ||
        contact.subject?.toLowerCase().includes(searchLower) ||
        contact.message?.toLowerCase().includes(searchLower) ||
        contact.phone?.toLowerCase().includes(searchLower)
      );
    }

    if (filters.status) {
      result = result.filter(contact => contact.status === filters.status);
    }

    if (filters.dateRange) {
      const { startDate, endDate } = filters.dateRange;
      result = result.filter(contact => {
        const contactDate = new Date(contact.created_at);
        return (!startDate || contactDate >= new Date(startDate)) &&
               (!endDate || contactDate <= new Date(endDate));
      });
    }

    // Aplicar ordenamiento
    if (sortConfig.field) {
      result.sort((a, b) => {
        let aValue = a[sortConfig.field];
        let bValue = b[sortConfig.field];

        // Manejar casos especiales de ordenamiento
        if (sortConfig.field === 'status') {
          aValue = getStatusPriority(a);
          bValue = getStatusPriority(b);
        }

        // Manejar valores nulos o undefined
        if (aValue === null || aValue === undefined) aValue = '';
        if (bValue === null || bValue === undefined) bValue = '';

        // Invertir el orden si es descendente
        if (sortConfig.direction === 'desc') {
          [aValue, bValue] = [bValue, aValue];
        }

        return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
      });
    }

    return result;
  }
);

// Selector para contactos paginados
export const selectPaginatedContacts = createSelector(
  [selectFilteredAndSortedContacts, selectContactsPagination],
  (contacts, pagination) => {
    const { currentPage, itemsPerPage } = pagination;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    return contacts.slice(startIndex, endIndex);
  }
);

// Función auxiliar para ordenar por estado
const getStatusPriority = (contact) => {
  const priorities = {
    'pending': 1,
    'in_progress': 2,
    'completed': 3,
    'spam': 4
  };
  return priorities[contact.status] || 999;
};