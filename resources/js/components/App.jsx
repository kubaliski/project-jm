// resources/js/components/App.jsx
import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from '@store';
import { SkeletonLoader } from '@/components/ui/Skeletons/SkeletonLoader';
import { ScrollToTop, RouteAnnouncer } from '@/components/utils/RouterUtils';
import { publicRoutes } from '@/routes/PublicRoutes';
import { adminRoutes } from '@/routes/AdminRoutes';
import { useConnection } from '@/hooks/useConnection';

// Lazy load para providers no críticos
const ToastProvider = lazy(() => import('@providers/ToastProvider'));
const SEOProvider = lazy(() => import('@providers/SEOProvider'));

// Componente para el estado de conexión
const ConnectionStatus = () => {
    const { isOnline } = useConnection();

    if (isOnline) return null;

    return (
        <div className="fixed bottom-4 right-4 z-50 bg-yellow-100 border-l-4 border-yellow-500 p-4">
            <div className="flex items-center">
                <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-yellow-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                </div>
                <div className="ml-3">
                    <p className="text-sm text-yellow-700">
                        Sin conexión. Algunas funciones pueden no estar disponibles.
                    </p>
                </div>
            </div>
        </div>
    );
};

// Componente para providers
const DeferredProviders = ({ children }) => {
    const location = useLocation();
    const isHome = location.pathname === '/';
    const needsToast = location.pathname === '/contacto' ||
                      location.pathname.startsWith('/admin') ||
                      location.pathname === '/login' ||
                      location.pathname === '/reset-password';

    if (isHome) {
        return (
            <>
                {children}
                <Suspense fallback={null}>
                    <SEOProvider />
                </Suspense>
            </>
        );
    }

    if (needsToast) {
        return (
            <Suspense fallback={null}>
                <ToastProvider>
                    <SEOProvider>
                        {children}
                    </SEOProvider>
                </ToastProvider>
            </Suspense>
        );
    }

    return (
        <Suspense fallback={null}>
            <SEOProvider>
                {children}
            </SEOProvider>
        </Suspense>
    );
};

export default function App() {
    return (
        <Provider store={store}>
            <BrowserRouter>
                <ScrollToTop />
                <RouteAnnouncer />
                <ConnectionStatus />

                <Routes>
                    {/* Ruta principal */}
                    <Route
                        path="/"
                        element={
                            <Suspense fallback={<SkeletonLoader />}>
                                <DeferredProviders>
                                    {publicRoutes[0].element}
                                </DeferredProviders>
                            </Suspense>
                        }
                    />

                    {/* Resto de rutas públicas */}
                    {publicRoutes.slice(1).map(route => (
                        <Route
                            key={route.path}
                            path={route.path}
                            element={
                                <Suspense fallback={<SkeletonLoader />}>
                                    <DeferredProviders>
                                        {route.element}
                                    </DeferredProviders>
                                </Suspense>
                            }
                        />
                    ))}

                    {/* Rutas administrativas */}
                    {adminRoutes.map(route => (
                        <Route
                            key={route.path}
                            path={route.path}
                            element={
                                <Suspense fallback={<SkeletonLoader />}>
                                    <DeferredProviders>
                                        {route.element}
                                    </DeferredProviders>
                                </Suspense>
                            }
                        />
                    ))}
                </Routes>
            </BrowserRouter>
        </Provider>
    );
}