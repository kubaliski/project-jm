// components/services/ServiceDetail.jsx
import React from 'react';
import PropTypes from 'prop-types';

export function ServiceDetail({ service }) {
    return (
        <div
            id={service.id}
            className="bg-white rounded-lg p-8 shadow-sm scroll-mt-24"
            tabIndex="-1"
        >
            <h3 className="text-2xl font-semibold mb-4">
                {service.title}
            </h3>
            <p className="text-gray-600 mb-6">
                {service.details.description}
            </p>
            <ul
                className="list-disc list-inside text-gray-600 space-y-2"
                aria-label={`Beneficios de ${service.title.toLowerCase()}`}
            >
                {service.details.benefits.map((benefit, index) => (
                    <li key={index}>{benefit}</li>
                ))}
            </ul>
        </div>
    );
}

ServiceDetail.propTypes = {
    service: PropTypes.shape({
        id: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        details: PropTypes.shape({
            description: PropTypes.string.isRequired,
            benefits: PropTypes.arrayOf(PropTypes.string).isRequired
        }).isRequired
    }).isRequired
};