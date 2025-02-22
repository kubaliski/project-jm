// js/services/api/public/posts.service.js
import { publicClient } from '../httpClient';
import { API_ENDPOINTS } from '../endpoints';

class PublicPostsService {
    async getAll() {
        return publicClient.get(API_ENDPOINTS.posts.public.base);
    }

    async getBySlug(slug) {
        return publicClient.get(API_ENDPOINTS.posts.public.bySlug(slug));
    }

    async getRecentPosts() {
        return publicClient.get(`${API_ENDPOINTS.posts.public.base}/latest-posts`);
    }
}

export const publicPostsService = new PublicPostsService();