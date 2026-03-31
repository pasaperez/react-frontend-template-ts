import type { User } from '@features/users/domain/entities/User';
import type { UsersRepository } from '@features/users/domain/ports/UsersRepository';

export interface UpdateUserInput {
    id: string;
    email: string;
    name: string;
}

export interface UpdateUserUseCase {
    execute(input: UpdateUserInput): Promise<User>;
}

export function createUpdateUser({ usersRepository }: { usersRepository: UsersRepository; }): UpdateUserUseCase {
    return {
        execute(input: UpdateUserInput): Promise<User> {
            return usersRepository.update(input);
        }
    };
}
