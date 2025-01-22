import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { XMarkIcon } from '@heroicons/react/24/solid';
import {
    selectActiveBanner,
    selectPublicBannersLoading,
    selectHasActiveBanner,
    selectBannerHidden
} from '@store/landing/selectors/publicBannersSelectors';
import { fetchActiveBanner } from '@store/landing/thunks/publicBannersThunks';
import { setBannerHidden } from '@store/landing/slices/publicBannersSlice';

const LOCAL_STORAGE_KEY = 'banner_hidden';

export default function PublicBanner() {
    const dispatch = useDispatch();
    const banner = useSelector(selectActiveBanner);
    const isLoading = useSelector(selectPublicBannersLoading);
    const hasActiveBanner = useSelector(selectHasActiveBanner);
    const isHidden = useSelector(selectBannerHidden);

    useEffect(() => {
        const storedHiddenState = localStorage.getItem(LOCAL_STORAGE_KEY);

        if (banner?.id) {
            const storedBannerId = localStorage.getItem('banner_id');
            if (storedBannerId !== banner.id.toString()) {
                localStorage.setItem(LOCAL_STORAGE_KEY, 'false');
                localStorage.setItem('banner_id', banner.id);
                dispatch(setBannerHidden(false));
                return;
            }
        }

        if (storedHiddenState !== null) {
            dispatch(setBannerHidden(JSON.parse(storedHiddenState)));
        }

        dispatch(fetchActiveBanner());
    }, [dispatch, banner?.id]);

    const handleHideBanner = () => {
        localStorage.setItem(LOCAL_STORAGE_KEY, 'true');
        localStorage.setItem('banner_id', banner.id.toString());
        dispatch(setBannerHidden(true));
    };

    // Si no hay banner activo, está cargando o está oculto, no renderizamos nada
    if (isLoading || !hasActiveBanner || isHidden) return null;

    return (
        <div
            role="alert"
            aria-live="polite"
            className="w-full transition-all duration-300 relative h-0" // Añadir h-0
            style={{ zIndex: 50, height: isHidden ? '0' : 'auto' }} // Controlar altura
        >
            <div
                style={{
                    backgroundColor: banner.background_color,
                    color: banner.text_color,
                    margin:0
                }}
                className="py-3 px-4 text-center"
            >
                {/* Control de foco para lectores de pantalla */}
                <div
                    tabIndex={0}
                    className="focus:outline-none focus:ring-2 focus:ring-offset-2"
                    style={{
                        outlineColor: banner.text_color,
                        '--tw-ring-color': banner.text_color
                    }}
                >
                    {/* Contenedor semántico para el mensaje */}
                    <span role="status" className="pr-8">
                        {banner.text}
                    </span>
                </div>

                {/* Botón de cerrar */}
                <button
                    onClick={handleHideBanner}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full hover:bg-black/10 focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors"
                    style={{
                        '--tw-ring-color': banner.text_color
                    }}
                    aria-label="Cerrar banner"
                >
                    <XMarkIcon
                        className="h-5 w-5"
                        style={{ color: banner.text_color }}
                        aria-hidden="true"
                    />
                </button>
            </div>
        </div>
    );
}