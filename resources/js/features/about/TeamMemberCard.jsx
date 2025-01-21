import React from 'react';
import PropTypes from 'prop-types';

export function TeamMemberCard({ name, position, description }) {
    return (
        <div
            className="text-center"
            role="listitem"
        >
            <div
                className="w-48 h-48 bg-gray-200 rounded-full mx-auto mb-4"
                role="img"
                aria-label={`Foto de ${name}`}
            />
            <h3 className="text-xl font-semibold mb-2">
                {name}
            </h3>
            <p className="text-blue-600 font-medium mb-2">
                {position}
            </p>
            <p className="text-gray-600">
                {description}
            </p>
        </div>
    );
}

TeamMemberCard.propTypes = {
    name: PropTypes.string.isRequired,
    position: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired
};