import type { UpdateUserInput, UpdateUserUseCase } from '@features/users/application/use-cases/UpdateUser';
import type { User } from '@features/users/domain/entities/User';
import { usersQueryKey } from '@features/users/ui/hooks/useUsersQuery';
import { type QueryClient, useMutation, type UseMutationResult, useQueryClient } from '@tanstack/react-query';

export function useUpdateUserMutation(updateUser: UpdateUserUseCase): UseMutationResult<User, Error, UpdateUserInput> {
    const queryClient: QueryClient = useQueryClient();

    return useMutation({
        mutationFn: (input: UpdateUserInput) => updateUser.execute(input),
        onSuccess: async (): Promise<void> => {
            await queryClient.invalidateQueries({ queryKey: usersQueryKey });
        }
    });
}
