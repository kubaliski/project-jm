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
      // ... resto de los reducers permanecen igual ...
      .addCase(createPost.fulfilled, (state, action) => {
        state.loading = false;
        state.items.unshift(action.payload);
        state.editModal.isOpen = false; // Actualizar referencia correcta
        state.error = null;
      })
      .addCase(updatePost.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.items.findIndex(item => item.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
        state.editModal.isOpen = false; // Actualizar referencia correcta
        state.error = null;
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter(item => item.id !== action.payload);
        state.deleteModal.isOpen = false; // Actualizar referencia correcta
        state.error = null;
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