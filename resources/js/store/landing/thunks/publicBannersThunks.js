// src/store/landing/thunks/publicBannersThunks.js
import { createAsyncThunk } from '@reduxjs/toolkit';
import { publicBannersService } from '@services/api';

// Función auxiliar para verificar si el caché es válido
const isCacheValid = (cache, duration = 5 * 60 * 1000) => {
  if (!cache.lastFetch) return false;
  const now = Date.now();
  return now - cache.lastFetch < duration;
};

export const fetchActiveBanner = createAsyncThunk(
  'landing/publicBanners/fetchActive',
  async (_, { getState, rejectWithValue }) => {
    try {
      // Verificar caché
      const { cache } = getState().landing.publicBanners;
      if (isCacheValid(cache)) {
        return null; // No necesitamos recargar
      }

      const response = await publicBannersService.getActive();
      return {
        data: response.data,
        timestamp: Date.now()
      };
    } catch (error) {
      console.error('Error fetching active banner:', error);
      return rejectWithValue(error.response?.data || 'Error al cargar el banner');
    }
  },
  {
    condition: (_, { getState }) => {
      const { loading } = getState().landing.publicBanners;
      // Evitar múltiples solicitudes simultáneas
      if (loading) return false;
    }
  }
);
