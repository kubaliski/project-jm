// pages/Contact.jsx
import React from 'react';
import { SEOManager } from '@components/common';
import {ContactForm} from '@/features/contact';

export default function Contact() {
    const APP_NAME = window.APP_NAME;

    const handleFormSubmit = (formData) => {
        // Aquí iría la lógica de envío del formulario
        console.log('Form submitted:', formData);
    };

    return (
        <>
            <SEOManager
                title={`${APP_NAME} | Contacto`}
                description="Estamos aquí para ayudarte, envíanos un mensaje con tus dudas o comentarios"
            />
            <div>
                {/* Hero Section */}
                <section className="relative h-72 flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600 mt-20">
                    <div className="text-center text-white">
                        <h1 className="text-5xl md:text-6xl font-bold mb-6">Contáctanos</h1>
                        <p className="text-xl md:text-2xl">Estamos aquí para ayudarte</p>
                    </div>
                </section>

                {/* Contact Information */}
                <section className="py-20 bg-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                            <div className="text-center p-6 bg-gray-50 rounded-lg">
                                <div className="w-12 h-12 bg-blue-500 rounded-lg mb-4 mx-auto"></div>
                                <h3 className="text-xl font-semibold mb-2">Ubicación</h3>
                                <p className="text-gray-600">
                                    Calle Principal 123<br />
                                    Ciudad, País
                                </p>
                            </div>
                            <div className="text-center p-6 bg-gray-50 rounded-lg">
                                <div className="w-12 h-12 bg-blue-500 rounded-lg mb-4 mx-auto"></div>
                                <h3 className="text-xl font-semibold mb-2">Email</h3>
                                <p className="text-gray-600">
                                    info@tumarca.com<br />
                                    soporte@tumarca.com
                                </p>
                            </div>
                            <div className="text-center p-6 bg-gray-50 rounded-lg">
                                <div className="w-12 h-12 bg-blue-500 rounded-lg mb-4 mx-auto"></div>
                                <h3 className="text-xl font-semibold mb-2">Teléfono</h3>
                                <p className="text-gray-600">
                                    +1 234 567 890<br />
                                    Lun - Vie, 9:00 - 18:00
                                </p>
                            </div>
                        </div>

                        {/* Contact Form */}
                        <ContactForm onSubmit={handleFormSubmit} />
                    </div>
                </section>

                {/* Map Section */}
                <section className="py-20 bg-gray-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="h-96 bg-gray-200 rounded-lg">
                            {/* Aquí iría el componente del mapa */}
                        </div>
                    </div>
                </section>
            </div>
        </>
    );
}