// src/store/auth/slice/authSlice.js
import { createSlice } from '@reduxjs/toolkit';
import { loginUser, getCurrentUser, logoutUser } from '../thunks/authThunks';

const initialState = {
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: false,
  roles: [],
  permissions: [],
  loading: false,
  error: null
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.roles = action.payload.user.roles;
        state.permissions = action.payload.permissions;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Error en el login';
      })
      // Get Current User
      .addCase(getCurrentUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.roles = action.payload.user.roles;
        state.permissions = action.payload.permissions;
      })
      .addCase(getCurrentUser.rejected, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.roles = [];
        state.permissions = [];
        localStorage.removeItem('token');
      })
      // Logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.roles = [];
        state.permissions = [];
        localStorage.removeItem('token');
      });
  }
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;