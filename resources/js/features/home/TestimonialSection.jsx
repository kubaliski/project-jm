import React from 'react';
import PropTypes from 'prop-types';

const TESTIMONIOS = [
    {
        name: "María García",
        company: "Innovatech",
        testimonial: "El servicio y atención han sido excepcionales. Han transformado completamente nuestra presencia digital.",
        avatarAlt: "Foto de María García"
    },
    {
        name: "Carlos Rodríguez",
        company: "Digital Solutions",
        testimonial: "Su experiencia y profesionalidad nos han ayudado a alcanzar nuestros objetivos de negocio.",
        avatarAlt: "Foto de Carlos Rodríguez"
    },
    {
        name: "Ana Martínez",
        company: "CreativeStudio",
        testimonial: "Un equipo altamente competente que entiende perfectamente las necesidades del cliente.",
        avatarAlt: "Foto de Ana Martínez"
    }
];

const TestimonialCard = React.memo(({ testimonial }) => (
    <div role="listitem">
        <article className="p-6 bg-white rounded-lg shadow-lg">
            <div className="flex items-center mb-4">
                <div
                    className="w-12 h-12 bg-gray-200 rounded-full"
                    role="img"
                    aria-label={testimonial.avatarAlt}
                />
                <div className="ml-4">
                    <h3 className="font-semibold">{testimonial.name}</h3>
                    <p className="text-gray-500">{testimonial.company}</p>
                </div>
            </div>
            <blockquote>
                <p className="text-gray-600">&ldquo;{testimonial.testimonial}&rdquo;</p>
            </blockquote>
        </article>
    </div>
));

TestimonialCard.propTypes = {
    testimonial: PropTypes.shape({
        name: PropTypes.string.isRequired,
        company: PropTypes.string.isRequired,
        testimonial: PropTypes.string.isRequired,
        avatarAlt: PropTypes.string.isRequired
    }).isRequired
};

TestimonialCard.displayName = 'TestimonialCard';

export default function TestimonialSection() {
    return (
        <section
            className="py-20 bg-gray-50"
            aria-labelledby="testimonios-heading"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2
                    id="testimonios-heading"
                    className="text-3xl font-bold text-center mb-12"
                >
                    Lo que dicen nuestros clientes
                </h2>
                <div
                    className="grid grid-cols-1 md:grid-cols-3 gap-8"
                    role="list"
                    aria-label="Lista de testimonios de clientes"
                >
                    {TESTIMONIOS.map((testimonial) => (
                        <TestimonialCard
                            key={testimonial.name}
                            testimonial={testimonial}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}