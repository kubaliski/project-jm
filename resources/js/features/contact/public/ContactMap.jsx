import React from 'react';
import { CONTACT_INFO } from './contactData';

export function ContactMap() {
    return (
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
                    {/* Aquí iría la implementación del mapa */}
                </div>
            </div>
        </section>
    );
}