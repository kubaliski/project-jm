import React, { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import PropTypes from 'prop-types';
import { ToastContainer } from '@components/common';
import { ToastContext } from '@context/ToastContext';

const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);
    const timeoutsRef = useRef([]);

    useEffect(() => {
        return () => {
            timeoutsRef.current.forEach(clearTimeout);
            timeoutsRef.current = [];
        };
    }, []);

    const addToast = useCallback((message, type = 'info') => {
        const id = Date.now();
        setToasts(prevToasts => {
            const newToasts = [...prevToasts, { id, message, type }];
            return newToasts;
        });

        const timeout = setTimeout(() => {
            setToasts(prevToasts => prevToasts.filter(toast => toast.id !== id));
        }, 5000);
        timeoutsRef.current.push(timeout);
    }, []);

    const removeToast = useCallback((id) => {
        setToasts(prevToasts => prevToasts.filter(toast => toast.id !== id));
    }, []);

    const contextValue = useMemo(() => ({
        toasts,
        addToast,
        removeToast
    }), [toasts, addToast, removeToast]);

    return (
        <ToastContext.Provider value={contextValue}>
            {children}
            <ToastContainer
                toasts={toasts}
                onClose={removeToast}
            />
        </ToastContext.Provider>
    );
};

ToastProvider.propTypes = {
    children: PropTypes.node.isRequired
};

export default ToastProvider;