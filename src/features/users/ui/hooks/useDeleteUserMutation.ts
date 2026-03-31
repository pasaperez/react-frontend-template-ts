import type { DeleteUserInput, DeleteUserUseCase } from '@features/users/application/use-cases/DeleteUser';
import { usersQueryKey } from '@features/users/ui/hooks/useUsersQuery';
import { type QueryClient, useMutation, type UseMutationResult, useQueryClient } from '@tanstack/react-query';

export function useDeleteUserMutation(deleteUser: DeleteUserUseCase): UseMutationResult<void, Error, DeleteUserInput> {
    const queryClient: QueryClient = useQueryClient();

    return useMutation({
        mutationFn: (input: DeleteUserInput) => deleteUser.execute(input),
        onSuccess: async (): Promise<void> => {
            await queryClient.invalidateQueries({ queryKey: usersQueryKey });
        }
    });
}
