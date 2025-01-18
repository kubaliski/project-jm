// @config/tables/usersTable.js
export const usersTableConfig = {
    filters: [
        {
            key: 'search',
            type: 'search',
            label: 'Buscar',
            placeholder: 'Buscar por nombre, apellido o email...'
        },
        {
            key: 'role',
            type: 'select',
            label: 'Rol',
            placeholder: 'Filtrar por rol',
            defaultValue: '',
            // Las opciones se pasarán dinámicamente desde el componente
            options: [],
            // Indicamos que este filtro debe recibir opciones dinámicamente
            isDynamic: true
        }
    ],
    sortOptions: [
        { key: 'name', label: 'Nombre' },
        { key: 'email', label: 'Email' },
        { key: 'roles', label: 'Roles' },
        { key: 'created_at', label: 'Fecha de registro' }
    ],
    defaultSort: {
        field: 'name',
        direction: 'asc'
    },
    searchFields: ['name', 'last_name', 'email']
};