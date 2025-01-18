import React from 'react';
import PropTypes from 'prop-types';

const SubmitButton = ({
    isSubmitting = false,
    isUpdate = false,
    submitText = 'Crear',
    updateText = 'Actualizar',
    loadingText = 'Guardando...',
    className = '',
    ...props
}) => {
    const defaultClassName = `px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium
        text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2
        focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed`;

    return (
        <button
            type="submit"
            disabled={isSubmitting}
            className={className || defaultClassName}
            {...props}
        >
            {isSubmitting ? (
                <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                        />
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                    </svg>
                    {loadingText}
                </span>
            ) : (
                isUpdate ? updateText : submitText
            )}
        </button>
    );
};

SubmitButton.propTypes = {
    isSubmitting: PropTypes.bool,
    isUpdate: PropTypes.bool,
    submitText: PropTypes.string,
    updateText: PropTypes.string,
    loadingText: PropTypes.string,
    className: PropTypes.string
};

export default SubmitButton;