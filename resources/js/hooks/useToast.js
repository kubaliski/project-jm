import { useContext, useCallback } from 'react';
import { ToastContext } from '@context/ToastContext';

const useToast = () => {
    const context = useContext(ToastContext);

    if (!context) {
        console.error('Toast context is null - make sure useToast is used within ToastProvider');
        throw new Error('useToast must be used within a ToastProvider');
    }

    const { addToast } = context;

    const toast = {
        success: useCallback((message) => {
            addToast(message, 'success');
        }, [addToast]),
        error: useCallback((message) => {
            addToast(message, 'error');
        }, [addToast]),
        warning: useCallback((message) => {
            addToast(message, 'warning');
        }, [addToast]),
        info: useCallback((message) => {
            addToast(message, 'info');
        }, [addToast])
    };

    return toast;
};

export default useToast;