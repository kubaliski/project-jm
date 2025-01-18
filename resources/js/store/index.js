// src/store/index.js
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import authReducer from './auth/slices/authSlice';
import postsReducer from './admin/slices/postsSlice';
import contactsReducer from './admin/slices/contactsSlice';
import rolesReducer from './admin/slices/rolesSlice';
import usersReducer from './admin/slices/usersSlice';

// Reducer para la parte pública (landing)
// const landingReducer = combineReducers({
//   // Aquí iremos agregando los reducers de la landing
//   // ejemplo: hero: heroReducer,
//   // ejemplo: blog: blogReducer,
// });

// Reducer para la parte de administración
const adminReducer = combineReducers({
    contacts: contactsReducer,
    posts: postsReducer,
    roles: rolesReducer,
    users: usersReducer,
});

// Root reducer
const rootReducer = combineReducers({
  // landing: landingReducer,
  admin: adminReducer,
  auth: authReducer
});

// Configuración del store
export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignoramos acciones específicas que podrían contener datos no serializables
        ignoredActions: ['auth/login/fulfilled'],
      },
    }),
  devTools: process.env.NODE_ENV !== 'production'
});