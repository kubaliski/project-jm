import { createSlice } from '@reduxjs/toolkit';
import { updateAppInfo } from '../thunks/appInfoThunks';
import { fetchAppInfo } from '../../landing/thunks/publicAppInfoThunks';

const initialState = {
  data: null,
  loading: false,
  error: null,
  editModal: {
    isOpen: false
  }
};

const appInfoSlice = createSlice({
  name: 'admin/appInfo',
  initialState,
  reducers: {
    setEditModalState: (state, action) => {
      state.editModal = {
        ...state.editModal,
        ...action.payload
      };
    },
    resetState: () => initialState
  },
  extraReducers: (builder) => {
    builder
      // Fetch app info
      .addCase(fetchAppInfo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAppInfo.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.error = null;
      })
      .addCase(fetchAppInfo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update app info
      .addCase(updateAppInfo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAppInfo.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload.app_info;
        state.editModal.isOpen = false;
        state.error = null;
      })
      .addCase(updateAppInfo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const {
  setEditModalState,
  resetState
} = appInfoSlice.actions;

export default appInfoSlice.reducer;