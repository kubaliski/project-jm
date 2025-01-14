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
    auth: {
        login: '/api/login',
        logout: '/api/logout',
        user: '/api/user'
    }
};
