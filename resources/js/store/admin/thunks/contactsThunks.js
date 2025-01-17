// src/store/admin/thunks/contactsThunks.js
import { createAsyncThunk } from '@reduxjs/toolkit';
import { adminContactsService } from '@services/api';

export const fetchContacts = createAsyncThunk(
  'admin/contacts/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const response = await adminContactsService.getAll();
      return response.data;
    } catch (error) {
      console.error('Fetch Contacts Error:', error); // Debug log
      return rejectWithValue(error.response?.data || 'Error al cargar los contactos');
    }
  }
);

export const createContact = createAsyncThunk(
  'admin/contacts/create',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await adminContactsService.create(formData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Error al crear el contacto');
    }
  }
);

export const updateContact = createAsyncThunk(
  'admin/contacts/update',
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const response = await adminContactsService.update(id, formData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Error al actualizar el contacto');
    }
  }
);

export const updateContactStatus = createAsyncThunk(
  'admin/contacts/updateStatus',
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const response = await adminContactsService.updateStatus(id, status);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Error al actualizar el estado del contacto');
    }
  }
);

export const deleteContact = createAsyncThunk(
  'admin/contacts/delete',
  async (id, { rejectWithValue }) => {
    try {
      await adminContactsService.delete(id);
      return id; // Retornamos el ID para removerlo del state
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Error al eliminar el contacto');
    }
  }
);

export const countContacts = createAsyncThunk(
  'admin/contacts/count',
  async (_, { rejectWithValue }) => {
    try {
      const response = await adminContactsService.count();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Error al obtener la cantidad de contactos');
    }
  }
);