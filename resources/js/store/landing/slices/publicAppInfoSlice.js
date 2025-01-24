
import { createSlice } from '@reduxjs/toolkit';
import { fetchAppInfo } from '../thunks/publicAppInfoThunks';

const initialState = {
  data: null,
  loading: false,
  error: null
};

const appInfoSlice = createSlice({
  name: 'public/appInfo',
  initialState,
  reducers: {
    resetState: () => initialState
  },
  extraReducers: (builder) => {
    builder
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
      });
  }
});

export const { resetState } = appInfoSlice.actions;

export default appInfoSlice.reducer;