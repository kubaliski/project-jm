// @config/tables/rolesTable.js
export const rolesTableConfig = {
    filters: [
        {
            key: 'search',
            type: 'search',
            label: 'Buscar',
            placeholder: 'Buscar por nombre o descripción...'
        },
    ],
    sortOptions: [
        { key: 'name', label: 'Nombre' },
        { key: 'description', label: 'Descripción' },
        { key: 'permissions', label: 'Permisos' },
        { key: 'created_at', label: 'Fecha de creación' }
    ],
    defaultSort: {
        field: 'name',
        direction: 'asc'
    },
    searchFields: ['name', 'description']
};