// pages/Home.jsx
import React from 'react';
import {LatestPosts} from '@features/home';

export default function Home() {
    return (
        <div>
            {/* Hero Section - Sin padding top */}
            <section className="relative h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600">
                <div className="text-center text-white">
                    <h1 className="text-5xl md:text-6xl font-bold mb-6">Bienvenido a TuMarca</h1>
                    <p className="text-xl md:text-2xl mb-8">Descubre todo lo que podemos hacer por ti</p>
                    <button className="bg-white text-blue-600 px-8 py-3 rounded-full font-semibold hover:bg-blue-50 transition-colors">
                        Comenzar
                    </button>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-center mb-12">Nuestros Servicios</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[1, 2, 3].map((item) => (
                            <div key={item} className="p-6 bg-gray-50 rounded-lg">
                                <div className="w-12 h-12 bg-blue-500 rounded-lg mb-4"></div>
                                <h3 className="text-xl font-semibold mb-2">Servicio {item}</h3>
                                <p className="text-gray-600">
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Latest Posts Section */}
            <LatestPosts />

            {/* About Section */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-3xl font-bold mb-6">Sobre Nosotros</h2>
                            <p className="text-gray-600 mb-4">
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.
                            </p>
                            <p className="text-gray-600 mb-6">
                                Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident.
                            </p>
                            <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                                Conoce más
                            </button>
                        </div>
                        <div className="bg-gray-200 h-96 rounded-lg"></div>
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-center mb-12">Lo que dicen nuestros clientes</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[1, 2, 3].map((item) => (
                            <div key={item} className="p-6 bg-white rounded-lg shadow-lg">
                                <div className="flex items-center mb-4">
                                    <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                                    <div className="ml-4">
                                        <h4 className="font-semibold">Cliente {item}</h4>
                                        <p className="text-gray-500">Empresa {item}</p>
                                    </div>
                                </div>
                                <p className="text-gray-600">
                                    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-blue-600">
                <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-white mb-6">¿Listo para empezar?</h2>
                    <p className="text-xl text-blue-100 mb-8">
                        Únete a miles de clientes satisfechos y lleva tu negocio al siguiente nivel
                    </p>
                    <button className="bg-white text-blue-600 px-8 py-3 rounded-full font-semibold hover:bg-blue-50 transition-colors">
                        Contáctanos
                    </button>
                </div>
            </section>
        </div>
    );
}