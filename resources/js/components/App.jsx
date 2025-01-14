import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import ProtectedRoute from './ProtectedRoute';
import PublicLayout from '../layouts/PublicLayout';
import AdminLayout from '../layouts/AdminLayout';
import Login from '../pages/auth/Login';
import Home from '../pages/public/Home';
import Dashboard from '../pages/admin/Dashboard';
import PostsList from '../pages/admin/posts/PostsList';

export default function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    {/* Rutas públicas */}
                    <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
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
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}