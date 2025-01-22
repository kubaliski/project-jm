// src/store/landing/slices/publicBannersSlice.js
import { createSlice } from '@reduxjs/toolkit';
import { fetchActiveBanner } from '../thunks/publicBannersThunks';

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos en milisegundos

const initialState = {
  // Banner data
  activeBanner: null,
  isHidden: false,
  // UI states
  loading: false,
  error: null,

  // Cache
  cache: {
    timestamp: null,
    lastFetch: null
  }
};

const publicBannersSlice = createSlice({
  name: 'landing/publicBanners',
  initialState,
  reducers: {
    // Cache actions
    invalidateCache: (state) => {
      state.cache.timestamp = null;
      state.cache.lastFetch = null;
    },
    setBannerHidden: (state, action) => {
        state.isHidden = action.payload;
      },
    // Reset action
    resetState: () => initialState
  },
  extraReducers: (builder) => {
    // Fetch banner activo
    builder
      .addCase(fetchActiveBanner.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchActiveBanner.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.activeBanner = action.payload.data;
          state.cache.lastFetch = action.payload.timestamp;
          state.cache.timestamp = action.payload.timestamp;
        }
      })
      .addCase(fetchActiveBanner.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.activeBanner = null;
      });
  }
});

export const {
  invalidateCache,
  setBannerHidden,
  resetState
} = publicBannersSlice.actions;

export default publicBannersSlice.reducer;