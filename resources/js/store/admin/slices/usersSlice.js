// src/store/admin/slices/usersSlice.js
import { createSlice } from '@reduxjs/toolkit';
import {
  fetchUsers,
  createUser,
  updateUser,
  deleteUser,
  assignUserRoles
} from '../thunks/usersThunks';

const initialState = {
  items: [],
  selectedUser: null,
  loading: false,
  error: null,
  filters: {
    search: '',
    role: '',
  },
  sort: {
    field: 'name',
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
  },
  rolesModal: {
    isOpen: false,
  }
};

const usersSlice = createSlice({
  name: 'admin/users',
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
    setSelectedUser: (state, action) => {
      state.selectedUser = action.payload;
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
    setRolesModalState: (state, action) => {
      state.rolesModal = {
        ...state.rolesModal,
        ...action.payload
      };
    },
    resetState: () => initialState
  },
  extraReducers: (builder) => {
    builder
      // Fetch users
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
        state.error = null;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create user
      .addCase(createUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.loading = false;
        state.items = [action.payload.user, ...state.items];
        state.editModal.isOpen = false;
        state.editModal.mode = null;
        state.selectedUser = null;
        state.error = null;
      })
      .addCase(createUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update user
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.map(item =>
          item.id === action.payload.user.id ? action.payload.user : item
        );
        state.editModal.isOpen = false;
        state.editModal.mode = null;
        state.selectedUser = null;
        state.error = null;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete user
      .addCase(deleteUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter(item => item.id !== action.payload);
        state.deleteModal.isOpen = false;
        state.error = null;
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Assign roles
      .addCase(assignUserRoles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(assignUserRoles.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.map(item =>
          item.id === action.payload.user.id ? action.payload.user : item
        );
        state.rolesModal.isOpen = false;
        state.error = null;
      })
      .addCase(assignUserRoles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const {
  setFilters,
  setSortConfig,
  setCurrentPage,
  setSelectedUser,
  setEditModalState,
  setDeleteModalState,
  setRolesModalState,
  resetState
} = usersSlice.actions;

export default usersSlice.reducer;