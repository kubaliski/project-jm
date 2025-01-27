// src/store/admin/thunks/configThunks.js
import { createAsyncThunk } from '@reduxjs/toolkit';
import { configService } from '@services/api/protected/config.service';

export const fetchEditorConfig = createAsyncThunk(
    'admin/config/fetchEditor',
    async (_, { rejectWithValue }) => {
        try {
            const response = await configService.getEditorConfig();
            if (!response?.tinymceApiKey) {
                return rejectWithValue('No se encontró la API key del editor');
            }
            return response;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message ||
                'Error al cargar la configuración del editor'
            );
        }
    }
);