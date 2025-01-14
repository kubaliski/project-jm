/**
 * Formatea una fecha para inputs datetime-local
 * @param {string} dateString - Fecha en formato ISO o timestamp
 * @returns {string} Fecha formateada en YYYY-MM-DDTHH:mm
 */
export const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return new Date(date.getTime() - date.getTimezoneOffset() * 60000)
        .toISOString()
        .slice(0, 16);
};

/**
 * Formatea una fecha para mostrar en la UI
 * @param {string} dateString - Fecha en formato ISO o timestamp
 * @param {object} options - Opciones de formato (opcional)
 * @returns {string} Fecha formateada según locale
 */
export const formatDateForDisplay = (dateString, options = {}) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        ...options
    }).format(date);
};

/**
 * Verifica si una fecha es futura
 * @param {string} dateString - Fecha en formato ISO o timestamp
 * @returns {boolean}
 */
export const isFutureDate = (dateString) => {
    if (!dateString) return false;
    return new Date(dateString) > new Date();
};