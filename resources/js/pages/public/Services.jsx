import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { SEOManager, CTASection } from '@components/common';
import { ServiceCard } from '@features/services/ServiceCard';
import { ServiceDetail } from '@features/services/ServiceDetail';
import { SERVICES_DATA  } from '@features/services/servicesData';

export default function Services() {
    const location = useLocation();
    const detailsRef = useRef({});

    const scrollToElement = (element, offset = 0) => {
        if (!element) return;

        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;

        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });

        // Enfocamos después del scroll para asegurar la accesibilidad
        setTimeout(() => {
            element.focus();
        }, 800); // Esperamos a que termine la animación del scroll
    };

    const handleLearnMore = (serviceId) => {
        const element = detailsRef.current[serviceId];
        if (element) {
            scrollToElement(element, 100); // Ajustamos el offset para mejor precisión
            window.history.pushState(null, '', `#${serviceId}`);
        }
    };

    useEffect(() => {
        // Manejamos el scroll inicial cuando hay un hash en la URL
        if (location.hash) {
            const id = location.hash.slice(1);
            const element = detailsRef.current[id];

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
                title="TuMarca | Servicios"
                description="Descubre nuestra amplia gama de servicios profesionales diseñados para impulsar tu negocio"
            />

            {/* Live Region para anuncios */}
            <div
                className="sr-only"
                role="status"
                aria-live="polite"
                aria-atomic="true"
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
                            {SERVICES_DATA.featured.map((service) => (
                                <ServiceCard
                                    key={service.id}
                                    service={service}
                                    variant="button"
                                    onAction={handleLearnMore}
                                />
                            ))}
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
                            {SERVICES_DATA.featured.map((service) => (
                                <div
                                    key={service.id}
                                    ref={el => detailsRef.current[service.id] = el}
                                    className="scroll-mt-32"
                                >
                                    <ServiceDetail service={service} />
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <CTASection
                    title="¿Listo para impulsar tu negocio?"
                    description="Descubre cómo nuestros servicios pueden ayudarte a alcanzar tus objetivos"
                    buttonText="Contacta con nosotros"
                    buttonLink="/contacto"
                />
            </main>
        </>
    );
}