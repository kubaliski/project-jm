// src/store/admin/thunks/postsThunks.js
import { createAsyncThunk } from '@reduxjs/toolkit';
import { adminPostsService } from '@services/api';

export const fetchPosts = createAsyncThunk(
  'admin/posts/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const response = await adminPostsService.getAll();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Error al cargar los posts');
    }
  }
);

export const createPost = createAsyncThunk(
  'admin/posts/create',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await adminPostsService.create(formData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Error al crear el post');
    }
  }
);

export const updatePost = createAsyncThunk(
  'admin/posts/update',
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      formData.append('_method', 'PUT');
      const response = await adminPostsService.update(id, formData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Error al actualizar el post');
    }
  }
);

export const deletePost = createAsyncThunk(
  'admin/posts/delete',
  async (id, { rejectWithValue }) => {
    try {
      await adminPostsService.delete(id);
      return id; // Retornamos el ID para removerlo del state
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Error al eliminar el post');
    }
  }


);

export const countPosts = createAsyncThunk(
    'admin/posts/count',
    async (_, { rejectWithValue }) => {
        try {
        const response = await adminPostsService.count();
        return response.data;
        } catch (error) {
        return rejectWithValue(error.response?.data || 'Error al obtener la cantidad de posts');
        }
    }
);