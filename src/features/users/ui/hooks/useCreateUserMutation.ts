import type { CreateUserInput, CreateUserUseCase } from '@features/users/application/use-cases/CreateUser';
import type { User } from '@features/users/domain/entities/User';
import { usersQueryKey } from '@features/users/ui/hooks/useUsersQuery';
import { type QueryClient, useMutation, type UseMutationResult, useQueryClient } from '@tanstack/react-query';

export function useCreateUserMutation(createUser: CreateUserUseCase): UseMutationResult<User, Error, CreateUserInput> {
    const queryClient: QueryClient = useQueryClient();

    return useMutation({
        mutationFn: (input: CreateUserInput) => createUser.execute(input),
        onSuccess: async (): Promise<void> => {
            await queryClient.invalidateQueries({ queryKey: usersQueryKey });
        }
    });
}
