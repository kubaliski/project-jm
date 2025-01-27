import { createSelector } from '@reduxjs/toolkit';

// Base selectors
export const selectBlockedIps = (state) => state.admin.blacklist.items;
export const selectBlacklistLoading = (state) => state.admin.blacklist.loading;
export const selectBlacklistError = (state) => state.admin.blacklist.error;
export const selectBlacklistFilters = (state) => state.admin.blacklist.filters;
export const selectBlacklistSortConfig = (state) => state.admin.blacklist.sort;
export const selectBlacklistPagination = (state) => state.admin.blacklist.pagination;
export const selectBlockModalState = (state) => state.admin.blacklist.blockModal;

// Stats selectors
export const selectBlacklistStats = (state) => state.admin.blacklist.stats;
export const selectBlacklistStatsLoading = (state) => state.admin.blacklist.stats.loading;
export const selectBlacklistStatsError = (state) => state.admin.blacklist.stats.error;

// Filtered and sorted IPs selector
export const selectFilteredAndSortedBlockedIps = createSelector(
    [selectBlockedIps, selectBlacklistFilters, selectBlacklistSortConfig],
    (blockedIps, filters, sortConfig) => {
        let result = [...blockedIps];

        // Apply filters
        if (filters.search) {
            const searchLower = filters.search.toLowerCase();
            result = result.filter(item =>
                item.ip.toLowerCase().includes(searchLower)
            );
        }

        // Date range filter
        if (filters.dateRange && filters.dateRange !== 'all') {
            const dateRange = getDateRange(filters.dateRange);
            if (dateRange) {
                result = result.filter(item => {
                    const blockDate = new Date(item.blocked_at);
                    return blockDate >= dateRange.start && blockDate <= dateRange.end;
                });
            }
        }

        // Apply sorting
        if (sortConfig.field) {
            result.sort((a, b) => {
                let aValue = a[sortConfig.field];
                let bValue = b[sortConfig.field];

                if (sortConfig.field.includes('_at')) {
                    aValue = new Date(aValue).getTime();
                    bValue = new Date(bValue).getTime();
                }

                const comparison = aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
                return sortConfig.direction === 'desc' ? -comparison : comparison;
            });
        }

        return result;
    }
);

// Paginated IPs selector
export const selectPaginatedBlockedIps = createSelector(
    [selectFilteredAndSortedBlockedIps, selectBlacklistPagination],
    (blockedIps, pagination) => {
        const { currentPage, itemsPerPage } = pagination;
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return blockedIps.slice(startIndex, endIndex);
    }
);

// Helper function for date range
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
            start.setDate(now.getDate() - now.getDay());
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