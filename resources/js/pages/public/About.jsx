import React from 'react';
import { SEOManager, CTASection } from '@components/common';
import { History, ValuesSection, TeamSection } from '@/features/about';

export default function About() {
    const APP_NAME = window.APP_NAME;

    return (
        <>
            <SEOManager
                title={`${APP_NAME} | Sobre Nosotros`}
                description="Conoce nuestra historia, misión y el equipo detrás de nuestro éxito"
            />
            <main>
                {/* Hero Section */}
                <section
                    className="relative h-72 flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600 mt-20"
                    aria-labelledby="about-heading"
                >
                    <div className="text-center text-white">
                        <h1
                            id="about-heading"
                            className="text-5xl md:text-6xl font-bold mb-6"
                        >
                            Sobre Nosotros
                        </h1>
                        <p className="text-xl md:text-2xl">
                            Innovando juntos hacia el futuro
                        </p>
                    </div>
                </section>

                <History />
                <ValuesSection />
                <TeamSection />

                {/* CTA Section */}
                <CTASection
                    title="¿Listo para trabajar juntos?"
                    description="Únete a nuestra lista de clientes satisfechos y lleva tu negocio al siguiente nivel"
                />
            </main>
        </>
    );
}