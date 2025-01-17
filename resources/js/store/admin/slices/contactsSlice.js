// src/store/admin/slices/contactsSlice.js
import { createSlice } from '@reduxjs/toolkit';
import {
  fetchContacts,
  createContact,
  updateContact,
  deleteContact,
  updateContactStatus,
  countContacts
} from '../thunks/contactsThunks';

const initialState = {
  items: [],
  stats: {
    total_contacts: 0,
    loading: false,
    error: null
  },
  selectedContact: null,
  loading: false,
  error: null,
  filters: {
    search: '',
    status: '',
    dateRange: null
  },
  sort: {
    field: 'created_at',
    direction: 'desc'
  },
  pagination: {
    currentPage: 1,
    itemsPerPage: 10,
    total: 0
  },
  editModal: {
    isOpen: false,
    mode: null, // 'create' | 'edit'
  },
  deleteModal: {
    isOpen: false
  }
};

const contactsSlice = createSlice({
  name: 'admin/contacts',
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
    setSelectedContact: (state, action) => {
      state.selectedContact = action.payload;
    },
    setEditModalState: (state, action) => {
      state.editModal = {
        ...state.editModal,
        ...action.payload
      };
    },
    setDeleteModalState: (state, action) => {
      state.deleteModal = {
        ...state.deleteModal,
        ...action.payload
      };
    },
    resetState: () => initialState
  },
  extraReducers: (builder) => {
    builder
      // Fetch contacts
      .addCase(fetchContacts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchContacts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
        state.error = null;
      })
      .addCase(fetchContacts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create contact
      .addCase(createContact.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createContact.fulfilled, (state, action) => {
        state.loading = false;
        state.items = [action.payload.contact, ...state.items];
        state.editModal.isOpen = false;
        state.editModal.mode = null;
        state.selectedContact = null;
        state.error = null;
      })
      .addCase(createContact.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update contact
      .addCase(updateContact.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      // Update contact
    .addCase(updateContact.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.map(item =>
        item.id === action.payload.contact.id ? action.payload.contact : item
        );
        state.editModal.isOpen = false;
        state.editModal.mode = null;
        state.selectedContact = null;
        state.error = null;
    })
      .addCase(updateContact.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update contact status
      .addCase(updateContactStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateContactStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.map(item =>
          item.id === action.payload.contact.id ? action.payload.contact : item
        );
        state.error = null;
      })
      .addCase(updateContactStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete contact
      .addCase(deleteContact.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteContact.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter(item => item.id !== action.payload);
        state.deleteModal.isOpen = false;
        state.error = null;
      })
      .addCase(deleteContact.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Count contacts
      .addCase(countContacts.pending, (state) => {
        state.stats.loading = true;
        state.stats.error = null;
      })
      .addCase(countContacts.fulfilled, (state, action) => {
        state.stats.loading = false;
        state.stats.total_contacts = action.payload.total_contacts;
        state.stats.error = null;
      })
      .addCase(countContacts.rejected, (state, action) => {
        state.stats.loading = false;
        state.stats.error = action.payload;
      });
  }
});

export const {
  setFilters,
  setSortConfig,
  setCurrentPage,
  setSelectedContact,
  setEditModalState,
  setDeleteModalState,
  resetState
} = contactsSlice.actions;

export default contactsSlice.reducer;