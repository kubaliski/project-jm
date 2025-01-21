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
    users: {
        base: '/api/users',
        byId: (id) => `/api/users/${id}`,
        assignRoles: (id) => `/api/users/${id}/roles`,
        profile: '/api/users/profile'
    },
    auth: {
        login: '/api/login',
        logout: '/api/logout',
        user: '/api/user',
        forgotPassword: '/api/forgot-password',
        resetPassword: '/api/reset-password'
    },
    roles: {
        base: '/api/roles',
        byId: (id) => `/api/roles/${id}`,
        permissions: {
            get: '/api/permissions',
            update: (roleId) => `/api/roles/${roleId}/permissions`,
            add: (roleId) => `/api/roles/${roleId}/permissions`,
            remove: (roleId) => `/api/roles/${roleId}/permissions`
        }
    },
};
