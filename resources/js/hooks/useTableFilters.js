import { useState, useMemo } from 'react';

export function useTableFilters(data, config) {
    const [filters, setFilters] = useState({});
    const [sortConfig, setSortConfig] = useState(config.defaultSort || { key: 'created_at', direction: 'desc' });
    const [currentPage, setCurrentPage] = useState(1);

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({
            ...prev,
            [key]: value
        }));
        setCurrentPage(1);
    };

    const handleSortChange = (key, direction) => {
        setSortConfig({ key, direction });
    };

    const filteredAndSortedData = useMemo(() => {
        let result = [...data];

        // Aplicar filtros
        Object.entries(filters).forEach(([key, value]) => {
            if (!value) return;

            const filterConfig = config.filters.find(f => f.key === key);
            if (!filterConfig) return;

            result = result.filter(item => {
                switch (filterConfig.type) {
                    case 'search':
                        // Usar customSearch si está disponible
                        if (config.customSearch) {
                            return config.customSearch(item, value);
                        }
                        // Si no hay customSearch, buscar en los campos especificados
                        if (config.searchFields) {
                            return config.searchFields.some(field =>
                                String(item[field] || '').toLowerCase().includes(String(value).toLowerCase())
                            );
                        }
                        // Fallback al comportamiento anterior
                        const searchValue = String(item[key] || '').toLowerCase();
                        return searchValue.includes(String(value).toLowerCase());

                    case 'select':
                        if (value === 'all') return true;
                        return item[key] === value;

                    case 'boolean':
                        return item[key] === (value === 'true');

                    case 'date':
                        // Implementar lógica de filtrado por fecha según necesidades
                        return true;

                    case 'custom':
                        return filterConfig.filterFn(item, value);

                    default:
                        return true;
                }
            });
        });

        // Aplicar ordenamiento
        if (sortConfig.key) {
            result.sort((a, b) => {
                const aValue = a[sortConfig.key];
                const bValue = b[sortConfig.key];

                if (!aValue && !bValue) return 0;
                if (!aValue) return 1;
                if (!bValue) return -1;

                const comparison = aValue > bValue ? 1 : -1;
                return sortConfig.direction === 'asc' ? comparison : -comparison;
            });
        }

        return result;
    }, [data, filters, sortConfig, config]);

    return {
        filteredData: filteredAndSortedData,
        filters,
        sortConfig,
        currentPage,
        setCurrentPage,
        handleFilterChange,
        handleSortChange
    };
}