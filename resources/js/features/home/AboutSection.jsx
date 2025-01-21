// features/home/sections/AboutSection.jsx
import React from 'react';
import { Link } from 'react-router-dom';

export default function AboutSection() {
    return (
        <section
            className="py-20 bg-white"
            aria-labelledby="sobre-nosotros-heading"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    <div>
                        <h2
                            id="sobre-nosotros-heading"
                            className="text-3xl font-bold mb-6"
                        >
                            Sobre Nosotros
                        </h2>
                        <div className="prose prose-lg text-gray-600">
                            <p className="mb-4">
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                                Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                            </p>
                            <p className="mb-6">
                                Duis aute irure dolor in reprehenderit in voluptate velit esse
                                cillum dolore eu fugiat nulla pariatur.
                            </p>
                        </div>
                        <Link
                            to="/nosotros"
                            className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
                            role="button"
                        >
                            Conoce más sobre nosotros
                        </Link>
                    </div>
                    <div
                        className="bg-gray-200 h-96 rounded-lg"
                        role="img"
                        aria-label="Equipo de TuMarca trabajando"
                    />
                </div>
            </div>
        </section>
    );
}