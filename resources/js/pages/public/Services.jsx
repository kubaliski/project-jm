// pages/Services.jsx
import React, { useEffect } from 'react';
import { SEOManager } from '@components/common';
import { useLocation } from 'react-router-dom';

export default function Services() {
    const APP_NAME = window.APP_NAME;
    const location = useLocation();

    const handleSmoothScroll = (e, targetId) => {
        e.preventDefault();
        const element = document.getElementById(targetId);
        if (element) {
            element.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
                inline: 'nearest'
            });
            // Actualizar la URL sin causar recarga
            window.history.pushState(null, '', `#${targetId}`);
        }
    };

    useEffect(() => {
        if (location.hash) {
            const id = location.hash.slice(1);
            const element = document.getElementById(id);
            if (element) {
                setTimeout(() => {
                    element.scrollIntoView({ behavior: 'smooth' });
                }, 100);
            }
        } else {
            window.scrollTo(0, 0);
        }
    }, [location]);

    return (
        <>
            <SEOManager
                title={`${APP_NAME} | Servicios`}
                description="Descubre nuestra amplia gama de servicios profesionales diseñados para impulsar tu negocio"
            />
            <main>
                {/* Hero Section */}
                <section
                    className="relative h-72 flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600 mt-20"
                    aria-labelledby="services-heading"
                >
                    <div className="text-center text-white">
                        <h1
                            id="services-heading"
                            className="text-5xl md:text-6xl font-bold mb-6"
                        >
                            Nuestros Servicios
                        </h1>
                        <p className="text-xl md:text-2xl">
                            Soluciones adaptadas a tus necesidades
                        </p>
                    </div>
                </section>

                {/* Featured Services */}
                <section
                    className="py-20 bg-white"
                    aria-labelledby="featured-services-heading"
                >
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h2
                            id="featured-services-heading"
                            className="text-3xl font-bold text-center mb-12"
                        >
                            Servicios Destacados
                        </h2>
                        <div
                            className="grid grid-cols-1 md:grid-cols-3 gap-8"
                            role="list"
                        >
                            {/* Servicio 1 */}
                            <article
                                className="bg-gray-50 rounded-lg p-6 shadow-sm"
                                role="listitem"
                            >
                                <div
                                    className="w-16 h-16 bg-blue-500 rounded-lg mb-6 mx-auto"
                                    aria-hidden="true"
                                >
                                    {/* Ícono del servicio */}
                                </div>
                                <h3 className="text-xl font-semibold mb-4 text-center">
                                    Consultoría Estratégica
                                </h3>
                                <p className="text-gray-600 text-center">
                                    Asesoramiento experto para optimizar tus procesos
                                    empresariales y maximizar resultados.
                                </p>
                                <div className="mt-6 text-center">
                                    <a
                                        href="#consultoria"
                                        onClick={(e) => handleSmoothScroll(e, 'consultoria')}
                                        className="inline-block px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                        aria-label="Más información sobre consultoría estratégica"
                                    >
                                        Más información
                                    </a>
                                </div>
                            </article>

                            {/* Servicio 2 */}
                            <article
                                className="bg-gray-50 rounded-lg p-6 shadow-sm"
                                role="listitem"
                            >
                                <div
                                    className="w-16 h-16 bg-blue-500 rounded-lg mb-6 mx-auto"
                                    aria-hidden="true"
                                >
                                    {/* Ícono del servicio */}
                                </div>
                                <h3 className="text-xl font-semibold mb-4 text-center">
                                    Desarrollo Digital
                                </h3>
                                <p className="text-gray-600 text-center">
                                    Soluciones tecnológicas personalizadas para
                                    impulsar tu presencia digital.
                                </p>
                                <div className="mt-6 text-center">
                                    <a
                                        href="#desarrollo"
                                        onClick={(e) => handleSmoothScroll(e, 'desarrollo')}
                                        className="inline-block px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                        aria-label="Más información sobre desarrollo digital"
                                    >
                                        Más información
                                    </a>
                                </div>
                            </article>

                            {/* Servicio 3 */}
                            <article
                                className="bg-gray-50 rounded-lg p-6 shadow-sm"
                                role="listitem"
                            >
                                <div
                                    className="w-16 h-16 bg-blue-500 rounded-lg mb-6 mx-auto"
                                    aria-hidden="true"
                                >
                                    {/* Ícono del servicio */}
                                </div>
                                <h3 className="text-xl font-semibold mb-4 text-center">
                                    Marketing Digital
                                </h3>
                                <p className="text-gray-600 text-center">
                                    Estrategias efectivas para aumentar tu visibilidad
                                    y alcance en el mundo digital.
                                </p>
                                <div className="mt-6 text-center">
                                    <a
                                        href="#marketing"
                                        onClick={(e) => handleSmoothScroll(e, 'marketing')}
                                        className="inline-block px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                        aria-label="Más información sobre marketing digital"
                                    >
                                        Más información
                                    </a>
                                </div>
                            </article>
                        </div>
                    </div>
                </section>

                {/* Service Details */}
                <section
                    className="py-20 bg-gray-50"
                    aria-labelledby="service-details-heading"
                >
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h2
                            id="service-details-heading"
                            className="text-3xl font-bold text-center mb-12"
                        >
                            Detalles de Nuestros Servicios
                        </h2>
                        <div className="space-y-16">
                            {/* Detalle Consultoría */}
                            <div
                                id="consultoria"
                                className="bg-white rounded-lg p-8 shadow-sm"
                            >
                                <h3 className="text-2xl font-semibold mb-4">
                                    Consultoría Estratégica
                                </h3>
                                <p className="text-gray-600 mb-6">
                                    Nuestro equipo de expertos te ayudará a identificar
                                    oportunidades de mejora y desarrollar estrategias
                                    efectivas para el crecimiento de tu negocio.
                                </p>
                                <ul
                                    className="list-disc list-inside text-gray-600 space-y-2"
                                    aria-label="Beneficios de la consultoría estratégica"
                                >
                                    <li>Análisis detallado de procesos</li>
                                    <li>Optimización de recursos</li>
                                    <li>Planificación estratégica</li>
                                    <li>Gestión del cambio</li>
                                </ul>
                            </div>

                            {/* Detalle Desarrollo */}
                            <div
                                id="desarrollo"
                                className="bg-white rounded-lg p-8 shadow-sm"
                            >
                                <h3 className="text-2xl font-semibold mb-4">
                                    Desarrollo Digital
                                </h3>
                                <p className="text-gray-600 mb-6">
                                    Desarrollamos soluciones tecnológicas a medida
                                    que impulsan la eficiencia y productividad de
                                    tu empresa.
                                </p>
                                <ul
                                    className="list-disc list-inside text-gray-600 space-y-2"
                                    aria-label="Servicios de desarrollo digital"
                                >
                                    <li>Desarrollo web y móvil</li>
                                    <li>Arquitectura de sistemas</li>
                                    <li>Integración de APIs</li>
                                    <li>Mantenimiento y soporte</li>
                                </ul>
                            </div>

                            {/* Detalle Marketing */}
                            <div
                                id="marketing"
                                className="bg-white rounded-lg p-8 shadow-sm"
                            >
                                <h3 className="text-2xl font-semibold mb-4">
                                    Marketing Digital
                                </h3>
                                <p className="text-gray-600 mb-6">
                                    Creamos estrategias digitales personalizadas
                                    para aumentar tu presencia online y conectar
                                    con tu audiencia.
                                </p>
                                <ul
                                    className="list-disc list-inside text-gray-600 space-y-2"
                                    aria-label="Servicios de marketing digital"
                                >
                                    <li>SEO y SEM</li>
                                    <li>Gestión de redes sociales</li>
                                    <li>Email marketing</li>
                                    <li>Análisis y reportes</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </>
    );
}