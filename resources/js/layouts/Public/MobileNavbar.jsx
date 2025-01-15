// components/MobileNavbar.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { PhoneIcon } from '@heroicons/react/24/solid';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

export default function MobileNavbar({ hasScrolled, isHome }) {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef(null);
    const location = useLocation();

    // Manejar cierre con Escape
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape' && isOpen) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            return () => document.removeEventListener('keydown', handleEscape);
        }
    }, [isOpen]);

    // Prevenir scroll cuando el menú está abierto
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    // Cerrar menú cuando cambia la ruta
    useEffect(() => {
        setIsOpen(false);
    }, [location]);

    const getLinkStyles = (isHomeStyle = false) => {
        if (!isHome) {
            return 'text-gray-600 hover:text-blue-600 focus:ring-2 focus:ring-blue-600 focus:outline-none rounded';
        }
        return isHomeStyle
            ? hasScrolled
                ? 'text-blue-600'
                : 'text-white'
            : hasScrolled
                ? 'text-gray-600 hover:text-blue-600 focus:ring-2 focus:ring-blue-600 focus:outline-none rounded'
                : 'text-white hover:text-blue-100 focus:ring-2 focus:ring-white focus:outline-none rounded';
    };

    const getButtonStyles = () => {
        if (!isHome || hasScrolled) {
            return 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 focus:outline-none';
        }
        return 'bg-transparent text-white border-2 border-white hover:bg-white hover:text-blue-600 focus:ring-2 focus:ring-white focus:ring-offset-2 focus:outline-none';
    };

    return (
        <>
            {/* Header fijo */}
            <div className="flex justify-between items-center h-20">
                {/* Logo */}
                <Link
                    to="/"
                    className={`text-2xl font-bold transition-colors duration-300 ${getLinkStyles(true)}`}
                    aria-label="TuMarca - Ir a inicio"
                >
                    TuMarca
                </Link>

                <div className="flex items-center gap-4">
                    {/* Botón de llamada */}
                    <a
                        href="tel:+34600000000"
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors duration-300 ${getButtonStyles()}`}
                        aria-label="Llamar ahora al +34 600 000 000"
                    >
                        <PhoneIcon className="h-5 w-5" aria-hidden="true" />
                        <span className="sr-only">Llamar</span>
                    </a>

                    {/* Botón del menú */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className={`p-2 rounded-lg ${getLinkStyles()} focus:ring-2 focus:ring-offset-2`}
                        aria-expanded={isOpen}
                        aria-controls="mobile-navigation"
                        aria-label={isOpen ? "Cerrar menú de navegación" : "Abrir menú de navegación"}
                    >
                        {isOpen ? (
                            <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                        ) : (
                            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
                        )}
                    </button>
                </div>
            </div>

            {/* Menú desplegable */}
            {isOpen && (
                <nav
                    id="mobile-navigation"
                    ref={menuRef}
                    className={`absolute left-0 right-0 top-20 shadow-lg ${
                        hasScrolled || !isHome ? 'bg-white' : 'bg-black bg-opacity-90'
                    }`}
                    aria-label="Menú móvil"
                >
                    <ul className="px-4 py-6 space-y-4">
                        <li>
                            <Link
                                to="/blog"
                                className={`block w-full py-2 px-3 transition-colors duration-300 rounded-lg ${getLinkStyles()}`}
                                onClick={() => setIsOpen(false)}
                                aria-current={location.pathname === '/blog' ? 'page' : undefined}
                            >
                                Blog
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/noticias"
                                className={`block w-full py-2 px-3 transition-colors duration-300 rounded-lg ${getLinkStyles()}`}
                                onClick={() => setIsOpen(false)}
                                aria-current={location.pathname === '/noticias' ? 'page' : undefined}
                            >
                                Noticias
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/contacto"
                                className={`block w-full py-2 px-3 transition-colors duration-300 rounded-lg ${getLinkStyles()}`}
                                onClick={() => setIsOpen(false)}
                                aria-current={location.pathname === '/contacto' ? 'page' : undefined}
                            >
                                Contacto
                            </Link>
                        </li>
                    </ul>
                </nav>
            )}

            {/* Anuncio para lectores de pantalla */}
            <div
                className="sr-only"
                role="status"
                aria-live="polite"
            >
                {isOpen ? 'Menú de navegación abierto' : 'Menú de navegación cerrado'}
            </div>
        </>
    );
}