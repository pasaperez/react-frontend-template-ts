import react from '@vitejs/plugin-react';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

const rootDirectory: string = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            '@app': path.resolve(rootDirectory, 'src/app'),
            '@shared': path.resolve(rootDirectory, 'src/shared'),
            '@features': path.resolve(rootDirectory, 'src/features'),
            '@tests': path.resolve(rootDirectory, 'tests')
        }
    },
    test: {
        environment: 'jsdom',
        setupFiles: ['./tests/setup.ts'],
        include: ['tests/**/*.spec.ts', 'tests/**/*.spec.tsx'],
        coverage: {
            provider: 'v8',
            reporter: ['text', 'html'],
            include: ['src/**/*.ts', 'src/**/*.tsx'],
            exclude: [
                'src/main.tsx',
                'src/vite-env.d.ts',
                'src/shared/http/HttpClient.ts',
                'src/features/users/application/UsersFeatureDependencies.ts',
                'src/features/users/domain/ports/UsersRepository.ts'
            ],
            thresholds: { statements: 100, branches: 100, functions: 100, lines: 100 }
        }
    }
});
