import React from 'react';
import PropTypes from 'prop-types';
import { MapPinIcon, EnvelopeIcon, PhoneIcon } from '@heroicons/react/24/outline';

const ICONS = {
    location: MapPinIcon,
    email: EnvelopeIcon,
    phone: PhoneIcon
};

export function ContactInfoCard({ type, title, content }) {
    const IconComponent = ICONS[type] || MapPinIcon;

    return (
        <div
            className="text-center p-6 bg-gray-50 rounded-lg"
            role="listitem"
        >
            <div className="w-12 h-12 bg-blue-500 rounded-lg mb-4 mx-auto flex items-center justify-center text-white">
                <IconComponent className="h-6 w-6" aria-hidden="true" />
            </div>
            <h3 className="text-xl font-semibold mb-2">{title}</h3>
            {content}
        </div>
    );
}

ContactInfoCard.propTypes = {
    type: PropTypes.oneOf(['location', 'email', 'phone']).isRequired,
    title: PropTypes.string.isRequired,
    content: PropTypes.node.isRequired
};