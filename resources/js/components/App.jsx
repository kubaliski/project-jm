import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from '@store';
import {SEOProvider, ToastProvider} from '@providers';
import ProtectedRoute from './ProtectedRoute';
import { AdminLayout, PublicLayout } from '@layouts';
import { Login } from '@pages/auth';
import { Home, NotFound, Contact, BlogList, BlogPost, Services, About } from '@pages/public';
import { Dashboard, PostsList, ContactsList, UsersList, RolesList, Profile } from '@pages/admin';

export default function App() {
    return (
        <Provider store={store}>
            <BrowserRouter>
                <ToastProvider>
                    <SEOProvider>
                        <Routes>
                            {/* Rutas públicas */}
                            <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
                            <Route path="/nosotros" element={<PublicLayout><About /></PublicLayout>} />
                            <Route path="/blog" element={<PublicLayout><BlogList /></PublicLayout>} />
                            <Route path="/blog/:slug" element={<PublicLayout><BlogPost /></PublicLayout>} />
                            <Route path="/contacto" element={<PublicLayout><Contact /></PublicLayout>} />
                            <Route path="/servicios" element={<PublicLayout><Services /></PublicLayout>} />
                            <Route path="/login" element={<Login />} />

                            {/* Rutas protegidas */}
                            <Route path="/admin" element={
                                <ProtectedRoute>
                                    <AdminLayout><Dashboard /></AdminLayout>
                                </ProtectedRoute>
                            } />

                            <Route path="/admin/posts" element={
                                <ProtectedRoute requiredPermissions={['post.index']}>
                                    <AdminLayout><PostsList /></AdminLayout>
                                </ProtectedRoute>
                            } />

                            <Route path="/admin/contacts" element={
                                <ProtectedRoute requiredPermissions={['contact.index']}>
                                    <AdminLayout><ContactsList /></AdminLayout>
                                </ProtectedRoute>
                            } />

                            <Route path="/admin/users" element={
                                <ProtectedRoute requiredPermissions={['user.index']}>
                                    <AdminLayout><UsersList /></AdminLayout>
                                </ProtectedRoute>
                            } />

                            <Route path="/admin/roles" element={
                                <ProtectedRoute requiredPermissions={['role.index']}>
                                    <AdminLayout><RolesList /></AdminLayout>
                                </ProtectedRoute>
                            } />

                            <Route path="/admin/profile" element={
                                <ProtectedRoute>
                                    <AdminLayout><Profile /></AdminLayout>
                                </ProtectedRoute>
                            } />

                            {/* Ruta 404 - Debe ir al final */}
                            <Route path="*" element={<NotFound />} />
                        </Routes>
                    </SEOProvider>
                </ToastProvider>
            </BrowserRouter>
        </Provider>
    );
}