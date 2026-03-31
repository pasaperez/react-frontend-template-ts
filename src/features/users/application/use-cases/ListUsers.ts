import { sortUsersByNewest, type User } from '@features/users/domain/entities/User';
import type { UsersRepository } from '@features/users/domain/ports/UsersRepository';

export interface ListUsersUseCase {
    execute(): Promise<User[]>;
}

export function createListUsers({ usersRepository }: { usersRepository: UsersRepository; }): ListUsersUseCase {
    return {
        async execute(): Promise<User[]> {
            const users: User[] = await usersRepository.list();

            return sortUsersByNewest(users);
        }
    };
}
