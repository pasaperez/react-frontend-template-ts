import { App } from '@app/App';
import type { AppDependencies } from '@app/composition/createAppDependencies';
import type { User } from '@features/users/domain/entities/User';
import { HttpError } from '@shared/http/HttpError';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

interface Deferred<T> {
    promise: Promise<T>;
    resolve: (value: T) => void;
}

function createDeferred<T>(): Deferred<T> {
    let resolve!: (value: T) => void;
    const promise = new Promise<T>((nextResolve: (value: T) => void): void => {
        resolve = nextResolve;
    });

    return { promise, resolve };
}

function createDependencies(overrides?: Partial<AppDependencies['users']>): AppDependencies {
    return {
        env: { apiBaseUrl: 'http://127.0.0.1:3000' },
        users: {
            createUser: overrides?.createUser ?? { execute: vi.fn().mockResolvedValue(undefined) },
            deleteUser: overrides?.deleteUser ?? { execute: vi.fn().mockResolvedValue(undefined) },
            listUsers: overrides?.listUsers ?? { execute: vi.fn().mockResolvedValue([]) },
            updateUser: overrides?.updateUser ?? { execute: vi.fn().mockResolvedValue(undefined) }
        }
    };
}

describe('App', () => {
    it('loads users and supports create, edit, close, and delete flows', async () => {
        const users: User[] = [];
        const deleteUserDeferred = createDeferred<void>();
        const listUsers = { execute: vi.fn().mockImplementation(() => Promise.resolve([...users])) };
        const createUser = {
            execute: vi.fn().mockImplementation(({ email, name }: { email: string; name: string; }) => {
                const createdUser: User = {
                    id: 'bcf425b0-6e12-4408-83bf-4c8e3af8b2e0',
                    name,
                    email,
                    createdAt: '2026-03-21T12:00:00.000Z',
                    updatedAt: '2026-03-21T12:00:00.000Z'
                };
                users.push(createdUser);
                return Promise.resolve(createdUser);
            })
        };
        const updateUser = {
            execute: vi.fn().mockImplementation(({ email, id, name }: { email: string; id: string; name: string; }) => {
                const userIndex: number = users.findIndex((user: User) => user.id === id);
                const updatedUser: User = { ...(users[userIndex] as User), email, name, updatedAt: '2026-03-22T12:00:00.000Z' };
                users.splice(userIndex, 1, updatedUser);
                return Promise.resolve(updatedUser);
            })
        };
        const deleteUser = {
            execute: vi.fn().mockImplementation(({ id }: { id: string; }) => {
                return deleteUserDeferred.promise.then(() => {
                    const userIndex: number = users.findIndex((user: User) => user.id === id);
                    users.splice(userIndex, 1);
                });
            })
        };

        render(<App dependencies={createDependencies({ createUser, deleteUser, listUsers, updateUser })} />);

        expect(await screen.findByRole('heading', { name: 'Users' })).toBeInTheDocument();
        expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
        expect(window.location.pathname).toBe('/users');
        expect(document.title).toBe('Users | React Frontend Template TS');
        expect(document.querySelector('meta[name="description"]')?.getAttribute('content')).toBe(
            'Users CRUD connected to the backend template with accessible table, form, and status feedback.'
        );
        expect(await screen.findByRole('heading', { name: 'No users yet' })).toBeInTheDocument();

        fireEvent.click(screen.getByRole('button', { name: 'New user' }));
        expect(screen.getByRole('heading', { name: 'New user' })).toBeInTheDocument();
        fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'Alice Example' } });
        fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'alice@example.com' } });
        fireEvent.click(screen.getByRole('button', { name: 'Create user' }));

        await waitFor(() => expect(createUser.execute).toHaveBeenCalledWith({ email: 'alice@example.com', name: 'Alice Example' }));
        await waitFor(() => expect(listUsers.execute).toHaveBeenCalledTimes(2));
        expect(await screen.findByText('alice@example.com')).toBeInTheDocument();
        expect(screen.queryByRole('heading', { name: 'New user' })).not.toBeInTheDocument();

        fireEvent.click(screen.getByRole('button', { name: 'Edit Alice Example' }));

        expect(screen.getByRole('heading', { name: 'Edit user' })).toBeInTheDocument();
        expect(screen.getByLabelText('Name')).toHaveValue('Alice Example');
        expect(screen.getByLabelText('Email')).toHaveValue('alice@example.com');

        fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'Alice Example Draft' } });
        fireEvent.click(screen.getByRole('button', { name: 'Close' }));

        expect(screen.queryByRole('heading', { name: 'Edit user' })).not.toBeInTheDocument();
        expect(screen.queryByLabelText('Name')).not.toBeInTheDocument();

        fireEvent.click(screen.getByRole('button', { name: 'Edit Alice Example' }));
        fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'Alice Smith' } });
        fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'alice.smith@example.com' } });
        fireEvent.click(screen.getByRole('button', { name: 'Save changes' }));

        await waitFor(() =>
            expect(updateUser.execute).toHaveBeenCalledWith({
                email: 'alice.smith@example.com',
                id: 'bcf425b0-6e12-4408-83bf-4c8e3af8b2e0',
                name: 'Alice Smith'
            })
        );
        expect(await screen.findByText('alice.smith@example.com')).toBeInTheDocument();
        expect(screen.queryByRole('heading', { name: 'Edit user' })).not.toBeInTheDocument();

        fireEvent.click(screen.getByRole('button', { name: 'Edit Alice Smith' }));
        fireEvent.click(screen.getByRole('button', { name: 'Delete Alice Smith' }));
        expect(screen.getByRole('button', { name: 'Confirm deleting Alice Smith' })).toBeInTheDocument();
        fireEvent.click(screen.getByRole('button', { name: 'Confirm deleting Alice Smith' }));

        expect(await screen.findByRole('button', { name: 'Confirm deleting Alice Smith' })).toBeDisabled();
        deleteUserDeferred.resolve(undefined);
        await waitFor(() => expect(deleteUser.execute).toHaveBeenCalledWith({ id: 'bcf425b0-6e12-4408-83bf-4c8e3af8b2e0' }));
        expect(await screen.findByRole('heading', { name: 'No users yet' })).toBeInTheDocument();
        expect(screen.queryByRole('heading', { name: 'Edit user' })).not.toBeInTheDocument();
    });

    it('shows validation feedback without calling the mutation when form values are invalid', async () => {
        const createUser = { execute: vi.fn() };
        const deleteUser = { execute: vi.fn() };
        const listUsers = { execute: vi.fn().mockResolvedValue([]) };
        const updateUser = { execute: vi.fn() };

        render(<App dependencies={createDependencies({ createUser, deleteUser, listUsers, updateUser })} />);

        expect(await screen.findByRole('heading', { name: 'No users yet' })).toBeInTheDocument();

        fireEvent.click(screen.getByRole('button', { name: 'New user' }));
        fireEvent.click(screen.getByRole('button', { name: 'Create user' }));

        expect(await screen.findByText('Name must have at least 2 characters.')).toBeInTheDocument();
        expect(screen.getByText('Use a valid email.')).toBeInTheDocument();
        expect(createUser.execute).not.toHaveBeenCalled();
    });

    it('shows pending labels while create and update mutations are running', async () => {
        const existingUser: User = {
            id: 'bcf425b0-6e12-4408-83bf-4c8e3af8b2e0',
            name: 'Alice Example',
            email: 'alice@example.com',
            createdAt: '2026-03-21T12:00:00.000Z',
            updatedAt: '2026-03-21T12:00:00.000Z'
        };
        const createUserDeferred = createDeferred<User>();
        const updateUserDeferred = createDeferred<User>();
        const createUser = { execute: vi.fn().mockImplementation(() => createUserDeferred.promise) };
        const updateUser = { execute: vi.fn().mockImplementation(() => updateUserDeferred.promise) };
        const listUsers = { execute: vi.fn().mockResolvedValue([existingUser]) };

        render(<App dependencies={createDependencies({ createUser, listUsers, updateUser })} />);

        expect(await screen.findByText('alice@example.com')).toBeInTheDocument();

        fireEvent.click(screen.getByRole('button', { name: 'New user' }));
        fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'Alice Example' } });
        fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'alice@example.com' } });
        fireEvent.click(screen.getByRole('button', { name: 'Create user' }));

        expect(await screen.findByRole('button', { name: 'Creating...' })).toBeDisabled();
        createUserDeferred.resolve(existingUser);
        await waitFor(() => expect(createUser.execute).toHaveBeenCalledTimes(1));

        fireEvent.click(screen.getByRole('button', { name: 'Edit Alice Example' }));
        fireEvent.click(screen.getByRole('button', { name: 'Save changes' }));

        expect(await screen.findByRole('button', { name: 'Saving...' })).toBeDisabled();
        updateUserDeferred.resolve(existingUser);
        await waitFor(() => expect(updateUser.execute).toHaveBeenCalledTimes(1));
    });

    it('deletes a user without editor open when nothing is selected', async () => {
        const users: User[] = [{
            id: 'bcf425b0-6e12-4408-83bf-4c8e3af8b2e0',
            name: 'Alice Example',
            email: 'alice@example.com',
            createdAt: '2026-03-21T12:00:00.000Z',
            updatedAt: '2026-03-21T12:00:00.000Z'
        }];
        const deleteUserDeferred = createDeferred<void>();
        const deleteUser = {
            execute: vi.fn().mockImplementation(({ id }: { id: string; }) => {
                return deleteUserDeferred.promise.then(() => {
                    const userIndex: number = users.findIndex((user: User) => user.id === id);
                    users.splice(userIndex, 1);
                });
            })
        };
        const listUsers = { execute: vi.fn().mockImplementation(() => Promise.resolve([...users])) };

        render(<App dependencies={createDependencies({ deleteUser, listUsers })} />);

        expect(await screen.findByText('alice@example.com')).toBeInTheDocument();

        fireEvent.click(screen.getByRole('button', { name: 'Delete Alice Example' }));
        fireEvent.click(screen.getByRole('button', { name: 'Cancel deleting Alice Example' }));
        expect(screen.queryByRole('button', { name: 'Confirm deleting Alice Example' })).not.toBeInTheDocument();
        fireEvent.click(screen.getByRole('button', { name: 'Delete Alice Example' }));
        fireEvent.click(screen.getByRole('button', { name: 'Confirm deleting Alice Example' }));

        expect(await screen.findByRole('button', { name: 'Confirm deleting Alice Example' })).toBeDisabled();
        deleteUserDeferred.resolve(undefined);
        await waitFor(() => expect(deleteUser.execute).toHaveBeenCalledWith({ id: 'bcf425b0-6e12-4408-83bf-4c8e3af8b2e0' }));
        expect(await screen.findByRole('heading', { name: 'No users yet' })).toBeInTheDocument();
        expect(screen.queryByRole('heading', { name: 'Edit user' })).not.toBeInTheDocument();
    });

    it('disables destructive actions for other rows while a deletion is pending', async () => {
        const users: User[] = [{
            id: 'bcf425b0-6e12-4408-83bf-4c8e3af8b2e0',
            name: 'Alice Example',
            email: 'alice@example.com',
            createdAt: '2026-03-21T12:00:00.000Z',
            updatedAt: '2026-03-21T12:00:00.000Z'
        }, {
            id: 'c2f3551d-3ff4-4892-b355-f842bb8b1907',
            name: 'Bob Example',
            email: 'bob@example.com',
            createdAt: '2026-03-21T12:05:00.000Z',
            updatedAt: '2026-03-21T12:05:00.000Z'
        }];
        const deleteUserDeferred = createDeferred<void>();
        const deleteUser = {
            execute: vi.fn().mockImplementation(({ id }: { id: string; }) => {
                return deleteUserDeferred.promise.then(() => {
                    const userIndex: number = users.findIndex((user: User) => user.id === id);
                    users.splice(userIndex, 1);
                });
            })
        };
        const listUsers = { execute: vi.fn().mockImplementation(() => Promise.resolve([...users])) };

        render(<App dependencies={createDependencies({ deleteUser, listUsers })} />);

        expect(await screen.findByText('alice@example.com')).toBeInTheDocument();
        expect(screen.getByText('bob@example.com')).toBeInTheDocument();

        fireEvent.click(screen.getByRole('button', { name: 'Delete Alice Example' }));
        fireEvent.click(screen.getByRole('button', { name: 'Confirm deleting Alice Example' }));

        expect(await screen.findByRole('button', { name: 'Confirm deleting Alice Example' })).toBeDisabled();
        expect(screen.getByRole('button', { name: 'Delete Bob Example' })).toBeDisabled();

        deleteUserDeferred.resolve(undefined);
        await waitFor(() => expect(deleteUser.execute).toHaveBeenCalledWith({ id: 'bcf425b0-6e12-4408-83bf-4c8e3af8b2e0' }));
    });

    it('surfaces query failures through the page model', async () => {
        const listUsers = { execute: vi.fn().mockRejectedValue(new Error('Backend unavailable')) };

        render(<App dependencies={createDependencies({ listUsers })} />);

        expect(await screen.findByText('Backend unavailable', {}, { timeout: 2500 })).toBeInTheDocument();
        expect(screen.queryByRole('heading', { name: 'No users yet' })).not.toBeInTheDocument();
    });

    it('surfaces create and update failures through the page model', async () => {
        const createUser = {
            execute: vi.fn().mockRejectedValue(new HttpError({ code: 'INVALID_REQUEST', message: 'Email already exists', statusCode: 400 }))
        };
        const listUsers = {
            execute: vi.fn().mockResolvedValue([
                {
                    id: 'bcf425b0-6e12-4408-83bf-4c8e3af8b2e0',
                    name: 'Alice Example',
                    email: 'alice@example.com',
                    createdAt: '2026-03-21T12:00:00.000Z',
                    updatedAt: '2026-03-21T12:00:00.000Z'
                } satisfies User
            ])
        };
        const updateUser = {
            execute: vi.fn().mockRejectedValue(new HttpError({ code: 'INVALID_REQUEST', message: 'Cannot update user', statusCode: 400 }))
        };

        render(<App dependencies={createDependencies({ createUser, listUsers, updateUser })} />);

        fireEvent.click(screen.getByRole('button', { name: 'New user' }));
        fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'Alice Example' } });
        fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'alice@example.com' } });
        fireEvent.click(screen.getByRole('button', { name: 'Create user' }));

        expect(await screen.findByRole('alert')).toHaveTextContent('Email already exists');

        fireEvent.click(screen.getByRole('button', { name: 'Edit Alice Example' }));
        fireEvent.click(screen.getByRole('button', { name: 'Save changes' }));

        expect(await screen.findByRole('alert')).toHaveTextContent('Cannot update user');
    });

    it('surfaces deletion failures through the page model', async () => {
        const deleteUser = {
            execute: vi.fn().mockRejectedValue(new HttpError({ code: 'INVALID_REQUEST', message: 'Cannot delete user', statusCode: 400 }))
        };
        const listUsers = {
            execute: vi.fn().mockResolvedValue([
                {
                    id: 'bcf425b0-6e12-4408-83bf-4c8e3af8b2e0',
                    name: 'Alice Example',
                    email: 'alice@example.com',
                    createdAt: '2026-03-21T12:00:00.000Z',
                    updatedAt: '2026-03-21T12:00:00.000Z'
                } satisfies User
            ])
        };

        render(<App dependencies={createDependencies({ deleteUser, listUsers })} />);

        expect(await screen.findByText('alice@example.com')).toBeInTheDocument();
        fireEvent.click(screen.getByRole('button', { name: 'Delete Alice Example' }));
        fireEvent.click(screen.getByRole('button', { name: 'Confirm deleting Alice Example' }));

        expect(await screen.findByRole('alert')).toHaveTextContent('Cannot delete user');
    });
});
