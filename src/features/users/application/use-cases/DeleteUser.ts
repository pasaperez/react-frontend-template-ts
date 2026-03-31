import type { UsersRepository } from '@features/users/domain/ports/UsersRepository';

export interface DeleteUserInput {
    id: string;
}

export interface DeleteUserUseCase {
    execute(input: DeleteUserInput): Promise<void>;
}

export function createDeleteUser({ usersRepository }: { usersRepository: UsersRepository; }): DeleteUserUseCase {
    return {
        execute(input: DeleteUserInput): Promise<void> {
            return usersRepository.delete(input);
        }
    };
}
