import React from 'react';
import PropTypes from 'prop-types';

export function ErrorBoundary({ children }) {
    const [hasError, setHasError] = React.useState(false);
    const [errorDetails, setErrorDetails] = React.useState(null);

    React.useEffect(() => {
        const handleError = (event) => {
            console.error('Error capturado por ErrorBoundary:', {
                message: event.error?.message,
                stack: event.error?.stack,
                type: event.type,
                timestamp: new Date().toISOString()
            });
            setErrorDetails(event.error);
            setHasError(true);
            event.preventDefault();
        };

        window.addEventListener('error', handleError);
        return () => window.removeEventListener('error', handleError);
    }, []);

    if (hasError) {
        return (
            <div role="alert" className="min-h-screen flex items-center justify-center p-4">
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-4">
                        Lo sentimos, algo salió mal
                    </h1>
                    <p className="mb-4">
                        Error: {errorDetails?.message || 'Error desconocido'}
                    </p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                        Recargar página
                    </button>
                </div>
            </div>
        );
    }

    return children;
}

ErrorBoundary.propTypes = {
    children: PropTypes.node.isRequired
};