// pages/About.jsx
import React from 'react';
import { SEOManager } from '@components/common';
import { CTASection } from '@/components/common';

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

                {/* Historia y Misión */}
                <section
                    className="py-20 bg-white"
                    aria-labelledby="historia-heading"
                >
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                            <div
                                className="bg-gray-100 h-96 rounded-lg"
                                role="img"
                                aria-label="Nuestra historia en imágenes"
                            />
                            <div>
                                <h2
                                    id="historia-heading"
                                    className="text-3xl font-bold mb-6"
                                >
                                    Nuestra Historia
                                </h2>
                                <p className="text-gray-600 mb-6">
                                    Desde nuestros inicios en 2010, nos hemos dedicado a
                                    transformar ideas en soluciones digitales innovadoras.
                                    Lo que comenzó como un pequeño equipo de soñadores se
                                    ha convertido en una empresa líder en soluciones digitales.
                                </p>
                                <p className="text-gray-600 mb-6">
                                    A lo largo de nuestra trayectoria, hemos ayudado a
                                    cientos de empresas a alcanzar sus objetivos digitales,
                                    siempre manteniéndonos fieles a nuestros valores de
                                    innovación, calidad y compromiso con el cliente.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Misión, Visión y Valores */}
                <section
                    className="py-20 bg-gray-50"
                    aria-labelledby="valores-heading"
                >
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h2
                            id="valores-heading"
                            className="text-3xl font-bold text-center mb-12"
                        >
                            Nuestros Valores
                        </h2>
                        <div
                            className="grid grid-cols-1 md:grid-cols-3 gap-8"
                            role="list"
                        >
                            {[
                                {
                                    title: "Misión",
                                    description: "Transformar el panorama digital mediante soluciones innovadoras que impulsen el éxito de nuestros clientes."
                                },
                                {
                                    title: "Visión",
                                    description: "Ser líderes globales en transformación digital, reconocidos por nuestra excelencia e innovación."
                                },
                                {
                                    title: "Valores",
                                    description: "Integridad, innovación, excelencia y compromiso con el éxito de nuestros clientes."
                                }
                            ].map((item, index) => (
                                <div
                                    key={index}
                                    className="bg-white p-8 rounded-lg shadow-sm"
                                    role="listitem"
                                >
                                    <div
                                        className="w-16 h-16 bg-blue-500 rounded-lg mb-6 mx-auto"
                                        aria-hidden="true"
                                    />
                                    <h3 className="text-xl font-semibold mb-4 text-center">
                                        {item.title}
                                    </h3>
                                    <p className="text-gray-600 text-center">
                                        {item.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Equipo */}
                <section
                    className="py-20 bg-white"
                    aria-labelledby="equipo-heading"
                >
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h2
                            id="equipo-heading"
                            className="text-3xl font-bold text-center mb-12"
                        >
                            Nuestro Equipo
                        </h2>
                        <div
                            className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8"
                            role="list"
                        >
                            {[
                                {
                                    name: "Ana García",
                                    position: "CEO & Fundadora",
                                    description: "Más de 15 años de experiencia en tecnología"
                                },
                                {
                                    name: "Carlos Rodríguez",
                                    position: "Director Técnico",
                                    description: "Especialista en arquitectura de software"
                                },
                                {
                                    name: "Laura Martínez",
                                    position: "Directora de Marketing",
                                    description: "Experta en estrategias digitales"
                                },
                                {
                                    name: "David Sánchez",
                                    position: "Director de Innovación",
                                    description: "Pionero en soluciones tecnológicas"
                                }
                            ].map((member, index) => (
                                <div
                                    key={index}
                                    className="text-center"
                                    role="listitem"
                                >
                                    <div
                                        className="w-48 h-48 bg-gray-200 rounded-full mx-auto mb-4"
                                        role="img"
                                        aria-label={`Foto de ${member.name}`}
                                    />
                                    <h3 className="text-xl font-semibold mb-2">
                                        {member.name}
                                    </h3>
                                    <p className="text-blue-600 font-medium mb-2">
                                        {member.position}
                                    </p>
                                    <p className="text-gray-600">
                                        {member.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <CTASection
                    title="¿Listo para trabajar juntos?"
                    description="Únete a nuestra lista de clientes satisfechos y lleva tu negocio al siguiente nivel"
                />
            </main>
        </>
    );
}