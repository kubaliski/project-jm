// src/store/auth/thunks/authThunks.js
import { createAsyncThunk } from '@reduxjs/toolkit';
import { authService, usersService } from '@services/api';

export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await authService.login(credentials);
      const { data } = response;

      // Guardar token en localStorage
      localStorage.setItem('token', data.token);

      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Error en el login' });
    }
  }
);

export const getCurrentUser = createAsyncThunk(
  'auth/getCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      const response = await authService.getCurrentUser();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await authService.logout();
      localStorage.removeItem('token');
      return true;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const updateProfile = createAsyncThunk(
  'auth/updateProfile',
  async (formData, { rejectWithValue, dispatch }) => {
    try {
      const response = await usersService.updateProfile(formData);

      // Disparar una acción para actualizar el usuario en la lista de usuarios si existe
      if (response.data.user) {
        dispatch({
          type: 'admin/users/updateUserInList',
          payload: response.data.user
        });
      }

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.errors ||
        error.response?.data ||
        'Error al actualizar el perfil'
      );
    }
  }
);