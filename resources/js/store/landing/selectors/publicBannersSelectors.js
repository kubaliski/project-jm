// src/store/landing/selectors/publicBannersSelectors.js
import { createSelector } from '@reduxjs/toolkit';

// Selectores Base
export const selectActiveBanner = (state) => state.landing.publicBanners.activeBanner;
export const selectPublicBannersCache = (state) => state.landing.publicBanners.cache;

// Selectores de UI
export const selectPublicBannersLoading = (state) => state.landing.publicBanners.loading;
export const selectPublicBannersError = (state) => state.landing.publicBanners.error;
export const selectBannerHidden = (state) => state.landing.publicBanners.isHidden;

// Selector para verificar si el caché es válido
export const selectIsCacheValid = createSelector(
  [selectPublicBannersCache],
  (cache) => {
    if (!cache.lastFetch) return false;
    const now = Date.now();
    const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos
    return now - cache.lastFetch < CACHE_DURATION;
  }
);

// Selector para verificar si hay un banner activo y válido
export const selectHasActiveBanner = createSelector(
  [selectActiveBanner],
  (banner) => {
    if (!banner) return false;

    // Verificar si el banner está activo y dentro del rango de fechas
    const now = new Date();
    const startDate = banner.start_date ? new Date(banner.start_date) : null;
    const endDate = banner.end_date ? new Date(banner.end_date) : null;

    return banner.is_active &&
           (!startDate || startDate <= now) &&
           (!endDate || endDate >= now);
  }
);