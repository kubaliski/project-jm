import { createAsyncThunk } from '@reduxjs/toolkit';
import { adminBlacklistService } from '@services/api';

export const fetchBlockedIps = createAsyncThunk(
  'admin/blacklist/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const response = await adminBlacklistService.getAll();
      return response.data;
    } catch (error) {
      console.error('Fetch Blocked IPs Error:', error);
      return rejectWithValue(error.response?.data || 'Error loading blocked IPs');
    }
  }
);

export const blockIp = createAsyncThunk(
  'admin/blacklist/block',
  async (ip, { rejectWithValue, dispatch }) => {
    try {
      const response = await adminBlacklistService.blockIp(ip);
      // After blocking, refresh the list
      dispatch(fetchBlockedIps());
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Error blocking IP');
    }
  }
);

export const unblockIp = createAsyncThunk(
  'admin/blacklist/unblock',
  async (ip, { rejectWithValue }) => {
    try {
      await adminBlacklistService.unblockIp(ip);
      return ip; // Return the IP to remove it from the state
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Error unblocking IP');
    }
  }
);

export const fetchBlacklistStats = createAsyncThunk(
    'admin/blacklist/fetchStats',
    async (_, { rejectWithValue }) => {
        try {
            const response = await adminBlacklistService.getStats();
            return response.data;
        } catch (error) {
            console.error('Fetch Blacklist Stats Error:', error);
            return rejectWithValue(error.response?.data || 'Error loading blacklist statistics');
        }
    }
);