import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from '@store';
import SEOProvider from '@providers/SEOProvider';
import ProtectedRoute from './ProtectedRoute';
import { AdminLayout, PublicLayout } from '@layouts';
import { Login } from '@pages/auth';
import { Home, NotFound, Contact, BlogList, BlogPost, Services, About } from '@pages/public';
import { Dashboard } from '@pages/admin';
import { PostsList } from '@pages/admin/posts';
import { ContactsList } from '@/pages/admin/contacts';

export default function App() {
    return (
        <Provider store={store}>
            <BrowserRouter>
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

                        {/* Ruta 404 - Debe ir al final */}
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </SEOProvider>
            </BrowserRouter>
        </Provider>
    );
}