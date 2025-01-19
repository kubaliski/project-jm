// src/store/admin/slices/rolesSlice.js
import { createSlice } from '@reduxjs/toolkit';
import {
  fetchRoles,
  createRole,
  updateRole,
  deleteRole,
  updateRolePermissions,
  fetchAllPermissions
} from '../thunks/rolesThunks';

const initialState = {
  items: [],
  permissions: {}, // Para almacenar los permisos agrupados
  selectedRole: null,
  loading: false,
  error: null,
  filters: {
    search: '',
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
  permissionsModal: {
    isOpen: false,
  }
};

const rolesSlice = createSlice({
  name: 'admin/roles',
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
    setSelectedRole: (state, action) => {
      state.selectedRole = action.payload;
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
    setPermissionsModalState: (state, action) => {
      state.permissionsModal = {
        ...state.permissionsModal,
        ...action.payload
      };
    },
    resetState: () => initialState
  },
  extraReducers: (builder) => {
    builder
      // Fetch roles
      .addCase(fetchRoles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRoles.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
        state.error = null;
      })
      .addCase(fetchRoles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch permissions
      .addCase(fetchAllPermissions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllPermissions.fulfilled, (state, action) => {
        state.loading = false;
        state.permissions = action.payload;
        state.error = null;
      })
      .addCase(fetchAllPermissions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create role
      .addCase(createRole.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createRole.fulfilled, (state, action) => {
        state.loading = false;
        state.items = [action.payload.role, ...state.items];
        state.editModal.isOpen = false;
        state.editModal.mode = null;
        state.selectedRole = null;
        state.error = null;
      })
      .addCase(createRole.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update role
      .addCase(updateRole.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateRole.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.map(item =>
          item.id === action.payload.role.id ? action.payload.role : item
        );
        state.editModal.isOpen = false;
        state.editModal.mode = null;
        state.selectedRole = null;
        state.error = null;
      })
      .addCase(updateRole.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete role
      .addCase(deleteRole.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteRole.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter(item => item.id !== action.payload);
        state.deleteModal.isOpen = false;
        state.error = null;
      })
      .addCase(deleteRole.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update permissions
      .addCase(updateRolePermissions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateRolePermissions.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.map(item =>
          item.id === action.payload.role.id ? action.payload.role : item
        );
        state.permissionsModal.isOpen = false;
        state.error = null;
      })
      .addCase(updateRolePermissions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const {
  setFilters,
  setSortConfig,
  setCurrentPage,
  setSelectedRole,
  setEditModalState,
  setDeleteModalState,
  setPermissionsModalState,
  resetState
} = rolesSlice.actions;

export default rolesSlice.reducer;