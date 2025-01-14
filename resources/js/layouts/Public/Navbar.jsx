// components/Navbar.jsx
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
    const [hasScrolled, setHasScrolled] = useState(false);
    const location = useLocation();
    const isHome = location.pathname === '/';

    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.scrollY;
            setHasScrolled(scrollTop > 0);
        };

        // Solo añadimos el event listener si estamos en home
        if (isHome) {
            window.addEventListener('scroll', handleScroll);
            return () => window.removeEventListener('scroll', handleScroll);
        }
    }, [isHome]);

    // Si no es home, siempre mostramos la navbar fija con fondo
    const navbarClasses = isHome
        ? `w-full transition-all duration-300 z-50 ${
            hasScrolled
                ? 'fixed top-0 left-0 right-0 bg-white shadow-md'
                : 'absolute bg-transparent'
          }`
        : 'fixed top-0 left-0 right-0 w-full bg-white shadow-md z-50';

    // Los estilos de texto también cambian según si es home y el scroll
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

    return (
        <header className={navbarClasses}>
            <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-20">
                    <div className="flex items-center">
                        <Link
                            to="/"
                            className={`text-2xl font-bold transition-colors duration-300 ${getLinkStyles(true)}`}
                        >
                            TuMarca
                        </Link>
                        <div className="ml-10 flex items-center space-x-8">
                            <Link
                                to="/blog"
                                className={`transition-colors duration-300 ${getLinkStyles()}`}
                            >
                                Blog
                            </Link>
                            <Link
                                to="/noticias"
                                className={`transition-colors duration-300 ${getLinkStyles()}`}
                            >
                                Noticias
                            </Link>
                            <Link
                                to="/contacto"
                                className={`transition-colors duration-300 ${getLinkStyles()}`}
                            >
                                Contacto
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>
        </header>
    );
}