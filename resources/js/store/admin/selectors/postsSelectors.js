// src/store/admin/selectors/postsSelectors.js
import { createSelector } from '@reduxjs/toolkit';
import { isFutureDate } from '@utils/dateUtils';

// Selectores base
const selectPosts = (state) => state.admin.posts.items;
export const selectPostsLoading = (state) => state.admin.posts.loading;
export const selectPostsError = (state) => state.admin.posts.error;
export const selectPostsFilters = (state) => state.admin.posts.filters;
export const selectPostsSortConfig = (state) => state.admin.posts.sort;
export const selectPostsPagination = (state) => state.admin.posts.pagination;
export const selectSelectedPost = (state) => state.admin.posts.selectedPost;
export const selectEditModalState = (state) => state.admin.posts.editModal;
export const selectDeleteModalState = (state) => state.admin.posts.deleteModal;
// Selectores para estadísticas
export const selectPostsStats = (state) => state.admin.posts.stats;
export const selectTotalPosts = (state) => state.admin.posts.stats.total_posts;
export const selectStatsLoading = (state) => state.admin.posts.stats.loading;
export const selectStatsError = (state) => state.admin.posts.stats.error;

// Selector para filtrar y ordenar posts
export const selectFilteredAndSortedPosts = createSelector(
  [selectPosts, selectPostsFilters, selectPostsSortConfig],
  (posts, filters, sortConfig) => {
    let result = [...posts];

    // Aplicar filtros
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(post =>
        post.title.toLowerCase().includes(searchLower) ||
        post.excerpt?.toLowerCase().includes(searchLower)
      );
    }

    if (filters.status) {
      result = result.filter(post => {
        switch (filters.status) {
          case 'published':
            return post.is_published;
          case 'draft':
            return !post.is_published && (!post.published_at || !isFutureDate(post.published_at));
          case 'scheduled':
            return !post.is_published && post.published_at && isFutureDate(post.published_at);
          default:
            return true;
        }
      });
    }

    if (filters.dateRange) {
      const { startDate, endDate } = filters.dateRange;
      result = result.filter(post => {
        const postDate = new Date(post.created_at);
        return (!startDate || postDate >= new Date(startDate)) &&
               (!endDate || postDate <= new Date(endDate));
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

        if (sortConfig.direction === 'desc') {
          [aValue, bValue] = [bValue, aValue];
        }

        return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
      });
    }

    return result;
  }
);

// Selector para posts paginados
export const selectPaginatedPosts = createSelector(
  [selectFilteredAndSortedPosts, selectPostsPagination],
  (posts, pagination) => {
    const { currentPage, itemsPerPage } = pagination;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    return posts.slice(startIndex, endIndex);
  }
);

// Función auxiliar para ordenar por estado
const getStatusPriority = (post) => {
  if (post.is_published) return 1;
  if (post.published_at && isFutureDate(post.published_at)) return 2;
  return 3;
};