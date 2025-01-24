import { createAsyncThunk } from '@reduxjs/toolkit';
import { adminAppInfoService } from '@services/api';

export const updateAppInfo = createAsyncThunk(
    'admin/appInfo/update',
    async ({ id, formData }, { rejectWithValue }) => {
        try {
            const response = await adminAppInfoService.update(id, formData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Error al actualizar la información');
        }
    }
);