import { publicClient } from '../httpClient';
import { API_ENDPOINTS } from '../endpoints';

class PublicAppInfoService {
    async get() {
        return publicClient.get(API_ENDPOINTS.appInfo.public.get);
    }
}

export const publicAppInfoService = new PublicAppInfoService();