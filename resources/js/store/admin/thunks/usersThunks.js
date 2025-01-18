// src/store/admin/thunks/usersThunks.js
import { createAsyncThunk } from '@reduxjs/toolkit';
import { usersService } from '@services/api';

export const fetchUsers = createAsyncThunk(
  'admin/users/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const response = await usersService.getAll();
      return response.data;
    } catch (error) {
      console.error('Fetch Users Error:', error);
      return rejectWithValue(error.response?.data || 'Error al cargar los usuarios');
    }
  }
);

export const createUser = createAsyncThunk(
  'admin/users/create',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await usersService.create(formData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Error al crear el usuario');
    }
  }
);

export const updateUser = createAsyncThunk(
  'admin/users/update',
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const response = await usersService.update(id, formData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Error al actualizar el usuario');
    }
  }
);

export const deleteUser = createAsyncThunk(
  'admin/users/delete',
  async (id, { rejectWithValue }) => {
    try {
      await usersService.delete(id);
      return id; // Retornamos el ID para removerlo del state
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Error al eliminar el usuario');
    }
  }
);

export const assignUserRoles = createAsyncThunk(
  'admin/users/assignRoles',
  async ({ id, roles }, { rejectWithValue }) => {
    try {
      const response = await usersService.assignRoles(id, roles);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Error al asignar roles al usuario');
    }
  }
);