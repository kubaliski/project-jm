// resources/js/services/api/protected/posts.service.js
import { authClient } from '../httpClient';
import { API_ENDPOINTS } from '../endpoints';

class AdminPostsService {
    async getAll() {
        return authClient.get(API_ENDPOINTS.posts.admin.base);
    }

    async getById(id) {
        return authClient.get(API_ENDPOINTS.posts.admin.byId(id));
    }

    async create(formData) {
        return authClient.post(API_ENDPOINTS.posts.admin.base, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
    }

    async update(id, formData) {
        // Usamos el formData directamente como viene del formulario
        return authClient.post(API_ENDPOINTS.posts.admin.byId(id), formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
    }

    async delete(id) {
        return authClient.delete(API_ENDPOINTS.posts.admin.byId(id));
    }

    async count() {
        return authClient.get(`${API_ENDPOINTS.posts.admin.base}/count`);
    }
}

export const adminPostsService = new AdminPostsService();