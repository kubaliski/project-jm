import { authClient } from '../httpClient';
import { API_ENDPOINTS } from '../endpoints';

class AdminAppInfoService {
    async update(id, data) {
        return authClient.put(API_ENDPOINTS.appInfo.admin.update(id), data);
    }
}

export const adminAppInfoService = new AdminAppInfoService();