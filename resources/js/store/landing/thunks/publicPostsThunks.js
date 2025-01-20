// src/store/landing/thunks/publicPostsThunks.js
import { createAsyncThunk } from '@reduxjs/toolkit';
import { publicPostsService } from '@services/api';

// Función auxiliar para verificar si el caché es válido
const isCacheValid = (cache, duration = 5 * 60 * 1000) => {
  if (!cache.lastFetch) return false;
  const now = Date.now();
  return now - cache.lastFetch < duration;
};

export const fetchPublicPosts = createAsyncThunk(
  'landing/publicPosts/fetchAll',
  async (_, { getState, rejectWithValue }) => {
    try {
      // Verificar caché
      const { cache } = getState().landing.publicPosts;
      if (isCacheValid(cache)) {
        return null; // No necesitamos recargar
      }

      const response = await publicPostsService.getAll();
      return {
        data: response.data.posts,
        timestamp: Date.now()
      };
    } catch (error) {
      console.error('Error fetching public posts:', error);
      return rejectWithValue(error.response?.data || 'Error al cargar los posts');
    }
  },
  {
    condition: (_, { getState }) => {
      const { loading } = getState().landing.publicPosts;
      // Evitar múltiples solicitudes simultáneas
      if (loading.items) return false;
    }
  }
);

export const fetchRecentPosts = createAsyncThunk(
  'landing/publicPosts/fetchRecent',
  async (_, { getState, rejectWithValue }) => {
    try {
      // Verificar caché para posts recientes
      const { cache } = getState().landing.publicPosts;
      if (isCacheValid(cache)) {
        return null;
      }

      const response = await publicPostsService.getRecentPosts();
      return {
        data: response.data.posts,
        timestamp: Date.now()
      };
    } catch (error) {
      console.error('Error fetching recent posts:', error);
      return rejectWithValue(error.response?.data || 'Error al cargar los posts recientes');
    }
  },
  {
    condition: (_, { getState }) => {
      const { loading } = getState().landing.publicPosts;
      if (loading.recentPosts) return false;
    }
  }
);

export const fetchPostBySlug = createAsyncThunk(
  'landing/publicPosts/fetchBySlug',
  async (slug, { getState, rejectWithValue }) => {
    try {
      // Verificar caché para post específico
      const { cache } = getState().landing.publicPosts;
      if (cache.bySlug[slug] && isCacheValid(cache)) {
        return null;
      }

      const response = await publicPostsService.getBySlug(slug);
      return {
        data: response.data.post,
        slug,
        timestamp: Date.now()
      };
    } catch (error) {
      console.error('Error fetching post by slug:', error);
      return rejectWithValue(error.response?.data || 'Error al cargar el post');
    }
  },
  {
    condition: (_, { getState }) => {
      const { loading } = getState().landing.publicPosts;
      if (loading.currentPost) return false;
    }
  }
);