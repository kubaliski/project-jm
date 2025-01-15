// components/common/CTASection.jsx
import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

/**
 * Componente de Call to Action (CTA) reutilizable
 * @component
 *
 * @param {Object} props - Las propiedades del componente
 * @param {string} [props.title="¿Listo para empezar?"] - Título principal del CTA
 * @param {string} [props.description="Únete a miles de clientes satisfechos y lleva tu negocio al siguiente nivel"] - Descripción del CTA
 * @param {string} [props.buttonText="Contáctanos ahora"] - Texto del botón
 * @param {string} [props.buttonLink="/contacto#contact-form-heading"] - URL destino del botón
 *
 * @returns {React.Component} Un componente de sección CTA
 *
 * @example
 * <CTASection
 *   title="¿Listo para trabajar juntos?"
 *   description="Únete a nuestro equipo"
 *   buttonText="Contáctanos"
 *   buttonLink="/contacto"
 * />
 */
export default function CTASection({
    title = "¿Listo para empezar?",
    description = "Únete a miles de clientes satisfechos y lleva tu negocio al siguiente nivel",
    buttonText = "Contáctanos ahora",
    buttonLink = "/contacto#contact-form-heading"
}) {
    return (
        <section
            className="py-20 bg-blue-600"
            aria-labelledby="cta-heading"
        >
            <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
                <h2
                    id="cta-heading"
                    className="text-3xl font-bold text-white mb-6"
                >
                    {title}
                </h2>
                <p className="text-xl text-blue-100 mb-8">
                    {description}
                </p>
                <Link
                    to={buttonLink}
                    className="inline-block bg-white text-blue-600 px-8 py-3 rounded-full font-semibold hover:bg-blue-50 transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-600"
                    role="button"
                >
                    {buttonText}
                </Link>
            </div>
        </section>
    );
}

CTASection.propTypes = {
    /** Título principal del CTA */
    title: PropTypes.string,
    /** Descripción del CTA */
    description: PropTypes.string,
    /** Texto que se mostrará en el botón */
    buttonText: PropTypes.string,
    /** URL a la que dirigirá el botón */
    buttonLink: PropTypes.string
};

