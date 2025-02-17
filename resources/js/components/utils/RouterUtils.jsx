// resources/js/components/utils/RouterUtils.jsx
import React from 'react';
import { useLocation } from 'react-router-dom';

export function ScrollToTop() {
    const { pathname } = useLocation();

    React.useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    return null;
}

export function RouteAnnouncer() {
    const location = useLocation();
    const [announcement, setAnnouncement] = React.useState('');

    React.useEffect(() => {
        const pageName = location.pathname === '/'
            ? 'Página de inicio'
            : `Página ${location.pathname.replace('/', '')}`;

        setAnnouncement(`Navegando a ${pageName}`);
    }, [location]);

    return (
        <div
            role="status"
            aria-live="polite"
            className="sr-only"
        >
            {announcement}
        </div>
    );
}