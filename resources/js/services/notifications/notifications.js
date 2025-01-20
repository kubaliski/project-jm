// clase para las notificaciones en la parte publica , en la parte privada tenemos los toast (@components/ToastContainer.jsx)

class NotificationService {
    constructor() {
        this.listeners = new Set();
    }

    subscribe(listener) {
        this.listeners.add(listener);
        return () => this.listeners.delete(listener);
    }

    notify(type, message, options = {}) {
        const notification = {
            id: Date.now(),
            type,
            message,
            ...options
        };

        this.listeners.forEach(listener => listener(notification));
    }

    success(message, options = {}) {
        this.notify('success', message, options);
    }

    error(message, options = {}) {
        this.notify('error', message, options);
    }

    info(message, options = {}) {
        this.notify('info', message, options);
    }

    warning(message, options = {}) {
        this.notify('warning', message, options);
    }
}

export const notificationService = new NotificationService();

