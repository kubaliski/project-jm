// pages/Contact.jsx
import React, { useState } from 'react';
import {SEOManager} from '@components/common';

export default function Contact() {

    const APP_NAME = window.APP_NAME;
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });


    const handleSubmit = (e) => {
        e.preventDefault();
        // Aquí iría la lógica de envío del formulario
        console.log('Form submitted:', formData);
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
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
                        <div className="max-w-3xl mx-auto">
                            <h2 className="text-3xl font-bold text-center mb-12">Envíanos un mensaje</h2>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                            Nombre completo
                                        </label>
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                            Correo electrónico
                                        </label>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            required
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                                        Asunto
                                    </label>
                                    <input
                                        type="text"
                                        id="subject"
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                                        Mensaje
                                    </label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        rows="6"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        required
                                    ></textarea>
                                </div>
                                <div className="text-center">
                                    <button
                                        type="submit"
                                        className="bg-blue-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-blue-700 transition-colors"
                                    >
                                        Enviar mensaje
                                    </button>
                                </div>
                            </form>
                        </div>
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