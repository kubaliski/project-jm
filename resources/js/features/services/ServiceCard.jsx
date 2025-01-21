import React from 'react';
import PropTypes from 'prop-types';
import {
    ChartBarIcon,
    CodeBracketIcon,
    ArrowTrendingUpIcon
} from '@heroicons/react/24/outline';

const ICONS = {
    chart: ChartBarIcon,
    code: CodeBracketIcon,
    'trending-up': ArrowTrendingUpIcon
};

export function ServiceCard({ service, onLearnMore }) {
    const IconComponent = ICONS[service.icon] || ChartBarIcon;

    return (
        <article
            className="bg-gray-50 rounded-lg p-6 shadow-sm transition-shadow hover:shadow-md"
            role="listitem"
        >
            <div className="w-16 h-16 bg-blue-500 rounded-lg mb-6 mx-auto flex items-center justify-center text-white">
                <IconComponent className="h-8 w-8" aria-hidden="true" />
            </div>
            <h3 className="text-xl font-semibold mb-4 text-center">
                {service.title}
            </h3>
            <p className="text-gray-600 text-center mb-6">
                {service.description}
            </p>
            <div className="text-center">
                <button
                    onClick={() => onLearnMore(service.id)}
                    className="inline-block px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    aria-label={`Más información sobre ${service.title.toLowerCase()}`}
                >
                    Más información
                </button>
            </div>
        </article>
    );
}

ServiceCard.propTypes = {
    service: PropTypes.shape({
        id: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,
        icon: PropTypes.string
    }).isRequired,
    onLearnMore: PropTypes.func.isRequired
};