// resources/js/services/api/protected/roles.service.js
import { authClient } from '../httpClient';
import { API_ENDPOINTS } from '../endpoints';

class RolesService {
    // CRUD básico
    async getAll() {
        return authClient.get(API_ENDPOINTS.roles.base);
    }

    async getById(id) {
        return authClient.get(API_ENDPOINTS.roles.byId(id));
    }

    async create(data) {
        return authClient.post(API_ENDPOINTS.roles.base, data);
    }

    async update(id, data) {
        return authClient.put(API_ENDPOINTS.roles.byId(id), data);
    }

    async delete(id) {
        return authClient.delete(API_ENDPOINTS.roles.byId(id));
    }

    // Métodos específicos para permisos
    async getAllPermissions() {
        return authClient.get(API_ENDPOINTS.roles.permissions.get);
    }

    async updatePermissions(roleId, permissions) {
        return authClient.put(API_ENDPOINTS.roles.permissions.update(roleId), { permissions });
    }

    async addPermissions(roleId, permissions) {
        return authClient.post(API_ENDPOINTS.roles.permissions.add(roleId), { permissions });
    }

    async removePermissions(roleId, permissions) {
        return authClient.delete(API_ENDPOINTS.roles.permissions.remove(roleId), {
            data: { permissions }
        });
    }
}

export const rolesService = new RolesService();