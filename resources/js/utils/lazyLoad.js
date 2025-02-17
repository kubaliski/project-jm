// resources/js/utils/lazyLoad.js
import React from 'react';

export function lazyWithRetry(componentImport) {
    return React.lazy(() => {
        return new Promise((resolve, reject) => {
            componentImport()
                .then(resolve)
                .catch((error) => {
                    // Reintentar una vez después de 1.5 segundos
                    setTimeout(() => {
                        componentImport()
                            .then(resolve)
                            .catch(reject);
                    }, 1500);
                });
        });
    });
}