export const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    
    // If it's already a full URL, return as is
    if (imagePath.startsWith('http')) {
        return imagePath;
    }
    
    // For relative paths starting with /storage/, use as is (Vite will proxy)
    if (imagePath.startsWith('/storage/')) {
        return imagePath;
    }
    
    // For database paths (without /storage/), prepend /storage/
    // Vite will proxy this to http://127.0.0.1:8000/storage/images/...
    return `/storage/${imagePath}`;
};

export const getApiBaseUrl = () => {
    return '/api'; // Vite will proxy this
};