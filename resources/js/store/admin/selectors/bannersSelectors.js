import { createSelector } from '@reduxjs/toolkit';

// Función auxiliar para normalizar fechas (establecer hora a 00:00:00)
const normalizeDate = (dateString) => {
  if (!dateString) return null;
  const date = new Date(dateString);
  date.setHours(0, 0, 0, 0);
  return date;
};

// Función auxiliar para verificar si un banner está activo basado en sus fechas
const isBannerActive = (banner) => {
  const now = new Date();
  now.setHours(0, 0, 0, 0);

  const startDate = normalizeDate(banner.start_date);
  const endDate = normalizeDate(banner.end_date);

  return banner.is_active &&
         (!startDate || startDate <= now) &&
         (!endDate || endDate >= now);
};

// Función auxiliar para verificar si un banner está programado
const isBannerScheduled = (banner) => {
  const now = new Date();
  now.setHours(0, 0, 0, 0);

  const startDate = normalizeDate(banner.start_date);
  return banner.is_active && startDate && startDate > now;
};

// Función auxiliar para verificar si un banner está expirado
const isBannerExpired = (banner) => {
  const now = new Date();
  now.setHours(0, 0, 0, 0);

  const endDate = normalizeDate(banner.end_date);
  return banner.is_active && endDate && endDate < now;
};

// Selectores base
const selectBanners = (state) => state.admin.banners.items;
export const selectBannersLoading = (state) => state.admin.banners.loading;
export const selectBannersError = (state) => state.admin.banners.error;
export const selectBannersFilters = (state) => state.admin.banners.filters;
export const selectBannersSortConfig = (state) => state.admin.banners.sort;
export const selectBannersPagination = (state) => state.admin.banners.pagination;
export const selectSelectedBanner = (state) => state.admin.banners.selectedBanner;
export const selectEditModalState = (state) => state.admin.banners.editModal;
export const selectDeleteModalState = (state) => state.admin.banners.deleteModal;

// Selector para filtrar y ordenar banners
export const selectFilteredAndSortedBanners = createSelector(
  [selectBanners, selectBannersFilters, selectBannersSortConfig],
  (banners, filters, sortConfig) => {
    let result = [...banners];

    // Aplicar filtros
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(banner =>
        banner.text.toLowerCase().includes(searchLower)
      );
    }

    if (filters.status) {
      result = result.filter(banner => {
        switch (filters.status) {
          case 'active':
            return isBannerActive(banner);
          case 'inactive':
            return !banner.is_active;
          case 'scheduled':
            return isBannerScheduled(banner);
          case 'expired':
            return isBannerExpired(banner);
          default:
            return true;
        }
      });
    }

    if (filters.dateRange) {
      const { startDate, endDate } = filters.dateRange;
      result = result.filter(banner => {
        // Si no hay fechas definidas en el banner, lo excluimos
        if (!banner.start_date && !banner.end_date) {
          return false;
        }

        const bannerStartDate = normalizeDate(banner.start_date);
        const bannerEndDate = normalizeDate(banner.end_date);
        const filterStartDate = startDate ? normalizeDate(startDate) : null;
        const filterEndDate = endDate ? normalizeDate(endDate) : null;

        // Si solo tiene fecha de inicio, verificamos que esté antes o en el rango
        if (bannerStartDate && !bannerEndDate) {
          return !filterEndDate || bannerStartDate <= filterEndDate;
        }

        // Si solo tiene fecha de fin, verificamos que esté después o en el rango
        if (!bannerStartDate && bannerEndDate) {
          return !filterStartDate || bannerEndDate >= filterStartDate;
        }

        // Si tiene ambas fechas, verificamos que se solape con el rango
        return (!filterStartDate || bannerEndDate >= filterStartDate) &&
               (!filterEndDate || bannerStartDate <= filterEndDate);
      });
    }

    // Aplicar ordenamiento
    if (sortConfig.field) {
      result.sort((a, b) => {
        let aValue = a[sortConfig.field];
        let bValue = b[sortConfig.field];

        // Manejar casos especiales de ordenamiento
        if (sortConfig.field === 'status') {
          aValue = getBannerStatusPriority(a);
          bValue = getBannerStatusPriority(b);
        }

        // Manejar valores nulos en las fechas
        if (['start_date', 'end_date'].includes(sortConfig.field)) {
          if (!aValue && !bValue) return 0;
          if (!aValue) return 1;
          if (!bValue) return -1;
          // Normalizar fechas para comparación
          aValue = normalizeDate(aValue);
          bValue = normalizeDate(bValue);
        }

        if (sortConfig.direction === 'desc') {
          [aValue, bValue] = [bValue, aValue];
        }

        return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
      });
    }

    return result;
  }
);

// Función auxiliar para ordenar por estado
const getBannerStatusPriority = (banner) => {
  if (!banner.is_active) return 4; // Inactivo
  if (isBannerScheduled(banner)) return 2; // Programado
  if (isBannerExpired(banner)) return 3; // Expirado
  return 1; // Activo
};

// Selector para banners paginados
export const selectPaginatedBanners = createSelector(
  [selectFilteredAndSortedBanners, selectBannersPagination],
  (banners, pagination) => {
    const { currentPage, itemsPerPage } = pagination;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    return banners.slice(startIndex, endIndex);
  }
);

// Selector para banners activos
export const selectActiveBanners = createSelector(
  [selectBanners],
  (banners) => banners.filter(isBannerActive)
);

// Selector para ordenar por prioridad
export const selectBannersByPriority = createSelector(
  [selectBanners],
  (banners) => [...banners].sort((a, b) => b.priority - a.priority)
);