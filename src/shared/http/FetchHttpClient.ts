import type { HttpClient } from '@shared/http/HttpClient';
import { HttpError } from '@shared/http/HttpError';

interface FetchHttpClientOptions {
    baseUrl: string;
    fetchImplementation?: typeof fetch;
}

interface ErrorPayload {
    error?: { code?: string; message?: string; };
}

export class FetchHttpClient implements HttpClient {
    readonly #baseUrl: string;
    readonly #fetchImplementation: typeof fetch;

    constructor({ baseUrl, fetchImplementation }: FetchHttpClientOptions) {
        this.#baseUrl = baseUrl.replace(/\/$/, '');
        this.#fetchImplementation = fetchImplementation ?? globalThis.fetch.bind(globalThis);
    }

    async get<TResponse>(path: string): Promise<TResponse> {
        return this.request<TResponse>(path, { method: 'GET' });
    }

    async delete(path: string): Promise<void> {
        await this.request<null>(path, { method: 'DELETE' });
    }

    async post<TResponse, TBody>(path: string, body: TBody): Promise<TResponse> {
        return this.request<TResponse>(path, {
            method: 'POST',
            body: JSON.stringify(body),
            headers: { 'Content-Type': 'application/json' }
        });
    }

    async put<TResponse, TBody>(path: string, body: TBody): Promise<TResponse> {
        return this.request<TResponse>(path, {
            method: 'PUT',
            body: JSON.stringify(body),
            headers: { 'Content-Type': 'application/json' }
        });
    }

    private async request<TResponse>(path: string, init: RequestInit): Promise<TResponse> {
        const response: Response = await this.#fetchImplementation(`${this.#baseUrl}${path}`, {
            ...init,
            headers: { Accept: 'application/json', ...init.headers }
        });
        const payload: unknown = await this.parseBody(response);

        if (!response.ok) {
            const errorPayload: ErrorPayload = typeof payload === 'object' && payload !== null ? payload as ErrorPayload : {};

            throw new HttpError({
                code: errorPayload.error?.code ?? 'HTTP_ERROR',
                message: errorPayload.error?.message ?? `Request failed with status ${response.status}.`,
                statusCode: response.status
            });
        }

        return payload as TResponse;
    }

    private async parseBody(response: Response): Promise<unknown> {
        const contentType: string = response.headers.get('content-type') ?? '';

        if (contentType.includes('application/json')) {
            return response.json();
        }

        return null;
    }
}
