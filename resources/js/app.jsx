// resources/js/app.jsx
import '../css/app.css';
import './bootstrap';
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './components/App';

const container = document.getElementById('app');

if (container) {
    // Remover el loading fallback
    container.innerHTML = '';

    const root = createRoot(container);

    // Error boundary para toda la aplicación
    root.render(
        <React.StrictMode>
            <ErrorBoundary>
                <App />
            </ErrorBoundary>
        </React.StrictMode>
    );
}

// Error Boundary Component
function ErrorBoundary({ children }) {
    const [hasError, setHasError] = React.useState(false);

    React.useEffect(() => {
        const handleError = (event) => {
            setHasError(true);
            event.preventDefault();
        };

        window.addEventListener('error', handleError);
        return () => window.removeEventListener('error', handleError);
    }, []);

    if (hasError) {
        return (
            <div
                role="alert"
                className="min-h-screen flex items-center justify-center p-4"
            >
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-4">
                        Lo sentimos, algo salió mal
                    </h1>
                    <p className="mb-4">
                        Por favor, recarga la página o intenta más tarde
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