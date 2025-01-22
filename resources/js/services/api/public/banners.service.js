import { publicClient } from '../httpClient';
import { API_ENDPOINTS } from '../endpoints';

class PublicBannersService {
    async getActive() {
        return publicClient.get(API_ENDPOINTS.banners.public.active);
    }
}

export const publicBannersService = new PublicBannersService();