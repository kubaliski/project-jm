import { createSlice } from '@reduxjs/toolkit';
import {
  loginUser,
  getCurrentUser,
  logoutUser,
  updateProfile,
  forgotPassword,
  resetPassword
} from '../thunks/authThunks';

const initialState = {
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: false,
  roles: [],
  permissions: [],
  loading: false,
  error: null,
  profile: {
    loading: false,
    error: null
  },
  passwordReset: {
    loading: false,
    error: null,
    success: false,
    message: null
  }
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearProfileError: (state) => {
      state.profile.error = null;
    },
    clearPasswordResetStatus: (state) => {
      state.passwordReset = {
        loading: false,
        error: null,
        success: false,
        message: null
      };
    }
  },
  extraReducers: (builder) => {
    builder
      // Login cases...
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
      // Get Current User cases...
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
      // Logout cases...
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.roles = [];
        state.permissions = [];
        localStorage.removeItem('token');
      })
      // Update Profile cases...
      .addCase(updateProfile.pending, (state) => {
        state.profile.loading = true;
        state.profile.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.profile.loading = false;
        state.profile.error = null;
        state.user = {
          ...action.payload.user,
          roles: state.roles
        };
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.profile.loading = false;
        state.profile.error = action.payload;
      })
      // Forgot Password cases...
      .addCase(forgotPassword.pending, (state) => {
        state.passwordReset.loading = true;
        state.passwordReset.error = null;
        state.passwordReset.success = false;
        state.passwordReset.message = null;
      })
      .addCase(forgotPassword.fulfilled, (state, action) => {
        state.passwordReset.loading = false;
        state.passwordReset.success = true;
        state.passwordReset.message = action.payload.message;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.passwordReset.loading = false;
        state.passwordReset.error = action.payload;
      })
      // Reset Password cases...
      .addCase(resetPassword.pending, (state) => {
        state.passwordReset.loading = true;
        state.passwordReset.error = null;
        state.passwordReset.success = false;
        state.passwordReset.message = null;
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.passwordReset.loading = false;
        state.passwordReset.success = true;
        state.passwordReset.message = action.payload.message;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.passwordReset.loading = false;
        state.passwordReset.error = action.payload;
      });
  }
});

export const { clearError, clearProfileError, clearPasswordResetStatus } = authSlice.actions;
export default authSlice.reducer;