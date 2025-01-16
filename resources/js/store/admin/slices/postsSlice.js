// src/store/admin/slices/postsSlice.js
import { createSlice } from '@reduxjs/toolkit';
import {
  fetchPosts,
  createPost,
  updatePost,
  deletePost,
  countPosts
} from '../thunks/postsThunks';

const initialState = {
  items: [],
  stats: {
    total_posts: 0,
    loading: false,
    error: null
  },
  selectedPost: null,
  loading: false,
  error: null,
  filters: {
    search: '',
    status: '',
    dateRange: null
  },
  sort: {
    field: 'created_at',
    direction: 'desc'
  },
  pagination: {
    currentPage: 1,
    itemsPerPage: 10,
    total: 0
  },
  // Separar los estados de los modales
  editModal: {
    isOpen: false,
    mode: null, // 'create' | 'edit'
  },
  deleteModal: {
    isOpen: false
  }
};

const postsSlice = createSlice({
  name: 'admin/posts',
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = action.payload;
      state.pagination.currentPage = 1;
    },
    setSortConfig: (state, action) => {
      state.sort = action.payload;
    },
    setCurrentPage: (state, action) => {
      state.pagination.currentPage = action.payload;
    },
    setSelectedPost: (state, action) => {
      state.selectedPost = action.payload;
    },
    // Separar las acciones para cada modal
    setEditModalState: (state, action) => {
      state.editModal = {
        ...state.editModal,
        ...action.payload
      };
    },
    setDeleteModalState: (state, action) => {
      state.deleteModal = {
        ...state.deleteModal,
        ...action.payload
      };
    },
    resetState: () => initialState
  },
  extraReducers: (builder) => {
    builder
      // Fetch posts
      .addCase(fetchPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
        state.error = null;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create post
      .addCase(createPost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.loading = false;
        state.items.unshift(action.payload);
        state.editModal.isOpen = false;  // Actualizado para usar editModal
        state.editModal.mode = null;     // Limpiar el modo
        state.error = null;
      })
      .addCase(createPost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update post
      .addCase(updatePost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePost.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.items.findIndex(item => item.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
        state.editModal.isOpen = false;  // Actualizado para usar editModal
        state.editModal.mode = null;     // Limpiar el modo
        state.error = null;
      })
      .addCase(updatePost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete post
      .addCase(deletePost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter(item => item.id !== action.payload);
        state.deleteModal.isOpen = false;  // Actualizado para usar deleteModal
        state.error = null;
      })
      .addCase(deletePost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Count posts
      .addCase(countPosts.pending, (state) => {
        state.stats.loading = true;
        state.stats.error = null;
      })
      .addCase(countPosts.fulfilled, (state, action) => {
        state.stats.loading = false;
        state.stats.total_posts = action.payload.total_posts;
        state.stats.error = null;
      })
      .addCase(countPosts.rejected, (state, action) => {
        state.stats.loading = false;
        state.stats.error = action.payload;
      });
  }
});

export const {
  setFilters,
  setSortConfig,
  setCurrentPage,
  setSelectedPost,
  setEditModalState,
  setDeleteModalState,
  resetState
} = postsSlice.actions;

export default postsSlice.reducer;