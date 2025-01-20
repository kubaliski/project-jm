// features/home/ServiceSection.jsx
import React from 'react';
import { Link } from 'react-router-dom';

// Datos extraídos para evitar re-renders
const SERVICIOS = [
    {
        title: "Desarrollo Web",
        description: "Creamos sitios web modernos y accesibles que destacan tu marca.",
        link: "/servicios#desarrollo",
        icon: "code" // Podríamos usar un enum para iconos ?
    },
    {
        title: "Marketing Digital",
        description: "Estrategias efectivas para aumentar tu presencia online.",
        link: "/servicios#marketing",
        icon: "chart"
    },
    {
        title: "Consultoría",
        description: "Asesoramiento experto para optimizar tus procesos digitales.",
        link: "/servicios#consultoria",
        icon: "users"
    }
];

const ServiceCard = React.memo(({ servicio }) => (
    <Link
        to={servicio.link}
        className="block p-6 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        role="listitem"
    >
        <div
            className="w-12 h-12 bg-blue-500 rounded-lg mb-4 group-hover:bg-blue-600 transition-colors"
            aria-hidden="true"
        />
        <h3 className="text-xl font-semibold mb-2 group-hover:text-blue-600 transition-colors">
            {servicio.title}
        </h3>
        <p className="text-gray-600">
            {servicio.description}
        </p>
        <span className="mt-4 inline-flex items-center text-blue-600 group-hover:text-blue-800 font-medium">
            <span>Saber más</span>
            <svg
                className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
            >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
        </span>
    </Link>
));

ServiceCard.displayName = 'ServiceCard';

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
                    {SERVICIOS.map((servicio, index) => (
                        <ServiceCard
                            key={servicio.link}
                            servicio={servicio}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}