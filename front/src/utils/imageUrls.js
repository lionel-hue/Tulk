export const getImageUrl = (imagePath) => {
    if (!imagePath) {
        console.warn('getImageUrl: No image path provided');
        return null;
    }
    
    if (imagePath.startsWith('http')) {
        console.log('getImageUrl: Full URL returned:', imagePath);
        return imagePath;
    }
    
    if (imagePath.startsWith('/storage/')) {
        const baseUrl = import.meta.env.VITE_API_URL
            ? import.meta.env.VITE_API_URL.replace('/api', '')
            : 'http://localhost:8000';
        const finalUrl = `${baseUrl}${imagePath}`;
        console.log('getImageUrl: Storage path returned:', finalUrl);
        return finalUrl;
    }
    
    const baseUrl = import.meta.env.VITE_API_URL
        ? import.meta.env.VITE_API_URL.replace('/api', '')
        : 'http://localhost:8000';
    const finalUrl = `${baseUrl}/storage/${imagePath}`;
    console.log('getImageUrl: Final URL:', finalUrl);
    return finalUrl;
};