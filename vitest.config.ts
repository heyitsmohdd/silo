import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
    test: {
        environment: 'node',
        include: ['src/**/*.test.ts'],
        exclude: ['client/**/*', 'node_modules/**/*'],
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
        env: {
            JWT_SECRET: 'test-secret',
        },
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
});
