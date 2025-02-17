// components/layout/PublicLayout.jsx
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import PublicBanner from './PublicBanner';
import Navbar from './Navbar';
import Footer from './Footer';
import ScrollToTop from './ScrollToTop';
import { CookieManager } from 'react-cookie-manager';
import "react-cookie-manager/style.css";
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
        <CookieManager
            className={{
                button: "px-3 py-1.5 text-sm font-medium rounded-md bg-blue-700 hover:bg-blue-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
                declineButton: "px-3 py-1.5 text-sm font-medium rounded-md bg-gray-200 hover:bg-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2",
                manageButton: "text-sm font-medium text-gray-900 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md px-2 py-1",
                saveButton: "px-3 py-1.5 text-sm font-medium rounded-md bg-blue-700 hover:bg-blue-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
                cancelButton: "px-3 py-1.5 text-sm font-medium rounded-md bg-gray-200 hover:bg-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            }}
            translations={{
                title: "Preferencias de Cookies",
                message: "Este sitio web utiliza cookies para mejorar tu experiencia. Elige qué cookies deseas permitir.",
                buttonText: "Aceptar Todas",
                declineButtonText: "Rechazar",
                manageButtonText: "Gestionar Cookies",
                privacyPolicyText: "Política de Privacidad",
                // Traducciones para el modal de gestión
                manageTitle: "Preferencias de Cookies",
                manageMessage: "Gestiona tus preferencias de cookies. Las cookies esenciales siempre están habilitadas ya que son necesarias para el funcionamiento del sitio web.",
                manageSaveButtonText: "Guardar Preferencias",
                manageCancelButtonText: "Cancelar",
                manageEssentialStatus: "Estado: siempre activo",
                manageEssentialStatusButtonText: "Siempre activo",
                // Analytics cookies section
                manageAnalyticsTitle: "Analíticas",
                manageAnalyticsSubtitle: "Ayudanos a entender cómo los visitantes interactuan con nuestra web",

                // Social cookies section
                manageSocialTitle: "Social",
                manageSocialSubtitle: "Activa implementación con redes sociales",

                // Advertising cookies section
                manageAdvertTitle: "Anunciantes",
                manageAdvertSubtitle: "Personaliza los anuncios y permite las métricas de su rendimiento",

                // Status messages
                manageCookiesStatus: "Status: {{status}} on {{date}}",
                manageCookiesStatusConsented: "Consented",
                manageCookiesStatusDeclined: "Declined",
            }}
            showManageButton={true}
            privacyPolicyUrl="/privacidad"
            theme="light"
            displayType="banner"
            position="bottom"
            onManage={(preferences) => {
                //console.log("Preferencias de cookies actualizadas:", preferences);
                // Aquí puedes implementar la lógica para manejar las preferencias
                //Aora mismo no tenemos nada
            }}
        >
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

                {/* Live Region para anuncios importantes */}
                <div
                    className="sr-only"
                    role="status"
                    aria-live="polite"
                    aria-atomic="true"
                />
            </div>
        </CookieManager>
    );
}

PublicLayout.propTypes = {
    children: PropTypes.node.isRequired,
};