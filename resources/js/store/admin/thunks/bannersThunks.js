// src/store/admin/thunks/bannersThunks.js
import { createAsyncThunk } from '@reduxjs/toolkit';
import { adminBannersService } from '@services/api/protected/banners.service';

export const fetchBanners = createAsyncThunk(
    'admin/banners/fetch',
    async (_, { rejectWithValue }) => {
        try {
            const response = await adminBannersService.getAll();
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Error al cargar los banners');
        }
    }
);

export const createBanner = createAsyncThunk(
    'admin/banners/create',
    async (data, { rejectWithValue }) => {
        try {
            const response = await adminBannersService.create(data);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Error al crear el banner');
        }
    }
);

export const updateBanner = createAsyncThunk(
    'admin/banners/update',
    async ({ id, data }, { rejectWithValue }) => {
        try {
            const response = await adminBannersService.update(id, data);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Error al actualizar el banner');
        }
    }
);

export const deleteBanner = createAsyncThunk(
    'admin/banners/delete',
    async (id, { rejectWithValue }) => {
        try {
            await adminBannersService.delete(id);
            return id;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Error al eliminar el banner');
        }
    }
);

export const updateBannerPriority = createAsyncThunk(
    'admin/banners/updatePriority',
    async ({ id, priority }, { rejectWithValue }) => {
        try {
            const response = await adminBannersService.updatePriority(id, priority);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Error al actualizar la prioridad');
        }
    }
);