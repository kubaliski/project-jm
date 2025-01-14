import React from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';
import TableSkeleton, { PaginationSkeleton } from '../ui/Skeletons/TableSkeleton';

export default function Table({
    columns = [],
    data = [],
    isLoading = false,
    emptyMessage = 'No hay datos disponibles',
    currentPage = 1,
    totalPages = 1,
    onPageChange = () => {},
    itemsPerPage = 10,
    totalItems = 0,
}) {
    const renderPagination = () => {
        if (!data || data.length === 0) return null;

        const pages = [];
        const maxVisiblePages = 5;
        let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        const renderPageButton = (pageNum) => (
            <button
                key={pageNum}
                onClick={() => onPageChange(pageNum)}
                className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                    currentPage === pageNum
                        ? 'z-10 bg-indigo-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
                        : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-offset-0'
                }`}
            >
                {pageNum}
            </button>
        );

        pages.push(
            <button
                key="prev"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-offset-0 disabled:opacity-50"
            >
                <span className="sr-only">Anterior</span>
                <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
            </button>
        );

        if (startPage > 1) {
            pages.push(renderPageButton(1));
            if (startPage > 2) pages.push(<span key="dots1" className="px-4 py-2">...</span>);
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(renderPageButton(i));
        }

        if (endPage < totalPages) {
            if (endPage < totalPages - 1) pages.push(<span key="dots2" className="px-4 py-2">...</span>);
            pages.push(renderPageButton(totalPages));
        }

        pages.push(
            <button
                key="next"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-offset-0 disabled:opacity-50"
            >
                <span className="sr-only">Siguiente</span>
                <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
            </button>
        );

        return pages;
    };

    return (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            {columns.map((column) => (
                                <th
                                    key={column.key}
                                    scope="col"
                                    className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
                                        column.className || ''
                                    }`}
                                >
                                    {column.header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    {isLoading ? (
                        <TableSkeleton columns={columns} rowCount={itemsPerPage} />
                    ) : !data || data.length === 0 ? (
                        <tbody>
                            <tr>
                                <td
                                    colSpan={columns.length}
                                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center"
                                >
                                    {emptyMessage}
                                </td>
                            </tr>
                        </tbody>
                    ) : (
                        <tbody className="bg-white divide-y divide-gray-200">
                            {data.map((item, index) => (
                                <tr key={item.id || index} className="hover:bg-gray-50">
                                    {columns.map((column) => (
                                        <td
                                            key={`${item.id || index}-${column.key}`}
                                            className={`px-6 py-4 whitespace-nowrap ${
                                                column.cellClassName || ''
                                            }`}
                                        >
                                            {column.render
                                                ? column.render(item)
                                                : item[column.key]}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    )}
                </table>
            </div>

            {isLoading ? (
                <PaginationSkeleton />
            ) : (!isLoading && data && data.length > 0 && totalPages > 1) && (
                <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
                    <div className="flex flex-1 justify-between sm:hidden">
                        <button
                            onClick={() => onPageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                        >
                            Anterior
                        </button>
                        <button
                            onClick={() => onPageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                        >
                            Siguiente
                        </button>
                    </div>
                    <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                        <div>
                            <p className="text-sm text-gray-700">
                                Mostrando{' '}
                                <span className="font-medium">
                                    {Math.min((currentPage - 1) * itemsPerPage + 1, totalItems)}
                                </span>{' '}
                                a{' '}
                                <span className="font-medium">
                                    {Math.min(currentPage * itemsPerPage, totalItems)}
                                </span>{' '}
                                de <span className="font-medium">{totalItems}</span> resultados
                            </p>
                        </div>
                        <div>
                            <nav
                                className="isolate inline-flex -space-x-px rounded-md shadow-sm"
                                aria-label="Pagination"
                            >
                                {renderPagination()}
                            </nav>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}