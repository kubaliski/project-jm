// components/Footer.jsx
import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
    return (
        <footer className="bg-blue-900 text-blue-200">
            <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div>
                        <h3 className="text-white text-lg font-semibold mb-4">Sobre Nosotros</h3>
                        <p className="text-sm text-blue-200/90">
                            Descripción breve de tu empresa o proyecto.
                        </p>
                    </div>
                    <div>
                        <h3 className="text-white text-lg font-semibold mb-4">Enlaces</h3>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link to="/blog" className="text-blue-200/90 hover:text-white transition-colors">
                                    Blog
                                </Link>
                            </li>
                            <li>
                                <Link to="/noticias" className="text-blue-200/90 hover:text-white transition-colors">
                                    Noticias
                                </Link>
                            </li>
                            <li>
                                <Link to="/contacto" className="text-blue-200/90 hover:text-white transition-colors">
                                    Contacto
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-white text-lg font-semibold mb-4">Contacto</h3>
                        <ul className="space-y-2 text-sm text-blue-200/90">
                            <li>info@tumarca.com</li>
                            <li>+34 900 000 000</li>
                            <li>Ciudad, País</li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-white text-lg font-semibold mb-4">Legal</h3>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link to="/privacidad" className="text-blue-200/90 hover:text-white transition-colors">
                                    Política de Privacidad
                                </Link>
                            </li>
                            <li>
                                <Link to="/terminos" className="text-blue-200/90 hover:text-white transition-colors">
                                    Términos de Uso
                                </Link>
                            </li>
                            <li>
                                <Link to="/admin" className="text-blue-200/90 hover:text-white transition-colors">
                                    Área de gestión
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="mt-8 pt-8 border-t border-blue-800/50 text-sm text-center text-blue-200/80">
                    <p>© {new Date().getFullYear()} TuMarca. Todos los derechos reservados.</p>
                </div>
            </div>
        </footer>
    );
}