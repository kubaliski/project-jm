// components/layout/PublicLayout.jsx
import React, { useEffect, Suspense, lazy } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { selectHasActiveBanner, selectBannerHidden } from '@store/landing/selectors/publicBannersSelectors';
import { fetchAppInfo } from '@/store/landing/thunks/publicAppInfoThunks';

// Componentes críticos importados directamente
import Navbar from './Navbar';
import Footer from './Footer';

// Componentes no críticos con lazy loading
const PublicBanner = lazy(() => import('./PublicBanner'));
const ScrollToTop = lazy(() => import('./ScrollToTop'));
const CookieManager = lazy(() => import('./CookieManager'));

// Componente optimizado para la carga inicial del banner
const BannerSkeleton = () => (
    <div className="h-10 bg-blue-600 animate-pulse" role="presentation" />
);

export default function PublicLayout({ children, isHomePage = false }) {
    const dispatch = useDispatch();
    const location = useLocation();
    const hasActiveBanner = useSelector(selectHasActiveBanner);
    const isHidden = useSelector(selectBannerHidden);

    // Cargar datos de la aplicación
    useEffect(() => {
        const loadData = async () => {
            try {
                // Si es la página de inicio, damos prioridad baja a la carga de datos
                if (isHomePage) {
                    // Usamos requestIdleCallback para no bloquear el renderizado inicial
                    window.requestIdleCallback(() => {
                        dispatch(fetchAppInfo());
                    });
                } else {
                    await dispatch(fetchAppInfo()).unwrap();
                }
            } catch (error) {
                console.error('Error al cargar la información: ' + error.message);
            }
        };

        loadData();
    }, [dispatch, isHomePage]);

    // Scroll to top en cambio de ruta
    useEffect(() => {
        if (!isHomePage) {
            window.scrollTo(0, 0);
        }
    }, [location.pathname, isHomePage]);

    return (
        <div
            className="min-h-screen flex flex-col"
            role="application"
            aria-label="TuMarca aplicación web"
        >
            {/* Skip Links */}
            <div role="navigation" aria-label="Saltos de navegación">
                <a
                    href="#main-content"
                    className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:p-4 focus:bg-white focus:text-blue-600 focus:rounded focus:shadow-lg"
                >
                    Saltar al contenido principal
                </a>
                <a
                    href="#footer-navigation"
                    className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-48 focus:z-[100] focus:p-4 focus:bg-white focus:text-blue-600 focus:rounded focus:shadow-lg"
                >
                    Saltar al pie de página
                </a>
            </div>

            {/* Banner con carga diferida */}
            <Suspense fallback={hasActiveBanner && !isHidden ? <BannerSkeleton /> : null}>
                <PublicBanner />
            </Suspense>

            {/* Header con Navbar - Carga inmediata por ser crítico */}
            <Navbar hasActiveBanner={hasActiveBanner && !isHidden} />

            {/* Contenido Principal */}
            <main
                id="main-content"
                className="flex-grow outline-none"
                tabIndex="-1"
                role="main"
            >
                {children}
            </main>

            {/* Footer - Carga inmediata por SEO */}
            <Footer />

            {/* Componentes no críticos con carga diferida */}
            {!isHomePage && (
                <Suspense fallback={null}>
                    <ScrollToTop />
                </Suspense>
            )}

            <Suspense fallback={null}>
                <CookieManager />
            </Suspense>

            {/* Live Region para anuncios importantes */}
            <div
                className="sr-only"
                role="status"
                aria-live="polite"
                aria-atomic="true"
            />
        </div>
    );
}

PublicLayout.propTypes = {
    children: PropTypes.node.isRequired,
    isHomePage: PropTypes.bool
};