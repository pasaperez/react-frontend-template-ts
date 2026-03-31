import react from '@vitejs/plugin-react';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig, loadEnv } from 'vite';

const rootDirectory: string = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig(({ mode }) => {
    const environment = loadEnv(mode, rootDirectory, '');
    const proxyTarget: string = (environment.VITE_API_BASE_URL || 'http://127.0.0.1:3000').replace(/\/$/, '');

    return {
        plugins: [react()],
        resolve: {
            alias: {
                '@app': path.resolve(rootDirectory, 'src/app'),
                '@shared': path.resolve(rootDirectory, 'src/shared'),
                '@features': path.resolve(rootDirectory, 'src/features'),
                '@tests': path.resolve(rootDirectory, 'tests')
            }
        },
        server: { proxy: { '/api': { target: proxyTarget, changeOrigin: true }, '/health': { target: proxyTarget, changeOrigin: true } } }
    };
});
