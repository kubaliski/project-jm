import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Sidebar from './Sidebar';
import MobileSidebar from './MobileSidebar';
import UserMenu from './UserMenu';
import { useAuth } from '@hooks';
import { useNavigate } from 'react-router-dom';

export default function AdminLayout({ children }) {
    const [sidebarExpanded, setSidebarExpanded] = useState(true);
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login');
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex">
            {/* Sidebar desktop */}
            <div className="hidden lg:block">
                <Sidebar
                    onExpandChange={(expanded) => setSidebarExpanded(expanded)}
                    onLogout={handleLogout}
                />
            </div>

            <div className={`flex-1 transition-all duration-300 flex flex-col ${
                sidebarExpanded ? 'lg:ml-64' : 'lg:ml-20'
            }`}>
                <header className="bg-white shadow h-16 sticky top-0 z-[50]">
                    <div className="flex justify-between items-center px-4 lg:px-8 h-full">
                        <div className="flex items-center">
                            {/* Sidebar móvil */}
                            <MobileSidebar onLogout={handleLogout} />
                            <h2 className="text-xl font-semibold text-gray-900 ml-3">
                                Panel de Administración
                            </h2>
                        </div>
                        <UserMenu />
                    </div>
                </header>
                <main className="p-4 lg:p-8 relative flex-1">
                    {children}
                </main>
                <footer className="bg-white shadow px-4 lg:px-8 py-3 text-right text-gray-600 text-sm">
                    <span>© {new Date().getFullYear()} Ángel Caparrós. All rights reserved | </span>
                    <a
                        href="https://github.com/kubaliski"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-blue-600 transition-colors"
                    >
                        GitHub
                    </a>
                </footer>
            </div>
        </div>
    );
}

AdminLayout.propTypes = {
    children: PropTypes.node.isRequired,
};