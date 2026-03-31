import { HttpUsersRepository } from '@features/users/infrastructure/repositories/HttpUsersRepository';
import { createHttpClientMock } from '@tests/helpers/createHttpClientMock';
import { describe, expect, it } from 'vitest';

const sampleUser = {
    id: '219d8d70-a5f7-4621-b6e8-b1ec7417659f',
    name: 'Alice',
    email: 'alice@example.com',
    createdAt: '2026-03-21T09:30:00.000Z',
    updatedAt: '2026-03-21T09:30:00.000Z'
};

describe('HttpUsersRepository', () => {
    it('lists users from the configured endpoint', async () => {
        const { getMock, httpClient } = createHttpClientMock();
        const repository = new HttpUsersRepository({ endpoint: '/custom-users', httpClient });

        getMock.mockResolvedValue({ items: [sampleUser] });

        const users = await repository.list();

        expect(users).toEqual([sampleUser]);
        expect(getMock).toHaveBeenCalledWith('/custom-users');
    });

    it('creates users through the default backend endpoint', async () => {
        const { httpClient, postMock } = createHttpClientMock();
        const repository = new HttpUsersRepository({ httpClient });

        postMock.mockResolvedValue(sampleUser);

        const user = await repository.create({ email: 'alice@example.com', name: 'Alice' });

        expect(user).toEqual(sampleUser);
        expect(postMock).toHaveBeenCalledWith('/api/v1/users', { email: 'alice@example.com', name: 'Alice' });
    });

    it('updates and deletes users through the backend endpoint', async () => {
        const { deleteMock, httpClient, putMock } = createHttpClientMock();
        const repository = new HttpUsersRepository({ httpClient });

        putMock.mockResolvedValue(sampleUser);

        await expect(repository.update({ email: 'alice@example.com', id: '219d8d70-a5f7-4621-b6e8-b1ec7417659f', name: 'Alice' })).resolves
            .toEqual(sampleUser);
        await expect(repository.delete({ id: '219d8d70-a5f7-4621-b6e8-b1ec7417659f' })).resolves.toBeUndefined();
        expect(putMock).toHaveBeenCalledWith('/api/v1/users/219d8d70-a5f7-4621-b6e8-b1ec7417659f', {
            email: 'alice@example.com',
            name: 'Alice'
        });
        expect(deleteMock).toHaveBeenCalledWith('/api/v1/users/219d8d70-a5f7-4621-b6e8-b1ec7417659f');
    });

    it('rejects responses that do not match the backend contract', async () => {
        const { getMock, httpClient } = createHttpClientMock();
        const repository = new HttpUsersRepository({ httpClient });

        getMock.mockResolvedValue({ items: [{ ...sampleUser, id: 'not-a-uuid' }] });

        await expect(repository.list()).rejects.toThrow();
    });
});
