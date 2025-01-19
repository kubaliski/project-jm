import { CheckCircleIcon, XCircleIcon, ExclamationTriangleIcon, InformationCircleIcon } from '@heroicons/react/24/outline';

export const TOAST_TYPES = {
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

export const TOAST_DURATION = 5000; // 5 segundos