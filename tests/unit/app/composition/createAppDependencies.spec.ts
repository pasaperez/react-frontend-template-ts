import { createAppDependencies } from '@app/composition/createAppDependencies';
import { createHttpClientMock } from '@tests/helpers/createHttpClientMock';
import { describe, expect, it, vi } from 'vitest';

const sampleUser = {
    id: 'f84a87ad-94f7-48fb-a911-af882dadfefa',
    name: 'Alice',
    email: 'alice@example.com',
    createdAt: '2026-03-21T09:30:00.000Z',
    updatedAt: '2026-03-21T09:30:00.000Z'
};

function createJsonResponse(body: unknown): Response {
    return new Response(JSON.stringify(body), { status: 200, headers: { 'content-type': 'application/json' } });
}

describe('createAppDependencies', () => {
    it('uses injected dependencies when provided', async () => {
        const { deleteMock, getMock, httpClient, postMock, putMock } = createHttpClientMock();

        getMock.mockResolvedValue({ items: [sampleUser] });
        postMock.mockResolvedValue(sampleUser);
        putMock.mockResolvedValue(sampleUser);

        const dependencies = createAppDependencies({ env: { apiBaseUrl: 'https://api.example.com' }, httpClient });

        await expect(dependencies.users.listUsers.execute()).resolves.toEqual([sampleUser]);
        await expect(dependencies.users.createUser.execute({ email: sampleUser.email, name: sampleUser.name })).resolves.toEqual(
            sampleUser
        );
        await expect(dependencies.users.updateUser.execute({ email: sampleUser.email, id: sampleUser.id, name: sampleUser.name })).resolves
            .toEqual(sampleUser);
        await expect(dependencies.users.deleteUser.execute({ id: sampleUser.id })).resolves.toBeUndefined();
        expect(getMock).toHaveBeenCalledWith('/api/v1/users');
        expect(postMock).toHaveBeenCalledWith('/api/v1/users', { email: sampleUser.email, name: sampleUser.name });
        expect(putMock).toHaveBeenCalledWith(`/api/v1/users/${sampleUser.id}`, { email: sampleUser.email, name: sampleUser.name });
        expect(deleteMock).toHaveBeenCalledWith(`/api/v1/users/${sampleUser.id}`);
        expect(dependencies.env.apiBaseUrl).toBe('https://api.example.com');
    });

    it('creates fetch-backed adapters with the default environment when overrides are omitted', async () => {
        const expectedBaseUrl: string = import.meta.env.DEV ? '' : 'http://127.0.0.1:3000';
        const fetchMock = vi.fn<typeof fetch>().mockResolvedValueOnce(createJsonResponse({ items: [sampleUser] })).mockResolvedValueOnce(
            createJsonResponse(sampleUser)
        ).mockResolvedValueOnce(createJsonResponse(sampleUser)).mockResolvedValueOnce(new Response(null, { status: 204 }));

        vi.stubGlobal('fetch', fetchMock);

        const dependencies = createAppDependencies();

        await expect(dependencies.users.listUsers.execute()).resolves.toEqual([sampleUser]);
        await expect(dependencies.users.createUser.execute({ email: sampleUser.email, name: sampleUser.name })).resolves.toEqual(
            sampleUser
        );
        await expect(dependencies.users.updateUser.execute({ email: sampleUser.email, id: sampleUser.id, name: sampleUser.name })).resolves
            .toEqual(sampleUser);
        await expect(dependencies.users.deleteUser.execute({ id: sampleUser.id })).resolves.toBeUndefined();
        expect(dependencies.env.apiBaseUrl).toBe(expectedBaseUrl);
        expect(fetchMock).toHaveBeenNthCalledWith(1, `${expectedBaseUrl}/api/v1/users`, {
            headers: { Accept: 'application/json' },
            method: 'GET'
        });
        expect(fetchMock).toHaveBeenNthCalledWith(2, `${expectedBaseUrl}/api/v1/users`, {
            body: JSON.stringify({ email: sampleUser.email, name: sampleUser.name }),
            headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
            method: 'POST'
        });
        expect(fetchMock).toHaveBeenNthCalledWith(3, `${expectedBaseUrl}/api/v1/users/${sampleUser.id}`, {
            body: JSON.stringify({ email: sampleUser.email, name: sampleUser.name }),
            headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
            method: 'PUT'
        });
        expect(fetchMock).toHaveBeenNthCalledWith(4, `${expectedBaseUrl}/api/v1/users/${sampleUser.id}`, {
            headers: { Accept: 'application/json' },
            method: 'DELETE'
        });
    });
});
