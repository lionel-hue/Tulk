export const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    
    // If it's already a full URL, return as is
    if (imagePath.startsWith('http')) {
        return imagePath;
    }
    
    // If path already starts with /storage/, don't add it again
    if (imagePath.startsWith('/storage/')) {
        const baseUrl = import.meta.env.VITE_API_URL
            ? import.meta.env.VITE_API_URL.replace('/api', '')
            : 'http://localhost:8000';
        return `${baseUrl}${imagePath}`;
    }
    
    // For database paths (like 'images/filename.jpg'), prepend /storage/
    const baseUrl = import.meta.env.VITE_API_URL
        ? import.meta.env.VITE_API_URL.replace('/api', '')
        : 'http://localhost:8000';
    return `${baseUrl}/storage/${imagePath}`;
};