// resources/js/utils/registerSW.js
export const registerSW = async () => {
    try {
        if (!('serviceWorker' in navigator)) {
            console.log('Service Worker no soportado');
            return null;
        }

        const registration = await navigator.serviceWorker.register('/build/sw.js', {
            scope: '/'
        });

        // Manejar actualizaciones
        registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;

            newWorker.addEventListener('statechange', () => {
                switch (newWorker.state) {
                    case 'installed':
                        if (navigator.serviceWorker.controller) {
                            // Hay una nueva versión disponible
                            window.dispatchEvent(new CustomEvent('sw:update'));
                        }
                        break;
                }
            });
        });

        // Escuchar por actualizaciones
        let refreshing = false;
        navigator.serviceWorker.addEventListener('controllerchange', () => {
            if (!refreshing) {
                refreshing = true;
                window.location.reload();
            }
        });

        return registration;
    } catch (error) {
        console.error('Error al registrar el Service Worker:', error);
        return null;
    }
};