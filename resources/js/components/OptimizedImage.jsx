import React, { useState } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';

const OptimizedImage = ({
    image,
    variant = 'original',
    alt,
    className,
    containerClassName,
    priority = false,
    blur = true,
    objectFit = 'cover'
}) => {
    const [loaded, setLoaded] = useState(false);
    const [error, setError] = useState(false);

    if (!image?.formats) {
        return (
            <div
                className={clsx(
                    'bg-gray-200 flex items-center justify-center',
                    containerClassName
                )}
            >
                <svg
                    className="w-12 h-12 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                </svg>
            </div>
        );
    }

    const { formats } = image;

    // Determinar las URLs para WebP y formato original
    const webpUrl = formats[`${variant}_webp`] || formats.webp;
    const fallbackUrl = formats[variant] || formats.original;

    // Construir las URLs completas
    const baseUrl = window.location.origin + '/storage/';
    const fullWebpUrl = baseUrl + webpUrl;
    const fullFallbackUrl = baseUrl + fallbackUrl;

    return (
        <div
            className={clsx(
                'relative overflow-hidden',
                !loaded && blur && 'blur-xs',
                containerClassName
            )}
        >
            <picture>
                {/* WebP */}
                <source
                    type="image/webp"
                    srcSet={fullWebpUrl}
                />
                {/* Formato original */}
                <img
                    src={fullFallbackUrl}
                    alt={alt}
                    className={clsx(
                        'transition-all duration-300',
                        !loaded && 'opacity-0',
                        loaded && 'opacity-100',
                        objectFit === 'cover' && 'object-cover w-full h-full',
                        objectFit === 'contain' && 'object-contain',
                        className
                    )}
                    loading={priority ? 'eager' : 'lazy'}
                    onLoad={() => {
                        setLoaded(true);
                    }}
                    onError={(e) => {
                        console.error('OptimizedImage - Error loading image:', e);
                        setError(true);
                        setLoaded(true);
                    }}
                />
            </picture>

            {/* Blur Placeholder */}
            {!loaded && blur && (
                <div
                    className="absolute inset-0 bg-gray-200 animate-pulse"
                    aria-hidden="true"
                />
            )}

            {/* Error Fallback */}
            {error && (
                <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
                    <span className="text-sm text-gray-500">Error al cargar la imagen</span>
                </div>
            )}
        </div>
    );
};

OptimizedImage.propTypes = {
    image: PropTypes.shape({
        formats: PropTypes.object.isRequired,
        metadata: PropTypes.object
    }),
    variant: PropTypes.oneOf(['thumbnail', 'card', 'featured', 'original']),
    alt: PropTypes.string.isRequired,
    className: PropTypes.string,
    containerClassName: PropTypes.string,
    priority: PropTypes.bool,
    blur: PropTypes.bool,
    objectFit: PropTypes.oneOf(['cover', 'contain'])
};

export default OptimizedImage;