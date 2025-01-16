import React from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@hooks';
import Sidebar from './Sidebar';

export default function AdminLayout({ children }) {
    const navigate = useNavigate();
    const { logout } = useAuth();
    const [sidebarExpanded, setSidebarExpanded] = React.useState(true);

    const handleLogout = async () => {
        try {
            await logout();
            // La navegación se mantiene después del logout
            navigate('/login');
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex">
            <Sidebar
                onExpandChange={(expanded) => setSidebarExpanded(expanded)}
            />
            {/* Contenido principal con transición suave */}
            <div className={`flex-1 transition-all duration-300 ${
                sidebarExpanded ? 'ml-64' : 'ml-20'
            }`}>
                <header className="bg-white shadow h-16 sticky top-0 z-10">
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
                <main className="p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}

AdminLayout.propTypes = {
    children: PropTypes.node.isRequired,
};