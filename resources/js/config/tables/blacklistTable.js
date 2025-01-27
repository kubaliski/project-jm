export const blacklistTableConfig = {
    filters: [
        {
            key: 'search',
            type: 'search',
            label: 'Buscar',
            placeholder: 'Buscar por dirección IP...'
        },
        {
            key: 'dateRange',
            type: 'custom',
            label: 'Rango de fechas',
            defaultValue: 'all',
            options: [
                { value: 'all', label: 'Todas las fechas' },
                { value: 'today', label: 'Hoy' },
                { value: 'week', label: 'Esta semana' },
                { value: 'month', label: 'Este mes' }
            ]
        }
    ],
    sortOptions: [
        { key: 'ip', label: 'Dirección IP' },
        { key: 'blocked_at', label: 'Fecha del bloqueo' },
        { key: 'expires_at', label: 'Fecha de expiración' }
    ],
    defaultSort: {
        field: 'blocked_at',
        direction: 'desc'
    },
    searchFields: ['ip']
};