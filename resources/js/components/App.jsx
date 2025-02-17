// resources/js/components/App.jsx
import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from '@store';
import { SkeletonLoader } from '@/components/ui/Skeletons/SkeletonLoader';
import { ScrollToTop, RouteAnnouncer } from '@/components/utils/RouterUtils';
import { publicRoutes } from '@/routes/PublicRoutes';
import { adminRoutes } from '@/routes/AdminRoutes';

// Lazy load para providers no críticos
const ToastProvider = lazy(() => import('@providers/ToastProvider'));
const SEOProvider = lazy(() => import('@providers/SEOProvider'));

// Componente para providers
const DeferredProviders = ({ children }) => {
    const location = useLocation();
    const isHome = location.pathname === '/';
    const needsToast = location.pathname === '/contacto' || location.pathname.startsWith('/admin');

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