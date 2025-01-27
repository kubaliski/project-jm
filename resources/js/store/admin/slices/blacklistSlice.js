import { createSlice } from '@reduxjs/toolkit';
import {
    fetchBlockedIps,
    blockIp,
    unblockIp,
    fetchBlacklistStats
} from '../thunks/blacklistThunks';

const initialState = {
    items: [],
    loading: false,
    error: null,
    stats: {
        currently_blocked: 0,
        manually_unblocked: 0,
        expired: 0,
        total_unique: 0,
        repeat_offenders: 0,
        total_blocks: 0,
        loading: false,
        error: null
    },
    filters: {
        search: '',
        dateRange: null
    },
    sort: {
        field: 'blocked_at',
        direction: 'desc'
    },
    pagination: {
        currentPage: 1,
        itemsPerPage: 10,
        total: 0
    },
    blockModal: {
        isOpen: false
    }
};

const blacklistSlice = createSlice({
    name: 'admin/blacklist',
    initialState,
    reducers: {
        setFilters: (state, action) => {
            state.filters = action.payload;
            state.pagination.currentPage = 1;
        },
        setSortConfig: (state, action) => {
            state.sort = action.payload;
        },
        setCurrentPage: (state, action) => {
            state.pagination.currentPage = action.payload;
        },
        setBlockModalState: (state, action) => {
            state.blockModal = {
                ...state.blockModal,
                ...action.payload
            };
        },
        resetState: () => initialState
    },
    extraReducers: (builder) => {
        builder
            // Fetch blocked IPs
            .addCase(fetchBlockedIps.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchBlockedIps.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload.blocked_ips;
                state.error = null;
            })
            .addCase(fetchBlockedIps.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Block IP
            .addCase(blockIp.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(blockIp.fulfilled, (state) => {
                state.loading = false;
                state.blockModal.isOpen = false;
                state.error = null;
            })
            .addCase(blockIp.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Unblock IP
            .addCase(unblockIp.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(unblockIp.fulfilled, (state, action) => {
                state.loading = false;
                state.items = state.items.filter(item => item.ip !== action.payload);
                state.error = null;
            })
            .addCase(unblockIp.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Fetch stats
            .addCase(fetchBlacklistStats.pending, (state) => {
                state.stats.loading = true;
                state.stats.error = null;
            })
            .addCase(fetchBlacklistStats.fulfilled, (state, action) => {
                state.stats.loading = false;
                state.stats = {
                    ...state.stats,
                    ...action.payload,
                    error: null
                };
            })
            .addCase(fetchBlacklistStats.rejected, (state, action) => {
                state.stats.loading = false;
                state.stats.error = action.payload;
            });
    }
});

export const {
    setFilters,
    setSortConfig,
    setCurrentPage,
    setBlockModalState,
    resetState
} = blacklistSlice.actions;

export default blacklistSlice.reducer;