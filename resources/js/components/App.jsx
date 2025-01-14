import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import SEOProvider from '../providers/SEOProvider';
import ProtectedRoute from './ProtectedRoute';
import PublicLayout from '../layouts/PublicLayout';
import AdminLayout from '../layouts/AdminLayout';
import Login from '../pages/auth/Login';
import Home from '../pages/public/Home';
import BlogList from '../pages/public/blog/BlogList';
import BlogPost from '../pages/public/blog/BlogPost';
import Dashboard from '../pages/admin/Dashboard';
import PostsList from '../pages/admin/posts/PostsList';
import NotFound from '../pages/public/NotFound';

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