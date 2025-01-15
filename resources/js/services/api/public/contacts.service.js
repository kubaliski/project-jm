// js/services/api/public/contacts.service.js
import { publicClient } from '../httpClient';
import { API_ENDPOINTS } from '../endpoints';

class PublicContactsService {
    async create(data) {
        return publicClient.post(API_ENDPOINTS.contacts.public.create, data);
    }
}

export const publicContactsService = new PublicContactsService();