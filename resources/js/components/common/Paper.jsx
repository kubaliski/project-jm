import React from 'react';
import PropTypes from 'prop-types';

const Paper = ({
    title,
    subtitle,
    titleLevel = 'h2',
    children,
    className = '',
    contentClassName = '',
    showDivider = true // Por defecto mostramos la línea
}) => {
    const HeadingTag = titleLevel;

    return (
        <div className={`bg-white p-6 rounded-lg shadow ${className}`}>
            {title && (
                <div className={`${children || showDivider ? 'mb-6' : ''}`}>
                    <HeadingTag className={`
                        ${titleLevel === 'h1' ? 'text-2xl' : 'text-lg'}
                        font-medium
                        text-gray-900
                    `}>
                        {title}
                    </HeadingTag>
                    {showDivider && (
                        <div className="mt-4 border-b border-gray-200" />
                    )}
                    {subtitle && (
                        <p className="mt-1 text-sm text-gray-500">
                            {subtitle}
                        </p>
                    )}
                </div>
            )}
            {children && (
                <div className={contentClassName}>
                    {children}
                </div>
            )}
        </div>
    );
};

Paper.propTypes = {
    title: PropTypes.string,
    subtitle: PropTypes.string,
    titleLevel: PropTypes.oneOf(['h1', 'h2', 'h3', 'h4', 'h5', 'h6']),
    children: PropTypes.node,
    className: PropTypes.string,
    contentClassName: PropTypes.string,
    showDivider: PropTypes.bool
};

export default Paper;