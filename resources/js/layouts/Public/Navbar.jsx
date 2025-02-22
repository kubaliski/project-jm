// components/Navbar.jsx
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import { PhoneIcon } from '@heroicons/react/24/solid';
import MobileNavbar from './MobileNavbar';
import { selectPublicAppInfo } from '@/store/landing/selectors/publicAppInfoSelectors';

export default function Navbar({ hasActiveBanner }) {
    const [hasScrolled, setHasScrolled] = useState(false);
    const location = useLocation();
    const appInfo = useSelector(selectPublicAppInfo);
    const defaultPhone = '+34 166 666 666';
    const phoneNumber = appInfo?.phone_1 || defaultPhone;
    const isHome = location.pathname === '/';
    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.scrollY;
            setHasScrolled(scrollTop > 0);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navbarClasses = isHome
        ? `w-full transition-all duration-300 ${
            hasScrolled
                ? 'fixed top-0 left-0 right-0 bg-white shadow-md'
                : 'absolute bg-transparent'
          }`
        : 'fixed top-0 left-0 right-0 w-full bg-white shadow-md';

    const getMarginTop = () => {
        if (isHome) {
            return hasScrolled ? '0' : (hasActiveBanner ? '48px' : '0');
        } else {
            return window.scrollY === 0 && hasActiveBanner ? '48px' : '0';
        }
    };

    const getLinkStyles = (isHomeStyle = false) => {
        if (!isHome) return 'text-gray-600 hover:text-blue-600 focus:ring-2 focus:ring-blue-600 focus:outline-none rounded';
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
        <header
            className={navbarClasses}
            role="banner"
            style={{
                zIndex: 40,
                marginTop: getMarginTop()
            }}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Versión móvil */}
                <div className="md:hidden">
                    <MobileNavbar hasScrolled={hasScrolled} isHome={isHome} />
                </div>

                {/* Versión desktop */}
                <div className="hidden md:flex justify-between items-center h-20">
                    {/* Logo */}
                    <Link
                        to="/"
                        className={`text-2xl font-bold transition-colors duration-300 ${getLinkStyles(true)}`}
                        aria-label="TuMarca - Ir a inicio"
                    >
                        WedPlan
                    </Link>

                    {/* Navegación principal */}
                    <nav
                        className="flex-1 px-8"
                        aria-label="Navegación principal"
                    >
                        <ul className="flex justify-center space-x-8">
                            <li>
                                <Link
                                    to="/servicios"
                                    className={`inline-block py-2 transition-colors duration-300 ${getLinkStyles()}`}
                                    aria-current={location.pathname === '/servicios' ? 'page' : undefined}
                                >
                                    Servicios
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/nosotros"
                                    className={`inline-block py-2 transition-colors duration-300 ${getLinkStyles()}`}
                                    aria-current={location.pathname === '/nosotros' ? 'page' : undefined}
                                >
                                    Nosotros
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/contacto"
                                    className={`inline-block py-2 transition-colors duration-300 ${getLinkStyles()}`}
                                    aria-current={location.pathname === '/contacto' ? 'page' : undefined}
                                >
                                    Contacto
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/blog"
                                    className={`inline-block py-2 transition-colors duration-300 ${getLinkStyles()}`}
                                    aria-current={location.pathname === '/blog' ? 'page' : undefined}
                                >
                                    Blog
                                </Link>
                            </li>
                        </ul>
                    </nav>

                    {/* Botón de contacto */}
                    <div className="flex items-center">
                        <a

                            href={`tel:${phoneNumber}`}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors duration-300 ${getButtonStyles()}`}
                            aria-label={`Llamanos al ${phoneNumber}`}
                        >
                            <PhoneIcon className="h-5 w-5" aria-hidden="true" />
                            <span>Llámanos</span>
                        </a>
                    </div>
                </div>
            </div>
        </header>
    );
}

Navbar.propTypes = {
    hasActiveBanner: PropTypes.bool
};
