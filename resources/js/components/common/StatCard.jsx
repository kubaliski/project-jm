import React from 'react';
import PropTypes from 'prop-types';

export default function StatCard({ title, value, color, description, isLoading }) {
    return (
        <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
                <div className="flex-1">
                    <h3 className="text-lg font-medium text-gray-900">{title}</h3>
                    <div className={`mt-1 text-3xl font-semibold text-${color}-600`}>
                        {isLoading ? (
                            <div className="animate-pulse h-8 w-16 bg-gray-200 rounded"></div>
                        ) : (
                            value
                        )}
                    </div>
                </div>
            </div>
            <p className="mt-4 text-sm text-gray-600">
                {description}
            </p>
        </div>
    );
}

StatCard.propTypes = {
    title: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    color: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    isLoading: PropTypes.bool
};

