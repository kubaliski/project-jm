// resources/js/services/api/protected/users.service.js
import { authClient } from '../httpClient';
import { API_ENDPOINTS } from '../endpoints';

class UsersService {
    async getAll() {
        return authClient.get(API_ENDPOINTS.users.base);
    }

    async getById(id) {
        return authClient.get(API_ENDPOINTS.users.byId(id));
    }

    async create(data) {
        return authClient.post(API_ENDPOINTS.users.base, data);
    }

    async update(id, data) {
        return authClient.put(API_ENDPOINTS.users.byId(id), data);
    }

    async delete(id) {
        return authClient.delete(API_ENDPOINTS.users.byId(id));
    }

    async assignRoles(id, roles) {
        return authClient.post(API_ENDPOINTS.users.assignRoles(id), { roles });
    }

    async updateProfile(data) {
        return authClient.put(API_ENDPOINTS.users.profile, data);
    }
}

export const usersService = new UsersService();