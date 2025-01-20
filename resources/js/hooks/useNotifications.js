import { useEffect } from 'react';
import { notificationService } from '@services/notifications';

export const useNotifications = (callback) => {
    useEffect(() => {
        const unsubscribe = notificationService.subscribe(callback);
        return () => unsubscribe();
    }, [callback]);

    return notificationService;
};