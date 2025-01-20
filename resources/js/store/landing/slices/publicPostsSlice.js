// src/store/landing/slices/publicPostsSlice.js
import { createSlice } from '@reduxjs/toolkit';
import { fetchPublicPosts, fetchRecentPosts, fetchPostBySlug } from '../thunks/publicPostsThunks';

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos en milisegundos

const initialState = {
  // Posts data
  items: [],
  recentPosts: [],
  currentPost: null,

  // UI states
  loading: {
    items: false,
    recentPosts: false,
    currentPost: false
  },
  error: {
    items: null,
    recentPosts: null,
    currentPost: null
  },

  // Pagination
  pagination: {
    currentPage: 1,
    itemsPerPage: 9,
    total: 0
  },

  // Cache
  cache: {
    timestamp: null,
    bySlug: {},
    lastFetch: null
  }
};

const publicPostsSlice = createSlice({
  name: 'landing/publicPosts',
  initialState,
  reducers: {
    // Pagination actions
    setCurrentPage: (state, action) => {
      state.pagination.currentPage = action.payload;
    },

    // Cache actions
    invalidateCache: (state) => {
      state.cache.timestamp = null;
      state.cache.lastFetch = null;
      state.cache.bySlug = {};
    },

    // Reset action
    resetState: () => initialState
  },
  extraReducers: (builder) => {
    // Fetch todos los posts
    builder
      .addCase(fetchPublicPosts.pending, (state) => {
        state.loading.items = true;
        state.error.items = null;
      })
      .addCase(fetchPublicPosts.fulfilled, (state, action) => {
        state.loading.items = false;
        if (action.payload) {
          state.items = action.payload.data;
          state.cache.lastFetch = action.payload.timestamp;
          state.pagination.total = action.payload.data.length;
        }
      })
      .addCase(fetchPublicPosts.rejected, (state, action) => {
        state.loading.items = false;
        state.error.items = action.payload;
        state.items = [];
      })

      // Fetch posts recientes
      .addCase(fetchRecentPosts.pending, (state) => {
        state.loading.recentPosts = true;
        state.error.recentPosts = null;
      })
      .addCase(fetchRecentPosts.fulfilled, (state, action) => {
        state.loading.recentPosts = false;
        if (action.payload) {
          state.recentPosts = action.payload.data;
          state.cache.timestamp = action.payload.timestamp;
        }
      })
      .addCase(fetchRecentPosts.rejected, (state, action) => {
        state.loading.recentPosts = false;
        state.error.recentPosts = action.payload;
        state.recentPosts = [];
      })

      // Fetch post por slug
      .addCase(fetchPostBySlug.pending, (state) => {
        state.loading.currentPost = true;
        state.error.currentPost = null;
        state.currentPost = null;
      })
      .addCase(fetchPostBySlug.fulfilled, (state, action) => {
        state.loading.currentPost = false;
        if (action.payload) {
          state.currentPost = action.payload.data;
          // Actualizar caché por slug
          state.cache.bySlug[action.payload.slug] = {
            data: action.payload.data,
            timestamp: action.payload.timestamp
          };
        }
      })
      .addCase(fetchPostBySlug.rejected, (state, action) => {
        state.loading.currentPost = false;
        state.error.currentPost = action.payload;
        state.currentPost = null;
        // Limpiar caché para este slug en caso de error
        if (action.meta?.arg) {
          delete state.cache.bySlug[action.meta.arg];
        }
      });
  }
});

export const {
  setCurrentPage,
  invalidateCache,
  resetState
} = publicPostsSlice.actions;

export default publicPostsSlice.reducer;