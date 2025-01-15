// pages/Contact.jsx
import React, { useEffect } from 'react';
import { SEOManager } from '@components/common';
import { ContactForm } from '@/features/contact';
import { useLocation } from 'react-router-dom';

export default function Contact() {
    const APP_NAME = window.APP_NAME;
    const location = useLocation();

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
                title={`${APP_NAME} | Contacto`}
                description="Estamos aquí para ayudarte, envíanos un mensaje con tus dudas o comentarios"
            />
            <main>
                {/* Hero Section */}
                <section
                    className="relative h-72 flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600 mt-20"
                    aria-labelledby="contact-heading"
                >
                    <div className="text-center text-white">
                        <h1
                            id="contact-heading"
                            className="text-5xl md:text-6xl font-bold mb-6"
                        >
                            Contáctanos
                        </h1>
                        <p className="text-xl md:text-2xl">
                            Estamos aquí para ayudarte
                        </p>
                    </div>
                </section>

                {/* Contact Information */}
                <section
                    className="py-20 bg-white"
                    aria-labelledby="contact-info-heading"
                >
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h2
                            id="contact-info-heading"
                            className="sr-only"
                        >
                            Información de contacto
                        </h2>
                        <div
                            className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
                            role="list"
                        >
                            <div
                                className="text-center p-6 bg-gray-50 rounded-lg"
                                role="listitem"
                            >
                                <div
                                    className="w-12 h-12 bg-blue-500 rounded-lg mb-4 mx-auto"
                                    aria-hidden="true"
                                >
                                    {/* Aquí podrías añadir un ícono de ubicación */}
                                </div>
                                <h3 className="text-xl font-semibold mb-2">Ubicación</h3>
                                <address className="text-gray-600 not-italic">
                                    <p>Calle Principal 123</p>
                                    <p>Ciudad, País</p>
                                </address>
                            </div>
                            <div
                                className="text-center p-6 bg-gray-50 rounded-lg"
                                role="listitem"
                            >
                                <div
                                    className="w-12 h-12 bg-blue-500 rounded-lg mb-4 mx-auto"
                                    aria-hidden="true"
                                >
                                    {/* Aquí podrías añadir un ícono de email */}
                                </div>
                                <h3 className="text-xl font-semibold mb-2">Email</h3>
                                <div className="text-gray-600">
                                    <a
                                        href="mailto:info@tumarca.com"
                                        className="hover:text-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
                                    >
                                        info@tumarca.com
                                    </a>
                                    <br />
z                                   <a
                                        href="mailto:soporte@tumarca.com"
                                        className="hover:text-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
                                    >
                                        soporte@tumarca.com
                                    </a>
                                </div>
                            </div>
                            <div
                                className="text-center p-6 bg-gray-50 rounded-lg"
                                role="listitem"
                            >
                                <div
                                    className="w-12 h-12 bg-blue-500 rounded-lg mb-4 mx-auto"
                                    aria-hidden="true"
                                >
                                    {/* Aquí podrías añadir un ícono de teléfono */}
                                </div>
                                <h3 className="text-xl font-semibold mb-2">Teléfono</h3>
                                <div className="text-gray-600">
                                    <a
                                        href="tel:+1234567890"
                                        className="hover:text-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
                                    >
                                        +1 234 567 890
                                    </a>
                                    <p>
                                        <span className="sr-only">Horario de atención: </span>
                                        Lun - Vie, 9:00 - 18:00
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Contact Form */}
                        <section aria-labelledby="contact-form-heading">
                            <h2 id="contact-form-heading" className="sr-only">
                                Formulario de contacto
                            </h2>
                            <ContactForm />
                        </section>
                    </div>
                </section>

                {/* Map Section */}
                <section
                    className="py-20 bg-gray-50"
                    aria-labelledby="location-map-heading"
                >
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h2 id="location-map-heading" className="sr-only">
                            Nuestra ubicación
                        </h2>
                        <div
                            className="h-96 bg-gray-200 rounded-lg"
                            role="region"
                            aria-label="Mapa de ubicación"
                        >
                            {/* Aquí iría el componente del mapa */}
                        </div>
                    </div>
                </section>
            </main>
        </>
    );
}