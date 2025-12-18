// resources/js/utils/api.js
import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
    baseURL: '/api',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    }
});

// Request interceptor to add auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('auth_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle errors globally
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        // Handle network errors
        if (!error.response) {
            console.error('Network error:', error);
            throw new Error('Problème de connexion internet. Veuillez vérifier votre connexion et réessayer.');
        }

        // Handle specific HTTP status codes
        const { status, data } = error.response;
        
        switch (status) {
            case 401:
                // Unauthorized - clear token but DON'T redirect here
                localStorage.removeItem('auth_token');
                localStorage.removeItem('user');
                console.log('Token expired or invalid, cleared from storage');
                break;
            case 422:
                // Validation errors - pass through the validation messages
                throw new Error(data.message || 'Données invalides');
            case 500:
                console.error('Server error:', data);
                throw new Error('Erreur serveur. Veuillez réessayer plus tard.');
            default:
                throw new Error(data?.message || 'Une erreur est survenue');
        }
        
        return Promise.reject(error);
    }
);

// Export the api instance as both default and named export
export default api;
export { api };