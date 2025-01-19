export const TOAST_CLASSES = {
    container: "fixed top-4 right-4 z-[9999] flex flex-col items-end space-y-4 pointer-events-none",
    innerContainer: "flex flex-col items-end space-y-4 pointer-events-auto",
    toast: "relative flex items-center justify-between w-full max-w-sm p-4 mb-4 rounded-lg shadow border overflow-hidden transform transition-all duration-300 ease-in-out animate-slide-in",
    iconContainer: "flex items-center z-10",
    icon: "w-6 h-6 mr-2",
    message: "text-sm font-medium",
    closeButton: "ml-4 inline-flex flex-shrink-0 justify-center items-center h-4 w-4 rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-colors duration-200 z-10",
    closeIcon: "w-4 h-4",
    progressBar: "absolute bottom-0 left-0 h-1"
};

export const TOAST_ANIMATION = {
    progressBarTransition: (isPaused) => ({
        width: '100%',
        opacity: '0.6',
        transition: isPaused ? 'none' : 'width 100ms linear'
    })
};