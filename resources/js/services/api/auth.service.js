import { authClient, publicClient } from './httpClient';
import { API_ENDPOINTS } from './endpoints';

class AuthService {
    async login(credentials) {
        return publicClient.post(API_ENDPOINTS.auth.login, credentials);
    }

    async logout() {
        return authClient.post(API_ENDPOINTS.auth.logout);
    }

    async getCurrentUser() {
        return authClient.get(API_ENDPOINTS.auth.user);
    }
}

export const authService = new AuthService();