import { createAsyncThunk } from '@reduxjs/toolkit';
import { publicAppInfoService } from '@services/api';

export const fetchAppInfo = createAsyncThunk(
    'landing/appInfo/fetch',
    async (_, { rejectWithValue }) => {
        try {
            const response = await publicAppInfoService.get();
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Error al obtener la información');
        }
    }
);