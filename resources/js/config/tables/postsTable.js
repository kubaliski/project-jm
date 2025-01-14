// config/tables/postsTable.js
import { isFutureDate } from '../../utils/dateUtils';

export const postsTableConfig = {
    filters: [
        {
            key: 'title',
            label: 'Buscar',
            type: 'search',
            placeholder: 'Buscar por título...'
        },
        {
            key: 'status',
            label: 'Estado',
            type: 'custom',
            defaultValue: 'all',
            options: [
                { value: 'all', label: 'Todos los estados' },
                { value: 'published', label: 'Publicados' },
                { value: 'draft', label: 'Borradores' },
                { value: 'scheduled', label: 'Programados' }
            ],
            filterFn: (post, value) => {
                if (value === 'all') return true;

                switch (value) {
                    case 'published':
                        return post.is_published;
                    case 'draft':
                        return !post.is_published && !post.published_at;
                    case 'scheduled':
                        return !post.is_published && post.published_at && isFutureDate(post.published_at);
                    default:
                        return true;
                }
            }
        }
    ],
    sortOptions: [
        { key: 'created_at', label: 'Fecha de creación' },
        { key: 'title', label: 'Título' }
    ],
    defaultSort: {
        key: 'created_at',
        direction: 'desc'
    }
};