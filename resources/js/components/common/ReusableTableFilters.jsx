import React from 'react';
import PropTypes from 'prop-types';
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';

export default function TableFilters({
    config,
    onFilterChange,
    onSortChange,
    filters = {},
    sortConfig = {}
}) {
    const handleReset = (filterConfig) => {
        onFilterChange(filterConfig.key, filterConfig.defaultValue || '');
    };

    const renderFilter = (filterConfig) => {
        const currentValue = filters[filterConfig.key] || filterConfig.defaultValue || '';

        switch (filterConfig.type) {
            case 'select':
                return (
                    <div className="relative">
                        <select
                            value={currentValue}
                            onChange={(e) => onFilterChange(filterConfig.key, e.target.value)}
                            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                        >
                            {filterConfig.options.map(option => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                        {currentValue !== filterConfig.defaultValue && (
                            <button
                                onClick={() => handleReset(filterConfig)}
                                className="absolute right-8 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                <XMarkIcon className="h-4 w-4" />
                            </button>
                        )}
                    </div>
                );

            case 'search':
                return (
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            className="block w-full pl-10 pr-8 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            placeholder={filterConfig.placeholder}
                            value={currentValue}
                            onChange={(e) => onFilterChange(filterConfig.key, e.target.value)}
                        />
                        {currentValue && (
                            <button
                                onClick={() => handleReset(filterConfig)}
                                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                <XMarkIcon className="h-4 w-4" />
                            </button>
                        )}
                    </div>
                );

            case 'custom':
                return (
                    <div className="relative">
                        <select
                            value={currentValue}
                            onChange={(e) => onFilterChange(filterConfig.key, e.target.value)}
                            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                        >
                            {filterConfig.options.map(option => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                        {currentValue !== filterConfig.defaultValue && (
                            <button
                                onClick={() => handleReset(filterConfig)}
                                className="absolute right-8 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                <XMarkIcon className="h-4 w-4" />
                            </button>
                        )}
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="mb-4 grid gap-4 md:flex md:flex-wrap md:items-center">
            {config.filters.map((filterConfig) => (
                <div key={filterConfig.key} className="md:mr-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        {filterConfig.label}
                    </label>
                    {renderFilter(filterConfig)}
                </div>
            ))}

            {config.sortOptions && (
                <div className="md:mr-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Ordenar por
                    </label>
                    <select
                        value={`${sortConfig.field || sortConfig.key}-${sortConfig.direction}`}
                        onChange={(e) => {
                            const [field, direction] = e.target.value.split('-');
                            onSortChange(field, direction);
                        }}
                        className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                    >
                        {config.sortOptions.map(option => (
                            <React.Fragment key={option.key}>
                                <option value={`${option.key}-asc`}>{option.label} (A-Z)</option>
                                <option value={`${option.key}-desc`}>{option.label} (Z-A)</option>
                            </React.Fragment>
                        ))}
                    </select>
                </div>
            )}
        </div>
    );
}