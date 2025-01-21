import React from 'react';
import PropTypes from 'prop-types';

export function ValueCard({ title, description }) {
    return (
        <div
            className="bg-white p-8 rounded-lg shadow-sm"
            role="listitem"
        >
            <div
                className="w-16 h-16 bg-blue-500 rounded-lg mb-6 mx-auto"
                aria-hidden="true"
            />
            <h3 className="text-xl font-semibold mb-4 text-center">
                {title}
            </h3>
            <p className="text-gray-600 text-center">
                {description}
            </p>
        </div>
    );
}

ValueCard.propTypes = {
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired
};