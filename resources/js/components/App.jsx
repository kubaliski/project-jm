// resources/js/components/App.jsx
import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from '@store';
import { SEOProvider, ToastProvider } from '@providers';
import { SkeletonLoader } from '@/components/ui/Skeletons/SkeletonLoader';
import { ScrollToTop, RouteAnnouncer } from '@/components/utils/RouterUtils';
import { publicRoutes } from '@/routes/publicRoutes';
import { adminRoutes } from '@/routes/adminRoutes';

/**
 * Componente principal de la aplicación
 * Configura el enrutamiento y los providers necesarios
 */
export default function App() {
    return (
        <Provider store={store}>
            <BrowserRouter>
                {/* Manejo de scroll y anuncios de ruta para accesibilidad */}
                <ScrollToTop />
                <RouteAnnouncer />

                {/* Providers para funcionalidades globales */}
                <ToastProvider>
                    <SEOProvider>
                        {/*
                            Suspense para manejar la carga lazy de componentes
                            Muestra un skeleton loader mientras se cargan
                        */}
                        <Suspense fallback={<SkeletonLoader />}>
                            <Routes>
                                {/* Rutas públicas */}
                                {publicRoutes.map(route => (
                                    <Route
                                        key={route.path}
                                        path={route.path}
                                        element={route.element}
                                    />
                                ))}

                                {/* Rutas administrativas */}
                                {adminRoutes.map(route => (
                                    <Route
                                        key={route.path}
                                        path={route.path}
                                        element={route.element}
                                    />
                                ))}
                            </Routes>
                        </Suspense>
                    </SEOProvider>
                </ToastProvider>
            </BrowserRouter>
        </Provider>
    );
}