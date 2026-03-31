import type { ListUsersUseCase } from '@features/users/application/use-cases/ListUsers';
import type { User } from '@features/users/domain/entities/User';
import { useQuery, type UseQueryResult } from '@tanstack/react-query';

export const usersQueryKey: readonly ['users'] = ['users'];

export function useUsersQuery(listUsers: ListUsersUseCase): UseQueryResult<User[], Error> {
    return useQuery({ queryKey: usersQueryKey, queryFn: () => listUsers.execute() });
}
