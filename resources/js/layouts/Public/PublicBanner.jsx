import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
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
import {
    MARQUEE_CLASSES,
    getClassValue,
    combineClasses,
    getGradientStyle,
    getGlassStyle
} from '@features/banner/bannerCustomClasses';

const LOCAL_STORAGE_KEY = 'banner_hidden';

const MarqueeContent = ({ text }) => (
    <div className="group">
        <div
            className="whitespace-nowrap animate-marquee group-hover:[animation-play-state:paused]"
            style={{
                display: 'inline-block',
                whiteSpace: 'nowrap',
                animation: 'marquee 120s linear infinite',
                transform: 'translateX(0)'
            }}
        >
            {[...Array(15)].map((_, i) => (
                <span
                    key={i}
                    className="inline-block px-4"
                >
                    {text}
                </span>
            ))}
        </div>
        <div
            className="whitespace-nowrap animate-marquee absolute top-0 left-0 group-hover:[animation-play-state:paused]"
            style={{
                display: 'inline-block',
                whiteSpace: 'nowrap',
                animation: 'marquee 120s linear infinite',
                animationDelay: '-60s'
            }}
        >
            {[...Array(15)].map((_, i) => (
                <span
                    key={`clone-${i}`}
                    className="inline-block px-4"
                >
                    {text}
                </span>
            ))}
        </div>
    </div>
);

MarqueeContent.propTypes = {
    text: PropTypes.string.isRequired
};

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
        if (!banner?.id) return;
        localStorage.setItem(LOCAL_STORAGE_KEY, 'true');
        localStorage.setItem('banner_id', banner.id.toString());
        dispatch(setBannerHidden(true));
    };

    if (isLoading || !hasActiveBanner || isHidden) return null;

    const isMarquee = banner.custom_class === 'marquee';
    const isGradient = banner.custom_class === 'gradient';
    const isGlass = banner.custom_class === 'glass';
    const baseClasses = 'relative py-3 px-4 text-center transition-all duration-300';
    const customClasses = getClassValue(banner.custom_class);

    const backgroundStyle = isGradient
    ? getGradientStyle(banner.background_color)
    : isGlass
        ? getGlassStyle(banner.background_color)
        : { backgroundColor: banner.background_color };

    return (
        <div
            role="alert"
            aria-live="polite"
            className="w-full transition-all duration-300 relative"
            style={{ zIndex: 50 }}
        >
            <div
                style={{
                    ...backgroundStyle,
                    color: banner.text_color,
                    margin: 0
                }}
                className={combineClasses(baseClasses, customClasses)}
            >
                {isMarquee ? (
                <div className={combineClasses(
                    MARQUEE_CLASSES.container,
                    'px-8 relative overflow-hidden'
                )}>
                    <MarqueeContent text={banner.text} />
                </div>
                ) : (
                    <div
                        tabIndex={0}
                        className="focus:outline-none focus:ring-2 focus:ring-offset-2"
                        style={{
                            outlineColor: banner.text_color,
                            '--tw-ring-color': banner.text_color
                        }}
                    >
                        <span role="status" className="pr-8">
                            {banner.text}
                        </span>
                    </div>
                )}

                <button
                    onClick={handleHideBanner}
                    className={combineClasses(
                        'absolute right-2 top-1/2 -translate-y-1/2',
                        'p-2 rounded-full',
                        'hover:bg-black/10',
                        'focus:outline-none focus:ring-2 focus:ring-offset-2',
                        'transition-colors',
                        isMarquee || isGradient ? 'z-10' : ''
                    )}
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