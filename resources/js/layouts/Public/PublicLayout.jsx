// components/layout/PublicLayout.jsx
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import PublicBanner from './PublicBanner';
import Navbar from './Navbar';
import Footer from './Footer';
import ScrollToTop from './ScrollToTop';
import CookieManager from './CookieManager';
import { selectHasActiveBanner,selectBannerHidden } from '@store/landing/selectors/publicBannersSelectors';
import { fetchAppInfo} from '@/store/landing/thunks/publicAppInfoThunks';



export default function PublicLayout({ children }) {
    const dispatch = useDispatch();
    const location = useLocation();
    const hasActiveBanner = useSelector(selectHasActiveBanner);
    const isHidden = useSelector(selectBannerHidden);

    useEffect(() => {
        const loadData = async () => {
            try {
                await dispatch(fetchAppInfo()).unwrap();
            } catch (error) {
                console.error('Error al cargar la información: ' + error.message);
            }
        };

        loadData();
    }, [dispatch]);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location.pathname]);

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


            {/* Banner */}
            <PublicBanner />

            {/* Header con Navbar */}
            <Navbar  hasActiveBanner={hasActiveBanner && !isHidden}/>

            {/* Scroll To Top Button */}
            <ScrollToTop />

            {/* Contenido Principal */}
            <main
                id="main-content"
                className="flex-grow outline-none"
                tabIndex="-1"
                role="main"
            >
                {children}
            </main>

            {/* Footer */}
            <Footer />

            {/* Cookie Manager - Fuera del flujo principal */}
            <CookieManager />

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
};