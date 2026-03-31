import { FetchHttpClient } from '@shared/http/FetchHttpClient';
import { HttpError, toErrorMessage } from '@shared/http/HttpError';
import { describe, expect, it, vi } from 'vitest';

function createJsonResponse(body: unknown, status = 200): Response {
    return new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json' } });
}

describe('FetchHttpClient', () => {
    it('sends requests against the configured base URL and returns parsed JSON', async () => {
        const fetchImplementation = vi.fn<typeof fetch>().mockResolvedValue(createJsonResponse({ items: [] }));
        const client = new FetchHttpClient({ baseUrl: 'http://127.0.0.1:3000/', fetchImplementation });

        const response = await client.get<{ items: unknown[]; }>('/api/v1/users');

        expect(response).toEqual({ items: [] });
        expect(fetchImplementation).toHaveBeenCalledWith('http://127.0.0.1:3000/api/v1/users', {
            headers: { Accept: 'application/json' },
            method: 'GET'
        });
    });

    it('binds the default global fetch so browser calls do not fail with illegal invocation', async () => {
        const originalFetch = globalThis.fetch;
        const fetchImplementation = vi.fn(function(this: typeof globalThis): Promise<Response> {
            if (this !== globalThis) {
                throw new TypeError('Illegal invocation');
            }

            return Promise.resolve(createJsonResponse({ items: [] }));
        }) as typeof fetch;

        vi.stubGlobal('fetch', fetchImplementation);

        const client = new FetchHttpClient({ baseUrl: 'http://127.0.0.1:3000' });

        await expect(client.get<{ items: unknown[]; }>('/api/v1/users')).resolves.toEqual({ items: [] });
        expect(fetchImplementation).toHaveBeenCalled();

        vi.stubGlobal('fetch', originalFetch);
    });

    it('normalizes backend JSON errors into HttpError instances', async () => {
        const fetchImplementation = vi.fn<typeof fetch>().mockResolvedValue(
            createJsonResponse({ error: { code: 'INVALID_REQUEST', message: 'Invalid request body' } }, 400)
        );
        const client = new FetchHttpClient({ baseUrl: 'http://127.0.0.1:3000', fetchImplementation });

        await expect(client.post('/api/v1/users', { name: 'Alice' })).rejects.toEqual(
            new HttpError({ code: 'INVALID_REQUEST', message: 'Invalid request body', statusCode: 400 })
        );
    });

    it('supports put and delete requests', async () => {
        const fetchImplementation = vi.fn<typeof fetch>().mockResolvedValueOnce(createJsonResponse({ ok: true })).mockResolvedValueOnce(
            new Response(null, { status: 204 })
        );
        const client = new FetchHttpClient({ baseUrl: 'http://127.0.0.1:3000', fetchImplementation });

        await expect(client.put('/api/v1/users/123', { email: 'alice@example.com' })).resolves.toEqual({ ok: true });
        await expect(client.delete('/api/v1/users/123')).resolves.toBeUndefined();
        expect(fetchImplementation).toHaveBeenNthCalledWith(1, 'http://127.0.0.1:3000/api/v1/users/123', {
            body: JSON.stringify({ email: 'alice@example.com' }),
            headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
            method: 'PUT'
        });
        expect(fetchImplementation).toHaveBeenNthCalledWith(2, 'http://127.0.0.1:3000/api/v1/users/123', {
            headers: { Accept: 'application/json' },
            method: 'DELETE'
        });
    });

    it('falls back to a generic HTTP error when the response body is not JSON', async () => {
        const fetchImplementation = vi.fn<typeof fetch>().mockResolvedValue(new Response('failure', { status: 503 }));
        const client = new FetchHttpClient({ baseUrl: 'http://127.0.0.1:3000', fetchImplementation });

        await expect(client.get('/api/v1/users')).rejects.toEqual(
            new HttpError({ code: 'HTTP_ERROR', message: 'Request failed with status 503.', statusCode: 503 })
        );
    });

    it('treats responses without a content type as empty bodies', async () => {
        const fetchImplementation = vi.fn<typeof fetch>().mockResolvedValue(new Response(null, { status: 500 }));
        const client = new FetchHttpClient({ baseUrl: 'http://127.0.0.1:3000', fetchImplementation });

        await expect(client.get('/api/v1/users')).rejects.toEqual(
            new HttpError({ code: 'HTTP_ERROR', message: 'Request failed with status 500.', statusCode: 500 })
        );
    });

    it('converts known and unknown failures into safe UI messages', () => {
        expect(toErrorMessage(new HttpError({ code: 'USER_NOT_FOUND', message: 'User not found', statusCode: 404 }), 'Fallback')).toBe(
            'User not found'
        );
        expect(toErrorMessage(new Error('Boom'), 'Fallback')).toBe('Boom');
        expect(toErrorMessage('not-an-error', 'Fallback')).toBe('Fallback');
    });
});
