// pages/Home.jsx
import React, { lazy, Suspense } from 'react';
import { Link } from 'react-router-dom';
import { CTASection } from '@/components/common';

// Lazy loaded components
const LatestPosts = lazy(() =>
  import('@features/home/LatestPosts').then(module => ({
    default: module.default,
    __esModule: true
  }))
);

const ServiceSection = lazy(() =>
  import('@features/home/ServiceSection')
);

const TestimonialSection = lazy(() =>
  import('@features/home/TestimonialSection')
);

const AboutSection = lazy(() =>
  import('@features/home/AboutSection')
);

// Hero Component
const Hero = () => (
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
);

// Loading Fallback Component
const SectionLoading = () => (
    <div
        className="w-full py-20 bg-gray-50"
        role="status"
        aria-busy="true"
    >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="animate-pulse space-y-8">
                <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto"/>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[1, 2, 3].map((item) => (
                        <div
                            key={item}
                            className="h-64 bg-gray-200 rounded"
                            aria-hidden="true"
                        />
                    ))}
                </div>
            </div>
        </div>
    </div>
);

export default function Home() {
    return (
        <main>
            {/* Skip Link para accesibilidad */}
            <a
                href="#main-content"
                className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-white text-blue-600 p-4 z-50"
            >
                Saltar al contenido principal
            </a>

            {/* Hero Section - Critical para LCP */}
            <Hero />

            <div id="main-content" tabIndex="-1">
                {/* Servicios Section - Primera impresión importante */}
                <Suspense
                    fallback={<SectionLoading />}
                >
                    <ServiceSection />
                </Suspense>

                {/* Latest Posts - Con su propio boundary por la lógica de datos */}
                <Suspense
                    fallback={<SectionLoading />}
                >
                    <LatestPosts />
                </Suspense>

                {/* Contenido secundario agrupado */}
                <Suspense
                    fallback={<SectionLoading />}
                >
                    <AboutSection />
                    <TestimonialSection />
                </Suspense>

                {/* CTA Section - Crítico para conversiones */}
                <CTASection />
            </div>
        </main>
    );
}