import type { CreateUserInput } from '@features/users/application/use-cases/CreateUser';
import type { DeleteUserInput } from '@features/users/application/use-cases/DeleteUser';
import type { UpdateUserInput } from '@features/users/application/use-cases/UpdateUser';
import type { User } from '@features/users/domain/entities/User';
import type { UsersRepository } from '@features/users/domain/ports/UsersRepository';
import { userSchema, usersListSchema } from '@features/users/infrastructure/schemas/UserSchema';
import type { HttpClient } from '@shared/http/HttpClient';

interface HttpUsersRepositoryOptions {
    endpoint?: string;
    httpClient: HttpClient;
}

export class HttpUsersRepository implements UsersRepository {
    readonly #endpoint: string;
    readonly #httpClient: HttpClient;

    constructor({ endpoint = '/api/v1/users', httpClient }: HttpUsersRepositoryOptions) {
        this.#endpoint = endpoint;
        this.#httpClient = httpClient;
    }

    async create(input: CreateUserInput): Promise<User> {
        const user: unknown = await this.#httpClient.post<unknown, CreateUserInput>(this.#endpoint, input);

        return userSchema.parse(user);
    }

    async delete(input: DeleteUserInput): Promise<void> {
        await this.#httpClient.delete(`${this.#endpoint}/${input.id}`);
    }

    async list(): Promise<User[]> {
        const response: unknown = await this.#httpClient.get<unknown>(this.#endpoint);

        return usersListSchema.parse(response).items;
    }

    async update(input: UpdateUserInput): Promise<User> {
        const { id, ...body } = input;
        const user: unknown = await this.#httpClient.put<unknown, Omit<UpdateUserInput, 'id'>>(`${this.#endpoint}/${id}`, body);

        return userSchema.parse(user);
    }
}
