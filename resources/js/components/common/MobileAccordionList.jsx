import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

const MobileAccordionList = ({
    data = [],
    columns = [],
    isLoading = false,
    emptyMessage = 'No hay datos disponibles',
    mainColumn = columns[0]?.key,
    currentPage = 1,
    totalPages = 1,
    onPageChange = () => {},
}) => {
    const [openItems, setOpenItems] = useState(new Set());

    const toggleItem = (itemId) => {
        setOpenItems(prev => {
            const newSet = new Set(prev);
            if (newSet.has(itemId)) {
                newSet.delete(itemId);
            } else {
                newSet.add(itemId);
            }
            return newSet;
        });
    };

    // Renderiza los botones de paginación móvil
    const renderMobilePagination = () => {
        if (!data || data.length === 0 || totalPages <= 1) return null;

        return (
            <div className="flex justify-between items-center mt-4 px-4 py-3 bg-white border-t border-gray-200">
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-md disabled:opacity-50"
                >
                    Anterior
                </button>
                <span className="text-sm text-gray-600">
                    Página {currentPage} de {totalPages}
                </span>
                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-md disabled:opacity-50"
                >
                    Siguiente
                </button>
            </div>
        );
    };

    if (isLoading) {
        return (
            <div className="space-y-3">
                {[...Array(3)].map((_, idx) => (
                    <div key={idx} className="bg-white rounded-lg shadow animate-pulse">
                        <div className="h-16 bg-gray-100 rounded-t-lg"></div>
                    </div>
                ))}
            </div>
        );
    }

    if (!data || data.length === 0) {
        return (
            <div className="text-center py-6 bg-white rounded-lg">
                <p className="text-gray-500">{emptyMessage}</p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {data.map((item, index) => {
                const itemId = item.id || index;
                const isOpen = openItems.has(itemId);

                // Encuentra la columna principal para mostrar en el header
                const mainColumnData = columns.find(col => col.key === mainColumn);
                const mainContent = mainColumnData?.render
                    ? mainColumnData.render(item)
                    : item[mainColumn];

                return (
                    <div key={itemId} className="bg-white rounded-lg shadow">
                        <button
                            onClick={() => toggleItem(itemId)}
                            className="w-full px-4 py-3 flex items-center justify-between text-left"
                        >
                            <div className="flex-1">
                                {mainContent}
                            </div>
                            <ChevronDownIcon
                                className={`w-5 h-5 text-gray-500 transform transition-transform ${
                                    isOpen ? 'rotate-180' : ''
                                }`}
                            />
                        </button>

                        {isOpen && (
                            <div className="px-4 pb-4 space-y-3">
                                {columns
                                    .filter(col => col.key !== mainColumn && col.key !== 'actions')
                                    .map(column => (
                                        <div key={column.key} className="border-t border-gray-100 pt-2">
                                            <div className="text-xs text-gray-500 uppercase">
                                                {column.header}
                                            </div>
                                            <div className="mt-1">
                                                {column.render
                                                    ? column.render(item)
                                                    : item[column.key]}
                                            </div>
                                        </div>
                                    ))}

                                {/* Renderizar acciones al final si existen */}
                                {columns.find(col => col.key === 'actions') && (
                                    <div className="border-t border-gray-100 pt-3">
                                        {columns.find(col => col.key === 'actions').render(item)}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                );
            })}

            {renderMobilePagination()}
        </div>
    );
};


MobileAccordionList.propTypes = {
    // Datos y columnas
    data: PropTypes.arrayOf(PropTypes.object),
    columns: PropTypes.arrayOf(
        PropTypes.shape({
            key: PropTypes.string.isRequired,
            header: PropTypes.node.isRequired,
            render: PropTypes.func,
            className: PropTypes.string,
            cellClassName: PropTypes.string
        })
    ),

    // Estados y mensajes
    isLoading: PropTypes.bool,
    emptyMessage: PropTypes.node,

    // Columna principal para el acordeón
    mainColumn: PropTypes.string,

    // Props de paginación
    currentPage: PropTypes.number,
    totalPages: PropTypes.number,
    itemsPerPage: PropTypes.number,
    totalItems: PropTypes.number,
    onPageChange: PropTypes.func
};


export default MobileAccordionList;