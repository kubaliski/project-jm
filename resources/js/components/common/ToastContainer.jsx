import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { CheckCircleIcon, XCircleIcon, ExclamationTriangleIcon, InformationCircleIcon } from '@heroicons/react/24/outline';

const TOAST_TYPES = {
    success: {
        icon: CheckCircleIcon,
        className: 'text-green-500 bg-green-50 border-green-200',
        progressClass: 'bg-green-600'
    },
    error: {
        icon: XCircleIcon,
        className: 'text-red-500 bg-red-50 border-red-200',
        progressClass: 'bg-red-600'
    },
    warning: {
        icon: ExclamationTriangleIcon,
        className: 'text-yellow-500 bg-yellow-50 border-yellow-200',
        progressClass: 'bg-yellow-600'
    },
    info: {
        icon: InformationCircleIcon,
        className: 'text-blue-500 bg-blue-50 border-blue-200',
        progressClass: 'bg-blue-600'
    }
};

const DURATION = 5000; // 5 seconds

const Toast = ({ message, type = 'info', onClose }) => {
    const config = TOAST_TYPES[type];
    const Icon = config.icon;

    const [isPaused, setIsPaused] = useState(false);
    const [progress, setProgress] = useState(100);
    const progressRef = useRef({
        startTime: Date.now(),
        pauseStartTime: null,
        totalPausedTime: 0,
        timeRemaining: DURATION
    });

    useEffect(() => {
        let animationFrame;

        const updateProgress = () => {
            if (!isPaused) {
                const now = Date.now();
                const { startTime, totalPausedTime } = progressRef.current;
                const effectiveElapsed = now - startTime - totalPausedTime;
                const remaining = Math.max(0, DURATION - effectiveElapsed);

                progressRef.current.timeRemaining = remaining;
                setProgress((remaining / DURATION) * 100);

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
            className={`relative flex items-center justify-between w-full max-w-sm p-4 mb-4 rounded-lg shadow border overflow-hidden
                ${config.className}
                transform transition-all duration-300 ease-in-out
                animate-slide-in`}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <div className="flex items-center z-10">
                <Icon className="w-6 h-6 mr-2" />
                <p className="text-sm font-medium">{message}</p>
            </div>
            <button
                onClick={onClose}
                className="ml-4 inline-flex flex-shrink-0 justify-center items-center h-4 w-4 rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-colors duration-200 z-10"
            >
                <XMarkIcon className="w-4 h-4" />
            </button>

            <div
                className={`absolute bottom-0 left-0 h-1 ${config.progressClass}`}
                style={{
                    width: `${progress}%`,
                    opacity: '0.6',
                    transition: isPaused ? 'none' : 'width 100ms linear'
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

const ToastContainer = ({ toasts, onClose }) => {
    return (
        <div className="fixed top-4 right-4 z-[9999] flex flex-col items-end space-y-4 pointer-events-none">
            <div className="flex flex-col items-end space-y-4 pointer-events-auto">
                {toasts.map((toast) => (
                    <Toast
                        key={toast.id}
                        {...toast}
                        onClose={() => onClose(toast.id)}
                    />
                ))}
            </div>
        </div>
    );
};

ToastContainer.propTypes = {
    toasts: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.number.isRequired,
            message: PropTypes.string.isRequired,
            type: PropTypes.oneOf(['success', 'error', 'warning', 'info'])
        })
    ).isRequired,
    onClose: PropTypes.func.isRequired
};

export default ToastContainer;