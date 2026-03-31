import { sortUsersByNewest, type User } from '@features/users/domain/entities/User';
import { describe, expect, it } from 'vitest';

describe('sortUsersByNewest', () => {
    it('returns users ordered from newest to oldest', () => {
        const users: User[] = [{
            id: '1e74c45d-0a31-40ea-818a-ec463694d0b9',
            name: 'Older',
            email: 'older@example.com',
            createdAt: '2026-03-20T10:00:00.000Z',
            updatedAt: '2026-03-20T10:00:00.000Z'
        }, {
            id: 'bfec9f82-7130-4bde-afef-5609ca4d36d9',
            name: 'Newer',
            email: 'newer@example.com',
            createdAt: '2026-03-21T10:00:00.000Z',
            updatedAt: '2026-03-21T10:00:00.000Z'
        }];

        expect(sortUsersByNewest(users).map((user: User) => user.name)).toEqual(['Newer', 'Older']);
        expect(users[0]?.name).toBe('Older');
    });
});
