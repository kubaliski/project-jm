// vite.config.js
import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.jsx'],
            refresh: true,
        }),
        react(),
    ],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './resources/js'),
            '@components': path.resolve(__dirname, './resources/js/components'),
            '@pages': path.resolve(__dirname, './resources/js/pages'),
            '@layouts': path.resolve(__dirname, './resources/js/layouts'),
            '@context': path.resolve(__dirname, './resources/js/context'),
            '@providers': path.resolve(__dirname, './resources/js/providers'),
            '@utils': path.resolve(__dirname, './resources/js/utils'),
            '@assets': path.resolve(__dirname, './resources/js/assets'),
            '@services': path.resolve(__dirname, './resources/js/services'),
            '@hooks': path.resolve(__dirname, './resources/js/hooks'),
            '@features': path.resolve(__dirname, './resources/js/features'),
            '@config': path.resolve(__dirname, './resources/js/config'),
            '@store': path.resolve(__dirname, './resources/js/store'),
        }
    },
});
