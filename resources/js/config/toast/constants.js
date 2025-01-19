import {
    CheckCircleIcon,
    XCircleIcon,
    ExclamationTriangleIcon,
    InformationCircleIcon
} from '@heroicons/react/24/outline';

export const TOAST_CLASSES = {
    container: "fixed top-4 right-4 z-[9999] flex flex-col items-end space-y-4 pointer-events-none",
    innerContainer: "flex flex-col items-end space-y-4 pointer-events-auto",
    toast: "relative flex items-center justify-between w-full max-w-sm p-4 rounded-lg shadow overflow-hidden transform transition-all duration-300 ease-in-out animate-slide-in border-2 bg-white",
    iconContainer: "flex items-center z-10",
    icon: "w-6 h-6 mr-2",
    message: "text-sm font-medium text-gray-600",
    closeButton: "ml-4 inline-flex flex-shrink-0 justify-center items-center h-4 w-4 rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-colors duration-200 z-10",
    closeIcon: "w-4 h-4",
    progressBar: "absolute bottom-0 left-0 h-1 transition-all duration-150 ease-linear"
}

export const TOAST_TYPES = {
    success: {
        icon: CheckCircleIcon,
        className: 'border-green-500',
        iconColorClass: 'text-green-500',
        progressClass: 'bg-green-500'
    },
    error: {
        icon: XCircleIcon,
        className: 'border-red-500',
        iconColorClass: 'text-red-500',
        progressClass: 'bg-red-500'
    },
    warning: {
        icon: ExclamationTriangleIcon,
        className: 'border-yellow-500',
        iconColorClass: 'text-yellow-500',
        progressClass: 'bg-yellow-500'
    },
    info: {
        icon: InformationCircleIcon,
        className: 'border-blue-500',
        iconColorClass: 'text-blue-500',
        progressClass: 'bg-blue-500'
    }
};

export const TOAST_DURATION = 5000;
