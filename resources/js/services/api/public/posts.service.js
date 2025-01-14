import { publicClient } from '../httpClient';
import { API_ENDPOINTS } from '../endpoints';

class PublicPostsService {
    async getAll() {
        return publicClient.get(API_ENDPOINTS.posts.public.base);
    }

    async getBySlug(slug) {
        return publicClient.get(API_ENDPOINTS.posts.public.bySlug(slug));
    }
}

export const publicPostsService = new PublicPostsService();