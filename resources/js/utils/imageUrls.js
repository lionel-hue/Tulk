export const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    
    // If it's already a full URL, return as is
    if (imagePath.startsWith('http')) {
        return imagePath;
    }
    
    // For relative paths starting with /storage/, use as is
    if (imagePath.startsWith('/storage/')) {
        return `${window.location.origin}${imagePath}`;
    }
    
    // For database paths (without /storage/), prepend /storage/
    return `${window.location.origin}/storage/${imagePath}`;
};

export const getApiBaseUrl = () => {
    return import.meta.env.VITE_API_URL || '/api';
};