import { authClient } from '../httpClient';
import { API_ENDPOINTS } from '../endpoints';

class AdminBlacklistService {
    /**
     * Get all blocked IPs
     */
    async getAll() {
        return authClient.get(API_ENDPOINTS.blacklist.admin.base);
    }

    /**
     * Block an IP address
     */
    async blockIp(ip) {
        return authClient.post(API_ENDPOINTS.blacklist.admin.block, { ip });
    }

    /**
     * Unblock an IP address
     */
    async unblockIp(ip) {
        return authClient.post(API_ENDPOINTS.blacklist.admin.unblock, { ip });
    }

    /**
     * Get detailed blacklist statistics
     */
      async getStats() {
        return authClient.get(API_ENDPOINTS.blacklist.admin.stats);
    }
}

export const adminBlacklistService = new AdminBlacklistService();