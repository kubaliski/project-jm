export const contactsTableConfig = {
    filters: [
        {
            key: 'search',
            label: 'Buscar',
            type: 'search',
            placeholder: 'Buscar por nombre o email...'
        },
        {
            key: 'status',
            label: 'Estado',
            type: 'custom',
            defaultValue: 'all',
            options: [
                { value: 'all', label: 'Todos los estados' },
                { value: 'pending', label: 'Pendientes' },
                { value: 'in_progress', label: 'En tramitación' },
                { value: 'completed', label: 'Finalizados' },
                { value: 'spam', label: 'Spam' }
            ],
            filterFn: (contact, value) => {
                if (value === 'all') return true;
                return contact.status === value;
            }
        },
        {
            key: 'date',
            label: 'Período',
            type: 'custom',
            defaultValue: 'all',
            options: [
                { value: 'all', label: 'Todas las fechas' },
                { value: 'today', label: 'Hoy' },
                { value: 'week', label: 'Esta semana' },
                { value: 'month', label: 'Este mes' }
            ],
            filterFn: (contact, value) => {
                if (value === 'all') return true;
                const contactDate = new Date(contact.created_at);
                const today = new Date();

                switch (value) {
                    case 'today': {
                        return contactDate.toDateString() === today.toDateString();
                    }
                    case 'week': {
                        const weekStart = new Date(today.setDate(today.getDate() - today.getDay()));
                        return contactDate >= weekStart;
                    }
                    case 'month': {
                        return contactDate.getMonth() === today.getMonth() &&
                               contactDate.getFullYear() === today.getFullYear();
                    }
                    default:
                        return true;
                }
            }
        }
    ],
    sortOptions: [
        { key: 'created_at', label: 'Fecha de contacto' },
        { key: 'full_name', label: 'Nombre' },
        { key: 'status', label: 'Estado' }
    ],
    defaultSort: {
        key: 'created_at',
        direction: 'desc'
    },
    searchFields: ['full_name', 'email', 'subject'],
    customSearch: (contact, searchTerm) => {
        if (!searchTerm) return true;
        const searchLower = searchTerm.toLowerCase();
        return (
            contact.full_name.toLowerCase().includes(searchLower) ||
            contact.email.toLowerCase().includes(searchLower) ||
            contact.subject.toLowerCase().includes(searchLower) ||
            (contact.phone && contact.phone.includes(searchTerm))
        );
    }
};