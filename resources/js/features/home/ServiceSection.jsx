import React from 'react';
import { ServiceCard , SERVICES_DATA } from '../services';
export default function ServiceSection() {
    return (
        <section
            className="py-20 bg-white"
            aria-labelledby="servicios-heading"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2
                    id="servicios-heading"
                    className="text-3xl font-bold text-center mb-12"
                >
                    Nuestros Servicios
                </h2>
                <div
                    className="grid grid-cols-1 md:grid-cols-3 gap-8"
                    role="list"
                >
                    {SERVICES_DATA.featured.map((service) => (
                        <ServiceCard
                            key={service.id}
                            service={service}
                            variant="link"
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}