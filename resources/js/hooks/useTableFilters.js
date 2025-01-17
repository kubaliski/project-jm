import { useState } from 'react';

const useTableFilters = (data, config) => {
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

    return {
        filters,
        sortConfig,
        currentPage,
        setCurrentPage,
        handleFilterChange,
        handleSortChange
    };
};

export default useTableFilters;