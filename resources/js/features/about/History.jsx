import React from 'react';

export function History() {
    return (
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
    );
}