// src/store/admin/slices/configSlice.js
import { createSlice } from '@reduxjs/toolkit';
import { fetchEditorConfig } from '../thunks/configThunks';

const initialState = {
    editor: {
        apiKey: null,
    },
    loading: false,
    error: null
};

const configSlice = createSlice({
    name: 'admin/config',
    initialState,
    reducers: {
        resetState: () => initialState
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchEditorConfig.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchEditorConfig.fulfilled, (state, action) => {
                state.loading = false;
                state.editor.apiKey = action.payload.tinymceApiKey;
                state.error = null;
            })
            .addCase(fetchEditorConfig.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Error desconocido';
                state.editor.apiKey = null;
            });
    }
});

export const { resetState } = configSlice.actions;
export default configSlice.reducer;