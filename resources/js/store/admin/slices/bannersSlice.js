import { createSlice } from '@reduxjs/toolkit';
import {
  fetchBanners,
  createBanner,
  updateBanner,
  deleteBanner,
  updateBannerPriority
} from '../thunks/bannersThunks';

const initialState = {
  items: [],
  selectedBanner: null,
  loading: false,
  error: null,
  filters: {
    search: '',
    status: '', // active/inactive
    dateRange: null
  },
  sort: {
    field: 'priority',
    direction: 'asc'
  },
  pagination: {
    currentPage: 1,
    itemsPerPage: 10,
    total: 0
  },
  editModal: {
    isOpen: false,
    mode: null, // 'create' | 'edit'
  },
  deleteModal: {
    isOpen: false
  }
};

const bannersSlice = createSlice({
  name: 'admin/banners',
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
    setSelectedBanner: (state, action) => {
      state.selectedBanner = action.payload;
    },
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
      // Fetch banners
      .addCase(fetchBanners.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBanners.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
        state.error = null;
      })
      .addCase(fetchBanners.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create banner
      .addCase(createBanner.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBanner.fulfilled, (state, action) => {
        state.loading = false;
        state.items.push(action.payload);
        state.editModal.isOpen = false;
        state.editModal.mode = null;
        state.error = null;
      })
      .addCase(createBanner.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update banner
      .addCase(updateBanner.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateBanner.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.items.findIndex(item => item.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
        state.editModal.isOpen = false;
        state.editModal.mode = null;
        state.error = null;
      })
      .addCase(updateBanner.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete banner
      .addCase(deleteBanner.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteBanner.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter(item => item.id !== action.payload);
        state.deleteModal.isOpen = false;
        state.error = null;
      })
      .addCase(deleteBanner.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update priority
      .addCase(updateBannerPriority.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateBannerPriority.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.items.findIndex(item => item.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
        state.error = null;
      })
      .addCase(updateBannerPriority.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
  }
});

export const {
  setFilters,
  setSortConfig,
  setCurrentPage,
  setSelectedBanner,
  setEditModalState,
  setDeleteModalState,
  resetState
} = bannersSlice.actions;

export default bannersSlice.reducer;