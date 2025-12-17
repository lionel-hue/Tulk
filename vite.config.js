import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/index.jsx'],
            refresh: true,
        }),
        tailwindcss(),
        react(),
    ],

    server: {
        host: '10.171.31.77',
        port: 5173,
        cors: true,
        headers: {
            'Access-Control-Allow-Origin': '*',
        },
        // ADD PROXY CONFIGURATION HERE:
        proxy: {
            '/api': {
                target: 'http://127.0.0.1:8000',
                changeOrigin: true,
                secure: false,
            },
            '/storage': {
                target: 'http://127.0.0.1:8000',
                changeOrigin: true,
                secure: false,
            }
        }
    },
});