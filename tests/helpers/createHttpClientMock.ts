import type { HttpClient } from '@shared/http/HttpClient';
import { vi } from 'vitest';

export interface HttpClientMock {
    deleteMock: ReturnType<typeof vi.fn<(path: string) => Promise<void>>>;
    getMock: ReturnType<typeof vi.fn<(path: string) => Promise<unknown>>>;
    httpClient: HttpClient;
    postMock: ReturnType<typeof vi.fn<(path: string, body: unknown) => Promise<unknown>>>;
    putMock: ReturnType<typeof vi.fn<(path: string, body: unknown) => Promise<unknown>>>;
}

export function createHttpClientMock(): HttpClientMock {
    const deleteMock = vi.fn<(path: string) => Promise<void>>((_path: string) => Promise.resolve(undefined));
    const getMock = vi.fn<(path: string) => Promise<unknown>>((_path: string) => Promise.resolve(undefined));
    const postMock = vi.fn<(path: string, body: unknown) => Promise<unknown>>((_path: string, _body: unknown) =>
        Promise.resolve(undefined)
    );
    const putMock = vi.fn<(path: string, body: unknown) => Promise<unknown>>((_path: string, _body: unknown) => Promise.resolve(undefined));
    const httpClient: HttpClient = {
        delete: ((path: string) => deleteMock(path)) as HttpClient['delete'],
        get: ((path: string) => getMock(path)) as HttpClient['get'],
        post: ((path: string, body: unknown) => postMock(path, body)) as HttpClient['post'],
        put: ((path: string, body: unknown) => putMock(path, body)) as HttpClient['put']
    };

    return { deleteMock, getMock, httpClient, postMock, putMock };
}
