// src/store/index.js
import { configureStore, combineReducers } from '@reduxjs/toolkit';
//Recucers auth
import authReducer from './auth/slices/authSlice';

// Reducers de la parte de administración
import bannersReducer from './admin/slices/bannersSlice';
import contactsReducer from './admin/slices/contactsSlice';
import postsReducer from './admin/slices/postsSlice';
import rolesReducer from './admin/slices/rolesSlice';
import usersReducer from './admin/slices/usersSlice';


// Reducers de la parte pública (landing)
import publicBannersReducer  from './landing/slices/publicBannersSlice';
import publicPostsReducer from './landing/slices/publicPostsSlice';


const landingReducer = combineReducers({
  publicPosts: publicPostsReducer,
  publicBanners: publicBannersReducer,
});

// Reducer para la parte de administración
const adminReducer = combineReducers({
    banners: bannersReducer,
    contacts: contactsReducer,
    posts: postsReducer,
    roles: rolesReducer,
    users: usersReducer,
});

// Root reducer
const rootReducer = combineReducers({
  admin: adminReducer,
  auth: authReducer,
  landing: landingReducer,
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