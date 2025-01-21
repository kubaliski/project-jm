import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Sidebar from './Sidebar';
import UserMenu from './UserMenu';

export default function AdminLayout({ children }) {
    const [sidebarExpanded, setSidebarExpanded] = useState(true);
    return (
        <div className="min-h-screen bg-gray-100 flex">
            <Sidebar
                onExpandChange={(expanded) => setSidebarExpanded(expanded)}
            />
            <div className={`flex-1 transition-all duration-300 flex flex-col ${
                sidebarExpanded ? 'ml-64' : 'ml-20'
            }`}>
                <header className="bg-white shadow h-16 sticky top-0 z-[50]">
                    <div className="flex justify-between items-center px-8 h-full">
                        <h2 className="text-xl font-semibold text-gray-900">
                            Panel de Administración
                        </h2>
                        <UserMenu />
                    </div>
                </header>
                <main className="p-8 relative flex-1">
                    {children}
                </main>
                <footer className="bg-white shadow px-8 py-3 text-right text-gray-600 text-sm">
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