// resources/js/layouts/PublicLayout.jsx
import React from 'react';
import { Link } from 'react-router-dom';

export default function PublicLayout({ children }) {
    return (
        <div className="min-h-screen flex flex-col">
            {/* Header limpio sin acceso admin */}
            <header className="bg-gradient-to-r from-blue-600 to-blue-800">
                <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-20">
                        <div className="flex items-center">
                            <Link to="/" className="text-2xl font-bold text-white">
                                TuMarca
                            </Link>
                            <div className="ml-10 flex items-center space-x-8">
                                <Link to="/blog" className="text-white hover:text-blue-200">
                                    Blog
                                </Link>
                                <Link to="/noticias" className="text-white hover:text-blue-200">
                                    Noticias
                                </Link>
                                <Link to="/contacto" className="text-white hover:text-blue-200">
                                    Contacto
                                </Link>
                            </div>
                        </div>
                    </div>
                </nav>
            </header>

            {/* Contenido principal */}
            <main className="flex-grow">
                {children}
            </main>

            {/* Footer con acceso admin discreto */}
            <footer className="bg-gray-900 text-gray-400">
                <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div>
                            <h3 className="text-white text-lg font-semibold mb-4">Sobre Nosotros</h3>
                            <p className="text-sm">
                                Descripción breve de tu empresa o proyecto.
                            </p>
                        </div>
                        <div>
                            <h3 className="text-white text-lg font-semibold mb-4">Enlaces</h3>
                            <ul className="space-y-2 text-sm">
                                <li><Link to="/blog" className="hover:text-white">Blog</Link></li>
                                <li><Link to="/noticias" className="hover:text-white">Noticias</Link></li>
                                <li><Link to="/contacto" className="hover:text-white">Contacto</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-white text-lg font-semibold mb-4">Contacto</h3>
                            <ul className="space-y-2 text-sm">
                                <li>info@tumarca.com</li>
                                <li>+34 900 000 000</li>
                                <li>Ciudad, País</li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-white text-lg font-semibold mb-4">Legal</h3>
                            <ul className="space-y-2 text-sm">
                                <li><Link to="/privacidad" className="hover:text-white">Política de Privacidad</Link></li>
                                <li><Link to="/terminos" className="hover:text-white">Términos de Uso</Link></li>
                                <li><Link to="/admin" className="hover:text-white">Área de gestión</Link></li>
                            </ul>
                        </div>
                    </div>
                    <div className="mt-8 pt-8 border-t border-gray-800 text-sm text-center">
                        <p>© {new Date().getFullYear()} TuMarca. Todos los derechos reservados.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}