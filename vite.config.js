// vite.config.js
import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import path from 'path';

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.jsx'],
            refresh: true,
        }),
        react(),
        VitePWA({
            strategies: 'injectManifest',
            srcDir: 'resources/js',
            filename: 'sw.js',
            registerType: 'autoUpdate',
            manifest: {
                name: 'TuMarca',
                short_name: 'TuMarca',
                description: 'Plataforma digital para servicios web y marketing',
                theme_color: '#3B82F6',
                background_color: '#ffffff',
                display: 'standalone',
                orientation: 'portrait',
                icons: [
                    {
                        src: '/favicon-192x192.png',  // Directamente en la raíz
                        sizes: '192x192',
                        type: 'image/png'
                    },
                    {
                        src: '/favicon-512x512.png',  // Directamente en la raíz
                        sizes: '512x512',
                        type: 'image/png'
                    }
                ]
            },
            injectRegister: false,
            devOptions: {
                enabled: true
            }
        })
    ],
    build: {
        rollupOptions: {
            output: {
                manualChunks: (id) => {
                    // Vendors
                    if (id.includes('node_modules')) {
                        if (id.includes('@tinymce') || id.includes('tinymce-i18n')) {
                            return 'vendor-editor';
                        }
                        return 'vendor';
                    }

                    // Código crítico de home
                    if (id.includes('/features/home/Hero') ||
                        id.includes('/features/home/hooks') ||
                        id.includes('/features/home/utils')) {
                        return 'home-critical';
                    }

                    // Código no crítico de home
                    if (id.includes('/features/home/')) {
                        return 'home-deferred';
                    }

                    // Código de la aplicación por secciones
                    if (id.includes('/pages/admin/')) {
                        return 'admin';
                    }
                    if (id.includes('/pages/public/')) {
                        return 'public';
                    }
                }
            }
        },
        chunkSizeWarningLimit: 1000,
        minify: 'esbuild',
        sourcemap: true
    },
    optimizeDeps: {
        include: ['react', 'react-dom', 'react-router-dom', '@reduxjs/toolkit', 'react-redux'],
        force: true
    },
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
            '@routes': path.resolve(__dirname, './resources/js/routes')
        }
    }
});