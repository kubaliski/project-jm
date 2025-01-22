// resources/js/services/api/protected/banners.service.js
import { authClient } from '../httpClient';
import { API_ENDPOINTS } from '../endpoints';

class AdminBannersService {
    async getAll() {
        return authClient.get(API_ENDPOINTS.banners.admin.base);
    }

    async getById(id) {
        return authClient.get(API_ENDPOINTS.banners.admin.byId(id));
    }

    async create(data) {
        return authClient.post(API_ENDPOINTS.banners.admin.base, data);
    }

    async update(id, data) {
        return authClient.put(API_ENDPOINTS.banners.admin.byId(id), data);
    }

    async delete(id) {
        return authClient.delete(API_ENDPOINTS.banners.admin.byId(id));
    }

    async updatePriority(id, priority) {
        return authClient.patch(API_ENDPOINTS.banners.admin.priority(id), { priority });
    }
}

export const adminBannersService = new AdminBannersService();