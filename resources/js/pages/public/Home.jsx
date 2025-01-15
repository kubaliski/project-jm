// pages/Home.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { LatestPosts } from '@features/home';
import { CTASection } from '@/components/common';

export default function Home() {
    return (
        <div>
            {/* Hero Section */}
            <section
                className="relative h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600"
                aria-labelledby="hero-heading"
            >
                <div className="text-center text-white">
                    <h1 id="hero-heading" className="text-5xl md:text-6xl font-bold mb-6">
                        Bienvenido a TuMarca
                    </h1>
                    <p className="text-xl md:text-2xl mb-8">
                        Descubre todo lo que podemos hacer por ti
                    </p>
                    <Link
                        to="/servicios"
                        className="inline-block bg-white text-blue-600 px-8 py-3 rounded-full font-semibold hover:bg-blue-50 transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-500"
                        role="button"
                    >
                        Comenzar ahora
                    </Link>
                </div>
            </section>

            {/* Features Section */}
            <section
                className="py-20 bg-white"
                aria-labelledby="servicios-heading"
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 id="servicios-heading" className="text-3xl font-bold text-center mb-12">
                        Nuestros Servicios
                    </h2>
                    <div
                        className="grid grid-cols-1 md:grid-cols-3 gap-8"
                        role="list"
                    >
                        {[
                            {
                                title: "Desarrollo Web",
                                description: "Creamos sitios web modernos y accesibles que destacan tu marca.",
                                link: "/servicios#desarrollo"
                            },
                            {
                                title: "Marketing Digital",
                                description: "Estrategias efectivas para aumentar tu presencia online.",
                                link: "/servicios#marketing"
                            },
                            {
                                title: "Consultoría",
                                description: "Asesoramiento experto para optimizar tus procesos digitales.",
                                link: "/servicios#consultoria"
                            }
                        ].map((servicio, index) => (
                            <Link
                                key={index}
                                to={servicio.link}
                                className="block p-6 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                role="listitem"
                            >
                                <div
                                    className="w-12 h-12 bg-blue-500 rounded-lg mb-4 group-hover:bg-blue-600 transition-colors"
                                    aria-hidden="true"
                                />
                                <h3 className="text-xl font-semibold mb-2 group-hover:text-blue-600 transition-colors">
                                    {servicio.title}
                                </h3>
                                <p className="text-gray-600">
                                    {servicio.description}
                                </p>
                                <span className="mt-4 inline-flex items-center text-blue-600 group-hover:text-blue-800 font-medium">
                                    <span>Saber más</span>
                                    <svg
                                        className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        aria-hidden="true"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </span>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Latest Posts Section */}
            <LatestPosts />

            {/* About Section */}
            <section
                className="py-20 bg-white"
                aria-labelledby="sobre-nosotros-heading"
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 id="sobre-nosotros-heading" className="text-3xl font-bold mb-6">
                                Sobre Nosotros
                            </h2>
                            <p className="text-gray-600 mb-4">
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.
                            </p>
                            <p className="text-gray-600 mb-6">
                                Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident.
                            </p>
                            <Link
                                to="/sobre-nosotros"
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

            {/* Testimonials Section */}
            <section
                className="py-20 bg-gray-50"
                aria-labelledby="testimonios-heading"
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 id="testimonios-heading" className="text-3xl font-bold text-center mb-12">
                        Lo que dicen nuestros clientes
                    </h2>
                    <div
                        className="grid grid-cols-1 md:grid-cols-3 gap-8"
                        role="list"
                    >
                        {[
                            {
                                name: "María García",
                                company: "Innovatech",
                                testimonial: "El servicio y atención han sido excepcionales. Han transformado completamente nuestra presencia digital."
                            },
                            {
                                name: "Carlos Rodríguez",
                                company: "Digital Solutions",
                                testimonial: "Su experiencia y profesionalidad nos han ayudado a alcanzar nuestros objetivos de negocio."
                            },
                            {
                                name: "Ana Martínez",
                                company: "CreativeStudio",
                                testimonial: "Un equipo altamente competente que entiende perfectamente las necesidades del cliente."
                            }
                        ].map((testimonial, index) => (
                            <article
                                key={index}
                                className="p-6 bg-white rounded-lg shadow-lg"
                                role="listitem"
                            >
                                <div className="flex items-center mb-4">
                                    <div
                                        className="w-12 h-12 bg-gray-200 rounded-full"
                                        aria-hidden="true"
                                    />
                                    <div className="ml-4">
                                        <h3 className="font-semibold">{testimonial.name}</h3>
                                        <p className="text-gray-500">{testimonial.company}</p>
                                    </div>
                                </div>
                                <blockquote>
                                    <p className="text-gray-600">"{testimonial.testimonial}"</p>
                                </blockquote>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <CTASection />
        </div>
    );
}