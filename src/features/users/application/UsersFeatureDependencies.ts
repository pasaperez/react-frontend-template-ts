import type { CreateUserUseCase } from '@features/users/application/use-cases/CreateUser';
import type { DeleteUserUseCase } from '@features/users/application/use-cases/DeleteUser';
import type { ListUsersUseCase } from '@features/users/application/use-cases/ListUsers';
import type { UpdateUserUseCase } from '@features/users/application/use-cases/UpdateUser';

export interface UsersFeatureDependencies {
    createUser: CreateUserUseCase;
    deleteUser: DeleteUserUseCase;
    listUsers: ListUsersUseCase;
    updateUser: UpdateUserUseCase;
}
