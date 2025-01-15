// resources/js/services/api/endpoints.js
export const API_ENDPOINTS = {
    posts: {
        admin: {
            base: '/api/posts',
            byId: (id) => `/api/posts/${id}`
        },
        public: {
            base: '/api/public/posts',
            bySlug: (slug) => `/api/public/posts/${slug}`
        }
    },
    contacts: {
        admin: {
            base: '/api/contacts',
            byId: (id) => `/api/contacts/${id}`,
            status: (id) => `/api/contacts/${id}/status`,
            count: '/api/contacts/count'
        },
        public: {
            create: '/api/public/contacts'
        }
    },
    auth: {
        login: '/api/login',
        logout: '/api/logout',
        user: '/api/user'
    }
};
