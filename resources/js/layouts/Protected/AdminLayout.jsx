import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@context/AuthContext';
import Sidebar from './Sidebar';

export default function AdminLayout({ children }) {
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
            <Sidebar />

            {/* Contenido principal con transición suave */}
            <div className="transition-all duration-300 pl-20 lg:pl-64 flex flex-col min-h-screen">
                <header className="bg-white shadow h-16">
                    <div className="flex justify-between items-center px-8 h-full">
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
                <main className="flex-1 p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}