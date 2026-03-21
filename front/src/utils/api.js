import axios from 'axios';

// Simple API client - NO CSRF, NO cookies
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
    // NO withCredentials! You're using tokens, not cookies
});

// Add auth token to requests
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

// Handle errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (!error.response) {
            throw new Error('Network error. Please check your connection.');
        }
        
        const { status, data } = error.response;
        
        if (status === 401) {
            localStorage.removeItem('auth_token');
            localStorage.removeItem('user');
        }
        
        throw new Error(data?.message || 'An error occurred');
    }
);

export default api;
export { api };