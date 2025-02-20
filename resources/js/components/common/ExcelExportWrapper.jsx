// components/common/ExcelExportWrapper.jsx
import React, { useState, useCallback } from 'react';
import { ArrowDownTrayIcon } from '@heroicons/react/24/solid';

const ExcelExportWrapper = ({
    children,
    onExport,
    isDisabled = false,
    className = ''
}) => {
    const [isLoading, setIsLoading] = useState(false);

    const handleExport = useCallback(async () => {
        if (isDisabled || isLoading) return;

        setIsLoading(true);
        try {
            // Cargar XLSX y FileSaver solo cuando se necesiten
            const [{ default: XLSX }, { saveAs }] = await Promise.all([
                import('xlsx-js-style'),
                import('file-saver')
            ]);

            // Ejecutar la función de exportación proporcionada
            await onExport({ XLSX, saveAs });
        } catch (error) {
            console.error('Error al exportar:', error);
        } finally {
            setIsLoading(false);
        }
    }, [isDisabled, isLoading, onExport]);

    // Si children es una función, la llamamos con las props necesarias
    if (typeof children === 'function') {
        return children({
            onClick: handleExport,
            isLoading
        });
    }

    // Renderizado por defecto si no se proporciona children
    const baseStyles = "inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500";
    const enabledStyles = "text-white bg-indigo-600 hover:bg-indigo-700";
    const disabledStyles = "text-gray-400 bg-gray-100 cursor-not-allowed";

    const buttonStyles = className || `${baseStyles} ${isDisabled || isLoading ? disabledStyles : enabledStyles}`;

    return (
        <button
            type="button"
            onClick={handleExport}
            disabled={isDisabled || isLoading}
            className={buttonStyles}
        >
            <ArrowDownTrayIcon className={`h-5 w-5 mr-2 ${isDisabled || isLoading ? 'text-gray-400' : ''}`} />
            <span>{isLoading ? 'Exportando...' : 'Exportar a Excel'}</span>
        </button>
    );
};

export default ExcelExportWrapper;