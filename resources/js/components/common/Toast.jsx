import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { TOAST_TYPES, TOAST_DURATION,TOAST_CLASSES, TOAST_ANIMATION } from '@config/toast';


const Toast = ({ message, type = 'info', onClose }) => {
    const config = TOAST_TYPES[type];
    const Icon = config.icon;

    const [isPaused, setIsPaused] = useState(false);
    const [progress, setProgress] = useState(100);
    const progressRef = useRef({
        startTime: Date.now(),
        pauseStartTime: null,
        totalPausedTime: 0,
        timeRemaining: TOAST_DURATION
    });

    useEffect(() => {
        let animationFrame;

        const updateProgress = () => {
            if (!isPaused) {
                const now = Date.now();
                const { startTime, totalPausedTime } = progressRef.current;
                const effectiveElapsed = now - startTime - totalPausedTime;
                const remaining = Math.max(0, TOAST_DURATION - effectiveElapsed);

                progressRef.current.timeRemaining = remaining;
                setProgress((remaining / TOAST_DURATION) * 100);

                if (remaining <= 0) {
                    onClose();
                    return;
                }

                animationFrame = requestAnimationFrame(updateProgress);
            }
        };

        animationFrame = requestAnimationFrame(updateProgress);
        return () => cancelAnimationFrame(animationFrame);
    }, [isPaused, onClose]);

    const handleMouseEnter = () => {
        setIsPaused(true);
        progressRef.current.pauseStartTime = Date.now();
    };

    const handleMouseLeave = () => {
        if (progressRef.current.pauseStartTime) {
            const pauseDuration = Date.now() - progressRef.current.pauseStartTime;
            progressRef.current.totalPausedTime += pauseDuration;
            progressRef.current.pauseStartTime = null;
        }
        setIsPaused(false);
    };

    return (
        <div
            className={`${TOAST_CLASSES.toast} ${config.className}`}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <div className={TOAST_CLASSES.iconContainer}>
                <Icon className={TOAST_CLASSES.icon} />
                <p className={TOAST_CLASSES.message}>{message}</p>
            </div>
            <button
                onClick={onClose}
                className={TOAST_CLASSES.closeButton}
            >
                <XMarkIcon className={TOAST_CLASSES.closeIcon} />
            </button>

            <div
                className={`${TOAST_CLASSES.progressBar} ${config.progressClass}`}
                style={{
                    ...TOAST_ANIMATION.progressBarTransition(isPaused),
                    width: `${progress}%`,
                }}
            />
        </div>
    );
};

Toast.propTypes = {
    message: PropTypes.string.isRequired,
    type: PropTypes.oneOf(['success', 'error', 'warning', 'info']),
    onClose: PropTypes.func.isRequired
};

export default Toast;