import { loadAppEnvironment } from '@app/config/env';
import { describe, expect, it } from 'vitest';

describe('loadAppEnvironment', () => {
    it('uses a relative base URL in development so Vite can proxy requests', () => {
        expect(loadAppEnvironment({ DEV: true } as ImportMetaEnv)).toEqual({ apiBaseUrl: '' });
    });

    it('uses the default backend URL outside development when no variable is provided', () => {
        expect(loadAppEnvironment({ DEV: false } as ImportMetaEnv)).toEqual({ apiBaseUrl: 'http://127.0.0.1:3000' });
    });

    it('trims a trailing slash from custom backend URLs outside development', () => {
        expect(loadAppEnvironment({ DEV: false, VITE_API_BASE_URL: 'https://api.example.com/' } as ImportMetaEnv)).toEqual({
            apiBaseUrl: 'https://api.example.com'
        });
    });
});
