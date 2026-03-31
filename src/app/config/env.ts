import { z } from 'zod';

export interface AppEnvironment {
    apiBaseUrl: string;
}

const appEnvironmentSchema: z.ZodType<{ VITE_API_BASE_URL: string; }> = z.object({
    VITE_API_BASE_URL: z.string().url().default('http://127.0.0.1:3000')
});

export function loadAppEnvironment(source: ImportMetaEnv = import.meta.env): AppEnvironment {
    if (source.DEV) {
        return { apiBaseUrl: '' };
    }

    const environment: { VITE_API_BASE_URL: string; } = appEnvironmentSchema.parse(source);

    return { apiBaseUrl: environment.VITE_API_BASE_URL.replace(/\/$/, '') };
}
