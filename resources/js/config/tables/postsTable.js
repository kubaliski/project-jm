// @config/tables/postsTable.js
export const postsTableConfig = {
    filters: [
        {
            key: 'search',
            type: 'search',
            label: 'Buscar',
            placeholder: 'Buscar por título o contenido...'
        },
        {
            key: 'status',
            type: 'select',
            label: 'Estado',
            placeholder: 'Filtrar por estado',
            options: [
                { value: '', label: 'Todos' },
                { value: 'published', label: 'Publicados' },
                { value: 'draft', label: 'Borradores' },
                { value: 'scheduled', label: 'Programados' }
            ]
        }
    ],
    sortOptions: [
        { key: 'created_at', label: 'Fecha de creación' },
        { key: 'title', label: 'Título' },
        { key: 'status', label: 'Estado' }
    ],
    defaultSort: {
        field: 'created_at',
        direction: 'desc'
    }
};