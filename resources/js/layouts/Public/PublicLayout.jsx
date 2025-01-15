import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

export default function PublicLayout({ children }) {
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
        </div>
    );
}