import type { CreateUserInput } from '@features/users/application/use-cases/CreateUser';
import type { DeleteUserInput } from '@features/users/application/use-cases/DeleteUser';
import type { UpdateUserInput } from '@features/users/application/use-cases/UpdateUser';
import type { User } from '@features/users/domain/entities/User';

export interface UsersRepository {
    create(input: CreateUserInput): Promise<User>;
    delete(input: DeleteUserInput): Promise<void>;
    list(): Promise<User[]>;
    update(input: UpdateUserInput): Promise<User>;
}
