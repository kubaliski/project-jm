// src/store/admin/thunks/rolesThunks.js
import { createAsyncThunk } from '@reduxjs/toolkit';
import { rolesService } from '@services/api';

export const fetchRoles = createAsyncThunk(
  'admin/roles/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const response = await rolesService.getAll();
      return response.data;
    } catch (error) {
      console.error('Fetch Roles Error:', error);
      return rejectWithValue(error.response?.data || 'Error al cargar los roles');
    }
  }
);

export const fetchAllPermissions = createAsyncThunk(
  'admin/roles/fetchPermissions',
  async (_, { rejectWithValue }) => {
    try {
      const response = await rolesService.getAllPermissions();
      return response.data;
    } catch (error) {
      console.error('Fetch Permissions Error:', error);
      return rejectWithValue(error.response?.data || 'Error al cargar los permisos');
    }
  }
);

export const createRole = createAsyncThunk(
  'admin/roles/create',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await rolesService.create(formData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Error al crear el rol');
    }
  }
);

export const updateRole = createAsyncThunk(
  'admin/roles/update',
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const response = await rolesService.update(id, formData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Error al actualizar el rol');
    }
  }
);

export const deleteRole = createAsyncThunk(
  'admin/roles/delete',
  async (id, { rejectWithValue }) => {
    try {
      await rolesService.delete(id);
      return id; // Retornamos el ID para removerlo del state
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Error al eliminar el rol');
    }
  }
);

export const updateRolePermissions = createAsyncThunk(
  'admin/roles/updatePermissions',
  async ({ id, permissions }, { rejectWithValue }) => {
    try {
      const response = await rolesService.updatePermissions(id, permissions);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Error al actualizar los permisos del rol');
    }
  }
);

export const addRolePermissions = createAsyncThunk(
  'admin/roles/addPermissions',
  async ({ id, permissions }, { rejectWithValue }) => {
    try {
      const response = await rolesService.addPermissions(id, permissions);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Error al añadir permisos al rol');
    }
  }
);

export const removeRolePermissions = createAsyncThunk(
  'admin/roles/removePermissions',
  async ({ id, permissions }, { rejectWithValue }) => {
    try {
      const response = await rolesService.removePermissions(id, permissions);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Error al eliminar permisos del rol');
    }
  }
);