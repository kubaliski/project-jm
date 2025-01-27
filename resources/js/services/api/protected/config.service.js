// resources/js/services/api/protected/config.service.js
import { authClient } from '../httpClient';
import { API_ENDPOINTS } from '../endpoints';

class ConfigService {
    async getEditorConfig() {
        try {
            const { data } = await authClient.get(API_ENDPOINTS.config.editor);
            return data; // Ya no necesitamos acceder a data.data porque axios ya lo maneja
        } catch (error) {
            throw error;
        }
    }
}

export const configService = new ConfigService();