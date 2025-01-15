import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import CookieManager from './CookieManager';

export default function PublicLayout({ children }) {
    const location = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location.pathname]);

    return (
        <div className="min-h-screen flex flex-col">
            <a
                href="#main-content"
                className="sr-only focus:not-sr-only focus:absolute focus:z-[100] focus:p-4 focus:bg-white focus:text-blue-600"
            >
                Saltar al contenido principal
            </a>
            <Navbar />
            <main id="main-content" className="flex-grow" role="main">
                {children}
            </main>
            <Footer />
            <CookieManager/>
        </div>
    );
}