import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@context/AuthContext';

export default function AdminLayout({ children }) {
    const location = useLocation();
    const navigate = useNavigate();
    const { logout } = useAuth();

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login');
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Sidebar */}
            <div className="fixed inset-y-0 left-0 w-64 bg-gray-900">
                <div className="flex flex-col h-full">
                    <div className="flex items-center justify-center h-16 px-4 bg-gray-800">
                        <h1 className="text-xl font-bold text-white">Panel Admin</h1>
                    </div>
                    <nav className="flex-1 px-4 py-4 space-y-1">
                        <Link
                            to="/admin"
                            className={`flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                                location.pathname === '/admin'
                                    ? 'bg-gray-800 text-white'
                                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                            }`}
                        >
                            Dashboard
                        </Link>
                        <Link
                            to="/admin/posts"
                            className={`flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                                location.pathname.startsWith('/admin/posts')
                                    ? 'bg-gray-800 text-white'
                                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                            }`}
                        >
                            Posts
                        </Link>
                        <Link
                            to="/admin/noticias"
                            className={`flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                                location.pathname.startsWith('/admin/noticias')
                                    ? 'bg-gray-800 text-white'
                                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                            }`}
                        >
                            Noticias
                        </Link>
                    </nav>
                </div>
            </div>

            {/* Contenido principal */}
            <div className="pl-64">
                <header className="bg-white shadow">
                    <div className="flex justify-between items-center px-8 py-4">
                        <h2 className="text-xl font-semibold text-gray-900">
                            Dashboard
                        </h2>
                        <button
                            onClick={handleLogout}
                            className="px-4 py-2 text-gray-500 hover:text-gray-700 rounded-md hover:bg-gray-100 transition-colors"
                        >
                            Cerrar Sesión
                        </button>
                    </div>
                </header>
                <main className="p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}