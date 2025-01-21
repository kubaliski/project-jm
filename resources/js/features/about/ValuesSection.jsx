import React from 'react';
import { ValueCard } from './ValueCard';
import { COMPANY_VALUES } from './aboutData';

export function ValuesSection() {
    return (
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
                    {COMPANY_VALUES.map((value) => (
                        <ValueCard
                            key={value.id}
                            title={value.title}
                            description={value.description}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}