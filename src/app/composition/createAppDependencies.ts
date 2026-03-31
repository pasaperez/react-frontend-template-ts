import type { AppEnvironment } from '@app/config/env';
import { loadAppEnvironment } from '@app/config/env';
import { createCreateUser } from '@features/users/application/use-cases/CreateUser';
import { createDeleteUser } from '@features/users/application/use-cases/DeleteUser';
import { createListUsers } from '@features/users/application/use-cases/ListUsers';
import { createUpdateUser } from '@features/users/application/use-cases/UpdateUser';
import type { UsersFeatureDependencies } from '@features/users/application/UsersFeatureDependencies';
import { HttpUsersRepository } from '@features/users/infrastructure/repositories/HttpUsersRepository';
import { FetchHttpClient } from '@shared/http/FetchHttpClient';
import type { HttpClient } from '@shared/http/HttpClient';

export interface AppDependencies {
    env: AppEnvironment;
    users: UsersFeatureDependencies;
}

interface CreateAppDependenciesOptions {
    env?: AppEnvironment;
    httpClient?: HttpClient;
}

export function createAppDependencies(options: CreateAppDependenciesOptions = {}): AppDependencies {
    const env: AppEnvironment = options.env ?? loadAppEnvironment();
    const httpClient: HttpClient = options.httpClient ?? new FetchHttpClient({ baseUrl: env.apiBaseUrl });
    const usersRepository: HttpUsersRepository = new HttpUsersRepository({ httpClient });

    return {
        env,
        users: {
            createUser: createCreateUser({ usersRepository }),
            deleteUser: createDeleteUser({ usersRepository }),
            listUsers: createListUsers({ usersRepository }),
            updateUser: createUpdateUser({ usersRepository })
        }
    };
}
