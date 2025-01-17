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
export const selectContactsStats = (state) => state.admin.contacts.stats;
export const selectTotalContacts = (state) => state.admin.contacts.stats.total_contacts;
export const selectStatsLoading = (state) => state.admin.contacts.stats.loading;

const getDateRange = (rangeType) => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    switch (rangeType) {
        case 'today': {
            const start = new Date(now);
            const end = new Date(now);
            end.setHours(23, 59, 59, 999);
            return { start, end };
        }
        case 'week': {
            const start = new Date(now);
            start.setDate(now.getDate() - now.getDay()); // Inicio de semana (Domingo)
            const end = new Date(start);
            end.setDate(start.getDate() + 6);
            end.setHours(23, 59, 59, 999);
            return { start, end };
        }
        case 'month': {
            const start = new Date(now.getFullYear(), now.getMonth(), 1);
            const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
            end.setHours(23, 59, 59, 999);
            return { start, end };
        }
        default:
            return null;
    }
};

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

        if (filters.status && filters.status !== 'all') {
            result = result.filter(contact => contact.status === filters.status);
        }

        // Filtro de fechas
        if (filters.dateRange && filters.dateRange !== 'all') {
            const dateRange = getDateRange(filters.dateRange);
            if (dateRange) {
                result = result.filter(contact => {
                    const contactDate = new Date(contact.created_at);
                    return contactDate >= dateRange.start && contactDate <= dateRange.end;
                });
            }
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
                } else if (sortConfig.field === 'created_at') {
                    aValue = new Date(aValue).getTime();
                    bValue = new Date(bValue).getTime();
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