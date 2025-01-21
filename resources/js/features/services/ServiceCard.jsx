import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import {
    ChartBarIcon,
    CodeBracketIcon,
    ArrowTrendingUpIcon,
    UsersIcon
} from '@heroicons/react/24/outline';

const ICONS = {
    chart: ChartBarIcon,
    code: CodeBracketIcon,
    'trending-up': ArrowTrendingUpIcon,
    users: UsersIcon
};

export function ServiceCard({
    service,
    variant = 'button',
    onAction,
    className = ''
}) {
    const IconComponent = ICONS[service.icon] || ChartBarIcon;

    const baseCardStyles = "bg-gray-50 rounded-lg p-6 transition-all";
    const cardStyles = variant === 'link'
        ? `${baseCardStyles} hover:bg-gray-100 group block`
        : `${baseCardStyles} shadow-sm hover:shadow-md`;

    // Unificamos los estilos del contenedor de iconos
    const iconContainerStyles = "bg-blue-500 rounded-lg mb-6 flex items-center justify-center text-white transition-colors" +
        (variant === 'link'
            ? " w-12 h-12 group-hover:bg-blue-600"
            : " w-16 h-16 mx-auto");

    const iconStyles = "text-white" + (variant === 'link' ? " h-6 w-6" : " h-8 w-8");

    const titleStyles = variant === 'link'
        ? "text-xl font-semibold mb-2 group-hover:text-blue-600 transition-colors"
        : "text-xl font-semibold mb-4 text-center";

    const descriptionStyles = variant === 'link'
        ? "text-gray-600"
        : "text-gray-600 text-center mb-6";

    const CardWrapper = variant === 'link' ? Link : 'article';
    const wrapperProps = variant === 'link'
        ? { to: service.link }
        : {};

    return (
        <CardWrapper
            className={`${cardStyles} ${className}`}
            role="listitem"
            {...wrapperProps}
        >
            <div className={iconContainerStyles}>
                <IconComponent className={iconStyles} aria-hidden="true" />
            </div>
            <h3 className={titleStyles}>
                {service.title}
            </h3>
            <p className={descriptionStyles}>
                {service.description}
            </p>
            {variant === 'link' ? (
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
            ) : (
                <div className="text-center">
                    <button
                        onClick={() => onAction?.(service.id)}
                        className="inline-block px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        aria-label={`Más información sobre ${service.title.toLowerCase()}`}
                    >
                        Más información
                    </button>
                </div>
            )}
        </CardWrapper>
    );
}

ServiceCard.propTypes = {
    service: PropTypes.shape({
        id: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,
        icon: PropTypes.string,
        link: PropTypes.string
    }).isRequired,
    variant: PropTypes.oneOf(['button', 'link']),
    onAction: PropTypes.func,
    className: PropTypes.string
};