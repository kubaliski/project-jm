// components/MobileNavbar.jsx
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { PhoneIcon } from '@heroicons/react/24/solid';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

export default function MobileNavbar({ hasScrolled, isHome }) {
    const [isOpen, setIsOpen] = useState(false);

    const getLinkStyles = (isHomeStyle = false) => {
        if (!isHome) return 'text-gray-600 hover:text-blue-600';
        return isHomeStyle
            ? hasScrolled
                ? 'text-blue-600'
                : 'text-white'
            : hasScrolled
                ? 'text-gray-600 hover:text-blue-600'
                : 'text-white hover:text-blue-100';
    };

    const getButtonStyles = () => {
        if (!isHome || hasScrolled) {
            return 'bg-blue-600 text-white hover:bg-blue-700';
        }
        return 'bg-transparent text-white border-2 border-white hover:bg-white hover:text-blue-600';
    };

    return (
        <>
            {/* Header fijo */}
            <div className="flex justify-between items-center h-20">
                <Link
                    to="/"
                    className={`text-2xl font-bold transition-colors duration-300 ${getLinkStyles(true)}`}
                >
                    TuMarca
                </Link>

                <div className="flex items-center gap-4">
                    <a
                        href="tel:+34600000000"
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors duration-300 ${getButtonStyles()}`}
                    >
                        <PhoneIcon className="h-5 w-5" />
                    </a>

                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className={`p-2 rounded-lg ${getLinkStyles()}`}
                    >
                        {isOpen ? (
                            <XMarkIcon className="h-6 w-6" />
                        ) : (
                            <Bars3Icon className="h-6 w-6" />
                        )}
                    </button>
                </div>
            </div>

            {/* Menú desplegable */}
            {isOpen && (
                <div className={`absolute left-0 right-0 top-20 px-4 py-6 space-y-4 shadow-lg ${hasScrolled || !isHome ? 'bg-white' : 'bg-black bg-opacity-80'}`}>
                    <Link
                        to="/blog"
                        className={`block py-2 transition-colors duration-300 ${getLinkStyles()}`}
                        onClick={() => setIsOpen(false)}
                    >
                        Blog
                    </Link>
                    <Link
                        to="/noticias"
                        className={`block py-2 transition-colors duration-300 ${getLinkStyles()}`}
                        onClick={() => setIsOpen(false)}
                    >
                        Noticias
                    </Link>
                    <Link
                        to="/contacto"
                        className={`block py-2 transition-colors duration-300 ${getLinkStyles()}`}
                        onClick={() => setIsOpen(false)}
                    >
                        Contacto
                    </Link>
                </div>
            )}
        </>
    );
}