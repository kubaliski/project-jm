// pages/Contact.jsx
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { SEOManager } from '@components/common';
import { ContactForm, ContactInfo, ContactMap } from '@/features/contact/public';

export default function Contact() {
    const APP_NAME = window.APP_NAME;
    const location = useLocation();

    const scrollToElement = (element, offset = 0) => {
        if (!element) return;

        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;

        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    };

    useEffect(() => {
        if (location.hash) {
            const id = location.hash.slice(1);
            const element = document.getElementById(id);

            // Esperamos a que el DOM esté completamente cargado
            setTimeout(() => {
                if (element) {
                    scrollToElement(element, 100);
                }
            }, 100);
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
                        <ContactInfo />

                        {/* Contact Form */}
                        <section
                            aria-labelledby="contact-form-heading"
                            className="scroll-mt-32" // Agregamos scroll margin
                        >
                            <h2
                                id="contact-form-heading"
                                className="sr-only"
                            >
                                Formulario de contacto
                            </h2>
                            <ContactForm />
                        </section>
                    </div>
                </section>

                {/* Map Section */}
                <ContactMap />
            </main>
        </>
    );
}