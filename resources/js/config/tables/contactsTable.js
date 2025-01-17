// @config/tables/contactsTable.js
export const contactsTableConfig = {
    filters: [
        {
            key: 'search',
            type: 'search',
            label: 'Buscar',
            placeholder: 'Buscar por nombre, email o asunto...'
        },
        {
            key: 'status',
            type: 'select',
            label: 'Estado',
            placeholder: 'Filtrar por estado',
            options: [
                { value: '', label: 'Todos' },
                { value: 'pending', label: 'Pendientes' },
                { value: 'in_progress', label: 'En tramitación' },
                { value: 'completed', label: 'Finalizados' },
                { value: 'spam', label: 'Spam' }
            ]
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
        { key: 'created_at', label: 'Fecha de contacto' },
        { key: 'full_name', label: 'Nombre' },
        { key: 'status', label: 'Estado' },
        { key: 'email', label: 'Email' }
    ],
    defaultSort: {
        field: 'created_at',
        direction: 'desc'
    },
    searchFields: ['full_name', 'email', 'subject', 'message', 'phone']
};