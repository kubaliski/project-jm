// Clases específicas para el marquee
export const MARQUEE_CLASSES = {
    container: 'overflow-hidden relative w-full',
    content: 'flex whitespace-nowrap animate-marquee'
};

// Lista de clases disponibles
export const BANNER_CLASSES = {
    default: {
        label: 'Por defecto',
        value: '',
        preview: 'Sin efectos adicionales'
    },
    'pulse': {
        label: 'Pulso',
        value: 'animate-pulse',
        preview: 'El banner pulsará suavemente para llamar la atención'
    },
    'marquee': {
        label: 'Texto deslizante',
        value: 'relative overflow-hidden whitespace-nowrap',
        preview: 'El texto se desplazará horizontalmente de derecha a izquierda'
    },
    'gradient': {
        label: 'Gradiente',
        value: 'bg-gradient animate-gradient bg-[length:200%_100%]',
        preview: 'Fondo con gradiente animado que cambia suavemente'
    },
    'glass': {
        label: 'Efecto cristal',
        value: 'backdrop-filter backdrop-blur-md bg-opacity-80 shadow-lg',
        preview: 'Efecto de cristal translúcido con desenfoque'
    }
};

// Funciones de utilidad
export const getClassValue = (className) => BANNER_CLASSES[className]?.value || '';

export const getClassPreview = (className) => BANNER_CLASSES[className]?.preview || '';

// Función para combinar clases
export const combineClasses = (...classes) => classes.filter(Boolean).join(' ');

// Función para generar el estilo del gradiente
export const getGradientStyle = (backgroundColor) => {
    const adjustBrightness = (color, factor) => {
        const hex = color.replace('#', '');
        const r = parseInt(hex.slice(0, 2), 16);
        const g = parseInt(hex.slice(2, 4), 16);
        const b = parseInt(hex.slice(4, 6), 16);

        const newR = Math.min(255, Math.round(r * factor));
        const newG = Math.min(255, Math.round(g * factor));
        const newB = Math.min(255, Math.round(b * factor));

        return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
    };

    const lighterColor = adjustBrightness(backgroundColor, 1.2);
    const darkerColor = adjustBrightness(backgroundColor, 0.8);

    return {
        backgroundImage: `linear-gradient(90deg,
            ${backgroundColor} 0%,
            ${lighterColor} 25%,
            ${backgroundColor} 50%,
            ${darkerColor} 75%,
            ${backgroundColor} 100%)`
    };
};

// Función para generar el estilo glass
export const getGlassStyle = (backgroundColor) => {
    const toRGBA = (hexColor, alpha = 1) => {
        const cleanHex = hexColor.replace('#', '');
        const r = parseInt(cleanHex.slice(0, 2), 16);
        const g = parseInt(cleanHex.slice(2, 4), 16);
        const b = parseInt(cleanHex.slice(4, 6), 16);
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    };

    return {
        backgroundColor: toRGBA(backgroundColor, 0.8),
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
    };
};