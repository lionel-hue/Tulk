export const getImageUrl = (imagePath) => {
    if (!imagePath || imagePath === '' || imagePath.endsWith('/')) {
        return null;
    }
    
    if (imagePath.startsWith('http')) {
        return imagePath;
    }
    
    const baseUrl = import.meta.env.VITE_API_URL
        ? import.meta.env.VITE_API_URL.replace('/api', '')
        : 'http://localhost:8000';
        
    const cleanPath = imagePath.startsWith('/') ? imagePath : `/storage/${imagePath}`;
    const finalUrl = `${baseUrl}${cleanPath}`;
    
    return finalUrl;
};