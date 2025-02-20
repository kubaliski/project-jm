// pages/Home.jsx
import React, { lazy, Suspense } from 'react';
import Hero from '@/features/home/Hero';

// Importación directa del CTA ya que es pequeño y crítico para conversiones
import { CTASection } from '@/components/common';

// Componente de carga optimizado que solo se construye una vez
const SectionLoading = () => (
    <div
        className="w-full py-16 bg-gray-50"
        role="status"
        aria-busy="true"
    >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="animate-pulse space-y-6">
                <div className="h-6 bg-gray-200 rounded w-1/4"/>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[1, 2, 3].map((item) => (
                        <div
                            key={item}
                            className="h-48 bg-gray-200 rounded"
                            aria-hidden="true"
                        />
                    ))}
                </div>
            </div>
        </div>
    </div>
);

// Lazy loading con preload para secciones importantes
const ServiceSection = lazy(() => {
    // Preload del chunk de servicios
    const preloadServiceChunk = () => import('@features/home/ServiceSection');
    preloadServiceChunk();
    return import('@features/home/ServiceSection');
});

// Lazy loading regular para componentes menos críticos
const LatestPosts = lazy(() => import('@features/home/LatestPosts'));
const AboutSection = lazy(() => import('@features/home/AboutSection'));
const TestimonialSection = lazy(() => import('@features/home/TestimonialSection'));

// Componente para contenido diferido agrupado por prioridad
const DeferredContent = () => (
    <>
        {/* Primera prioridad: Servicios */}
        <Suspense fallback={<SectionLoading />}>
            <ServiceSection />
        </Suspense>

        {/* Segunda prioridad: Posts recientes */}
        <Suspense fallback={<SectionLoading />}>
            <LatestPosts />
        </Suspense>

        {/* Tercera prioridad: Contenido de soporte */}
        <Suspense fallback={<SectionLoading />}>
            <AboutSection />
            <TestimonialSection />
        </Suspense>
    </>
);

const Home = () => {
    return (
        <main>
            {/* Skip Link para accesibilidad */}
            <a
                href="#main-content"
                className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-white text-blue-600 p-4 z-50"
            >
                Saltar al contenido principal
            </a>

            {/* Hero Section - Carga inmediata */}
            <Hero />

            {/* Contenido Principal */}
            <div id="main-content" className="relative" tabIndex="-1">
                <Suspense fallback={<SectionLoading />}>
                    <DeferredContent />
                </Suspense>

                {/* CTA Section - Carga inmediata por ser crítico para conversiones */}
                <CTASection />
            </div>
        </main>
    );
};

// Evitamos re-renders innecesarios
export default React.memo(Home);