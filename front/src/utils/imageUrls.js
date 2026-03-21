export const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    
    // If it's already a full URL, return as is
    if (imagePath.startsWith('http')) {
        return imagePath;
    }
    
    // Get Laravel backend URL from environment variable
    // Remove /api from the base URL to get the Laravel root
    const baseUrl = import.meta.env.VITE_API_URL 
        ? import.meta.env.VITE_API_URL.replace('/api', '')
        : 'http://localhost:8000';
    
    // For database paths (like 'images/filename.jpg'), prepend /storage/
    return `${baseUrl}/storage/${imagePath}`;
};

export const getApiBaseUrl = () => {
    return import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
};