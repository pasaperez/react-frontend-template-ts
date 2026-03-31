import { createCreateUser, type CreateUserInput } from '@features/users/application/use-cases/CreateUser';
import { createDeleteUser } from '@features/users/application/use-cases/DeleteUser';
import { createListUsers } from '@features/users/application/use-cases/ListUsers';
import { createUpdateUser, type UpdateUserInput } from '@features/users/application/use-cases/UpdateUser';
import type { User } from '@features/users/domain/entities/User';
import type { UsersRepository } from '@features/users/domain/ports/UsersRepository';
import { describe, expect, it, vi } from 'vitest';

const users: User[] = [{
    id: '265adf75-b4e8-4084-8f5d-3cc287c11364',
    name: 'Alice',
    email: 'alice@example.com',
    createdAt: '2026-03-21T09:30:00.000Z',
    updatedAt: '2026-03-21T09:30:00.000Z'
}, {
    id: '791709cb-7e73-4b05-a245-8ae8b74995c3',
    name: 'Bob',
    email: 'bob@example.com',
    createdAt: '2026-03-20T09:30:00.000Z',
    updatedAt: '2026-03-20T09:30:00.000Z'
}];

describe('users use cases', () => {
    it('delegates user creation to the repository', async () => {
        const repository: UsersRepository = {
            create: vi.fn<UsersRepository['create']>().mockResolvedValue(users[0] as User),
            delete: vi.fn<UsersRepository['delete']>(),
            list: vi.fn<UsersRepository['list']>(),
            update: vi.fn<UsersRepository['update']>()
        };
        const input: CreateUserInput = { email: 'alice@example.com', name: 'Alice' };

        const created = await createCreateUser({ usersRepository: repository }).execute(input);

        expect(created).toEqual(users[0]);
        expect(repository.create).toHaveBeenCalledWith(input);
    });

    it('sorts the listed users from newest to oldest', async () => {
        const repository: UsersRepository = {
            create: vi.fn<UsersRepository['create']>(),
            delete: vi.fn<UsersRepository['delete']>(),
            list: vi.fn<UsersRepository['list']>().mockResolvedValue([users[1] as User, users[0] as User]),
            update: vi.fn<UsersRepository['update']>()
        };

        const listed = await createListUsers({ usersRepository: repository }).execute();

        expect(listed.map((user: User) => user.name)).toEqual(['Alice', 'Bob']);
    });

    it('delegates user updates and deletions to the repository', async () => {
        const repository: UsersRepository = {
            create: vi.fn<UsersRepository['create']>(),
            delete: vi.fn<UsersRepository['delete']>().mockResolvedValue(undefined),
            list: vi.fn<UsersRepository['list']>(),
            update: vi.fn<UsersRepository['update']>().mockResolvedValue(users[0] as User)
        };
        const updateInput: UpdateUserInput = { email: 'alice@example.com', id: users[0]!.id, name: 'Alice' };

        await expect(createUpdateUser({ usersRepository: repository }).execute(updateInput)).resolves.toEqual(users[0]);
        await expect(createDeleteUser({ usersRepository: repository }).execute({ id: users[0]!.id })).resolves.toBeUndefined();
        expect(repository.update).toHaveBeenCalledWith(updateInput);
        expect(repository.delete).toHaveBeenCalledWith({ id: users[0]!.id });
    });
});
