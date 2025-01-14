// resources/js/services/api/httpClient.js
import axios from 'axios';

const baseConfig = {
    baseURL: 'http://localhost:8000',
    headers: {
        'X-Requested-With': 'XMLHttpRequest'
    },
    withCredentials: true
};

// Cliente para llamadas que requieren autenticación
const authClient = axios.create(baseConfig);

authClient.interceptors.request.use(function (config) {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Cliente para llamadas públicas
const publicClient = axios.create(baseConfig);

export { authClient, publicClient };