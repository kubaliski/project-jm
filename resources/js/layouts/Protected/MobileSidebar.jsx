import React, { useState } from 'react';
import Proptypes from 'prop-types';
import { Link, useLocation } from 'react-router-dom';
import {
    Bars3Icon,
    XMarkIcon,
    ArrowLeftOnRectangleIcon,
} from '@heroicons/react/24/outline';
import { useAuth } from '@hooks';
import { navItems } from '@config/data/navItems'; // Importamos navItems

const MobileSidebar = ({ onLogout }) => {
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();
    const APP_NAME = window.APP_NAME || "Mi Sitio";
    const {hasPermission} = useAuth();

    const filteredNavItems = navItems.map(group => ({
        ...group,
        items: group.items.filter(item =>
            // Si no hay permisos requeridos o si tiene todos los permisos necesarios
            !item.permissions.length || item.permissions.every(permission => hasPermission(permission))
        )
    })).filter(group => group.items.length > 0);

    return (
        <>
            {/* Botón hamburguesa */}
            <button
                onClick={() => setIsOpen(true)}
                className="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-md"
                aria-label="Abrir menú"
            >
                <Bars3Icon className="w-6 h-6" />
            </button>

            {/* Overlay oscuro */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Menú lateral */}
            <div className={`
                fixed inset-y-0 left-0 w-64 bg-gray-900 transform transition-transform duration-300 ease-in-out z-50 lg:hidden flex flex-col
                ${isOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
                {/* Cabecera del menú */}
                <div className="flex items-center justify-between h-16 px-4 bg-gray-800">
                    <h1 className="text-xl font-bold text-white">{APP_NAME}</h1>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="p-2 text-gray-300 hover:text-white"
                        aria-label="Cerrar menú"
                    >
                        <XMarkIcon className="w-6 h-6" />
                    </button>
                </div>

                {/* Navegación */}
                <nav className="flex-1 px-2 py-4 overflow-y-auto">
                    {filteredNavItems.map((group) => (
                        <div key={group.group} className="mb-6">
                            <h2 className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                                {group.group}
                            </h2>
                            <div className="space-y-1">
                                {group.items.map((item) => {
                                    const Icon = item.icon;
                                    const isActive = location.pathname === item.path ||
                                        (item.path !== "/admin" && location.pathname.startsWith(item.path));

                                    return (
                                        <Link
                                            key={item.path}
                                            to={item.path}
                                            onClick={() => setIsOpen(false)}
                                            className={`
                                                flex items-center px-3 py-2 rounded-md text-sm font-medium
                                                ${isActive
                                                    ? 'bg-blue-600 text-white'
                                                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                                                }
                                            `}
                                        >
                                            <Icon className="w-5 h-5 mr-3" />
                                            {item.label}
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </nav>

                {/* Botón de cerrar sesión */}
                <div className="border-t border-gray-700 p-4 mt-auto sticky bottom-0 bg-gray-900">
                    <button
                        onClick={() => {
                            setIsOpen(false);
                            onLogout();
                        }}
                        className="flex items-center w-full px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-800 hover:text-white rounded-md"
                    >
                        <ArrowLeftOnRectangleIcon className="w-5 h-5 mr-3" />
                        Cerrar Sesión
                    </button>
                </div>
            </div>
        </>
    );
};

MobileSidebar.propTypes = {
    onLogout: Proptypes.func.isRequired,
};

export default MobileSidebar;