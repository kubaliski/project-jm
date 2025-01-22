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
 * Formatea una fecha para inputs de tipo date (solo fecha sin hora)
 * @param {string} dateString - Fecha en formato ISO o timestamp
 * @returns {string} Fecha formateada en YYYY-MM-DD
 */
export const formatDateOnlyForInput = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return new Date(date.getTime() - date.getTimezoneOffset() * 60000)
        .toISOString()
        .slice(0, 10);
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

/**
 * Formatea una fecha de tipo date (YYYY-MM-DD) para enviar al servidor
 * @param {string} dateString - Fecha en formato YYYY-MM-DD
 * @returns {string} Fecha en formato ISO con hora 00:00:00 en UTC
 */
export const formatDateForServer = (dateString) => {
    if (!dateString) return null;
    // Crear fecha en UTC a partir de YYYY-MM-DD
    const [year, month, day] = dateString.split('-');
    const date = new Date(Date.UTC(year, month - 1, day));
    return date.toISOString();
};

/**
 * Valida que una fecha esté en formato YYYY-MM-DD
 * @param {string} dateString - Fecha a validar
 * @returns {boolean}
 */
export const isValidDateFormat = (dateString) => {
    if (!dateString) return true;
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    if (!regex.test(dateString)) return false;

    const [year, month, day] = dateString.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    return date.getFullYear() === year &&
           date.getMonth() === month - 1 &&
           date.getDate() === day;
};