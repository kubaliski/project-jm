// @config/tables/bannersTable.js
export const bannersTableConfig = {
    filters: [
        {
            key: 'search',
            type: 'search',
            label: 'Buscar',
            placeholder: 'Buscar por texto...'
        },
        {
            key: 'status',
            type: 'select',
            label: 'Estado',
            placeholder: 'Filtrar por estado',
            options: [
                { value: '', label: 'Todos' },
                { value: 'active', label: 'Activos' },
                { value: 'inactive', label: 'Inactivos' },
                { value: 'scheduled', label: 'Programados' },
                { value: 'expired', label: 'Expirados' }
            ]
        },
        {
            key: 'dateRange',
            type: 'dateRange',
            label: 'Rango de fechas',
            placeholder: {
                start: 'Fecha inicio',
                end: 'Fecha fin'
            }
        }
    ],
    sortOptions: [
        { key: 'priority', label: 'Prioridad' },
        { key: 'created_at', label: 'Fecha de creación' },
        { key: 'start_date', label: 'Fecha de inicio' },
        { key: 'end_date', label: 'Fecha de fin' },
        { key: 'status', label: 'Estado' }
    ],
    defaultSort: {
        field: 'priority',
        direction: 'desc'
    }
};