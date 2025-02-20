import '../css/app.css';
import './bootstrap';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { ErrorBoundary } from '@components/ErrorBoundary';
import App from './components/App';
import { registerSW } from '@/utils/registerSW';

const container = document.getElementById('app');

// Registrar Service Worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        registerSW();
    });
}

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