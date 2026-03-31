import type { User } from '@features/users/domain/entities/User';
import type { UsersRepository } from '@features/users/domain/ports/UsersRepository';

export interface CreateUserInput {
    email: string;
    name: string;
}

export interface CreateUserUseCase {
    execute(input: CreateUserInput): Promise<User>;
}

export function createCreateUser({ usersRepository }: { usersRepository: UsersRepository; }): CreateUserUseCase {
    return {
        execute(input: CreateUserInput): Promise<User> {
            return usersRepository.create(input);
        }
    };
}
