// src/store/landing/selectors/publicPostsSelectors.js
import { createSelector } from '@reduxjs/toolkit';

// Selectores Base
export const selectPublicPosts = (state) => state.landing.publicPosts.items;
export const selectRecentPosts = (state) => state.landing.publicPosts.recentPosts;
export const selectCurrentPost = (state) => state.landing.publicPosts.currentPost;
export const selectPublicPostsCache = (state) => state.landing.publicPosts.cache;

// Selectores de UI
export const selectPublicPostsLoading = (state) => state.landing.publicPosts.loading;
export const selectPublicPostsError = (state) => state.landing.publicPosts.error;
export const selectPagination = (state) => state.landing.publicPosts.pagination;

// Selector para verificar si el caché es válido
export const selectIsCacheValid = createSelector(
  [selectPublicPostsCache],
  (cache) => {
    if (!cache.lastFetch) return false;
    const now = Date.now();
    const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos
    return now - cache.lastFetch < CACHE_DURATION;
  }
);

// Selector para posts paginados
export const selectPaginatedPosts = createSelector(
  [selectPublicPosts, selectPagination],
  (posts, pagination) => {
    const { currentPage, itemsPerPage } = pagination;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return posts.slice(startIndex, endIndex);
  }
);

// Selector para total de páginas
export const selectTotalPages = createSelector(
  [selectPublicPosts, selectPagination],
  (posts, pagination) => Math.ceil(posts.length / pagination.itemsPerPage)
);

// Selector para obtener un post por slug desde el caché
export const selectPostBySlug = createSelector(
  [selectPublicPostsCache, (_, slug) => slug],
  (cache, slug) => cache.bySlug[slug]?.data || null
);

// Selector para verificar si un post específico está en caché y es válido
export const selectIsPostCached = createSelector(
  [selectPublicPostsCache, (_, slug) => slug],
  (cache, slug) => {
    if (!cache.bySlug[slug]) return false;
    const now = Date.now();
    const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos
    return now - cache.bySlug[slug].timestamp < CACHE_DURATION;
  }
);

// Selector para estados de loading específicos
export const selectSpecificLoadingState = createSelector(
  [selectPublicPostsLoading, (_, type) => type],
  (loading, type) => loading[type]
);

// Selector para estados de error específicos
export const selectSpecificErrorState = createSelector(
  [selectPublicPostsError, (_, type) => type],
  (error, type) => error[type]
);

// Selector para ordenar posts por fecha (más recientes primero)
export const selectSortedPosts = createSelector(
  [selectPublicPosts],
  (posts) => [...posts].sort((a, b) =>
    new Date(b.published_at) - new Date(a.published_at)
  )
);

// Selector para obtener metadata de paginación
export const selectPaginationMetadata = createSelector(
  [selectPagination, selectTotalPages, selectPublicPosts],
  (pagination, totalPages, posts) => ({
    currentPage: pagination.currentPage,
    itemsPerPage: pagination.itemsPerPage,
    totalPages,
    totalItems: posts.length,
    startIndex: (pagination.currentPage - 1) * pagination.itemsPerPage + 1,
    endIndex: Math.min(
      pagination.currentPage * pagination.itemsPerPage,
      posts.length
    )
  })
);