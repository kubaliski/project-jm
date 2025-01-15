// resources/js/services/api/protected/contacts.service.js
import { authClient } from '../httpClient';
import { API_ENDPOINTS } from '../endpoints';

class AdminContactsService {
    async getAll() {
        return authClient.get(API_ENDPOINTS.contacts.admin.base);
    }

    async getById(id) {
        return authClient.get(API_ENDPOINTS.contacts.admin.byId(id));
    }

    async create(data) {
        return authClient.post(API_ENDPOINTS.contacts.admin.base, data);
    }

    async update(id, data) {
        return authClient.put(API_ENDPOINTS.contacts.admin.byId(id), data);
    }

    async updateStatus(id, status) {
        return authClient.patch(API_ENDPOINTS.contacts.admin.status(id), { status });
    }

    async delete(id) {
        return authClient.delete(API_ENDPOINTS.contacts.admin.byId(id));
    }

    async count() {
        return authClient.get(API_ENDPOINTS.contacts.admin.count);
    }
}

export const adminContactsService = new AdminContactsService();