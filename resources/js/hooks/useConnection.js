// resources/js/hooks/useConnection.js
import { useState, useEffect } from 'react';

export const useConnection = () => {
    const [isOnline, setIsOnline] = useState(navigator.onLine);
    const [hasServiceWorker, setHasServiceWorker] = useState(false);

    useEffect(() => {
        const handleOnline = () => {
            setIsOnline(true);
            // Intentar resincronizar datos si es necesario
            window.dispatchEvent(new CustomEvent('app:online'));
        };

        const handleOffline = () => {
            setIsOnline(false);
            window.dispatchEvent(new CustomEvent('app:offline'));
        };

        // Verificar Service Worker
        const checkServiceWorker = async () => {
            if ('serviceWorker' in navigator) {
                const registration = await navigator.serviceWorker.getRegistration();
                setHasServiceWorker(!!registration);
            }
        };

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);
        checkServiceWorker();

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    return {
        isOnline,
        hasServiceWorker
    };
};