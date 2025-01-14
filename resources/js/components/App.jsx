import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@context/AuthContext';
import SEOProvider from '@providers/SEOProvider';
import ProtectedRoute from './ProtectedRoute';
import {AdminLayout,PublicLayout} from '@layouts';
import {Login} from '@pages/auth';
import {Home,NotFound, Contact} from '@pages/public';
import { BlogList, BlogPost } from '@pages/public/blog';
import {Dashboard} from '@pages/admin';
import {PostsList} from '@pages/admin/posts';
export default function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <SEOProvider>
                    <Routes>
                        {/* Rutas públicas */}
                        <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
                        <Route path="/blog" element={<PublicLayout><BlogList /></PublicLayout>} />
                        <Route path="/blog/:slug" element={<PublicLayout><BlogPost /></PublicLayout>} />
                        <Route path="/contacto" element={<PublicLayout><Contact /></PublicLayout>} />
                        <Route path="/login" element={<Login />} />

                        {/* Rutas protegidas */}
                        <Route path="/admin" element={
                            <ProtectedRoute>
                                <AdminLayout><Dashboard /></AdminLayout>
                            </ProtectedRoute>
                        } />
                        <Route path="/admin/posts" element={
                            <ProtectedRoute>
                                <AdminLayout><PostsList /></AdminLayout>
                            </ProtectedRoute>
                        } />

                        {/* Ruta 404 - Debe ir al final */}
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </SEOProvider>
            </BrowserRouter>
        </AuthProvider>
    );
}