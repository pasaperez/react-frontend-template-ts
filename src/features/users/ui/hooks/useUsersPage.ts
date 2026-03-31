import type { UsersFeatureDependencies } from '@features/users/application/UsersFeatureDependencies';
import type { User } from '@features/users/domain/entities/User';
import { userFormSchema, type UserFormValues } from '@features/users/ui/forms/UserFormSchema';
import { useCreateUserMutation } from '@features/users/ui/hooks/useCreateUserMutation';
import { useDeleteUserMutation } from '@features/users/ui/hooks/useDeleteUserMutation';
import { useUpdateUserMutation } from '@features/users/ui/hooks/useUpdateUserMutation';
import { useUsersQuery } from '@features/users/ui/hooks/useUsersQuery';
import { zodResolver } from '@hookform/resolvers/zod';
import { toErrorMessage } from '@shared/http/HttpError';
import { type BaseSyntheticEvent, useState } from 'react';
import { type SubmitHandler, useForm, type UseFormRegisterReturn } from 'react-hook-form';

export interface UsersPageViewModel {
    confirmingDeleteUserId?: string | undefined;
    deletingUserId?: string | undefined;
    deleteErrorMessage?: string | undefined;
    editingUserId?: string | undefined;
    editorTitle?: string | undefined;
    emailError?: string | undefined;
    emailField: UseFormRegisterReturn;
    isEditorOpen: boolean;
    isDeleting: boolean;
    isLoading: boolean;
    isSubmitting: boolean;
    loadErrorMessage?: string | undefined;
    nameError?: string | undefined;
    nameField: UseFormRegisterReturn;
    onCancelDelete: () => void;
    onCancelEdit: () => void;
    onDelete: (user: User) => Promise<void>;
    onEdit: (user: User) => void;
    onOpenCreate: () => void;
    onSubmit: (event?: BaseSyntheticEvent) => Promise<void>;
    recordsLabel: string;
    submitButtonLabel?: string | undefined;
    submitErrorMessage?: string | undefined;
    users: User[];
}

export function useUsersPage(dependencies: UsersFeatureDependencies): UsersPageViewModel {
    const [confirmingDeleteUserId, setConfirmingDeleteUserId] = useState<string>();
    const [editingUserId, setEditingUserId] = useState<string>();
    const [isEditorOpen, setIsEditorOpen] = useState(false);
    const form = useForm<UserFormValues>({ defaultValues: { email: '', name: '' }, resolver: zodResolver(userFormSchema) });
    const usersQuery = useUsersQuery(dependencies.listUsers);
    const createUserMutation = useCreateUserMutation(dependencies.createUser);
    const updateUserMutation = useUpdateUserMutation(dependencies.updateUser);
    const deleteUserMutation = useDeleteUserMutation(dependencies.deleteUser);
    const resetEditor = (): void => {
        setEditingUserId(undefined);
        setIsEditorOpen(false);
        form.reset({ email: '', name: '' });
    };
    const resetDeleteConfirmation = (): void => {
        setConfirmingDeleteUserId(undefined);
    };
    const resetMutationMessages = (): void => {
        createUserMutation.reset();
        updateUserMutation.reset();
        deleteUserMutation.reset();
    };
    const handleOpenCreate = (): void => {
        resetMutationMessages();
        resetDeleteConfirmation();
        setEditingUserId(undefined);
        setIsEditorOpen(true);
        form.reset({ email: '', name: '' });
        queueMicrotask((): void => form.setFocus('name'));
    };
    const submit: SubmitHandler<UserFormValues> = async (values: UserFormValues): Promise<void> => {
        try {
            if (editingUserId === undefined) {
                updateUserMutation.reset();
                await createUserMutation.mutateAsync(values);
            } else {
                createUserMutation.reset();
                await updateUserMutation.mutateAsync({ ...values, id: editingUserId });
            }

            resetEditor();
        } catch {
            return;
        }
    };
    const handleEdit = (user: User): void => {
        resetMutationMessages();
        resetDeleteConfirmation();
        setEditingUserId(user.id);
        setIsEditorOpen(true);
        form.reset({ email: user.email, name: user.name });
        queueMicrotask((): void => form.setFocus('name'));
    };
    const handleCancelEdit = (): void => {
        resetMutationMessages();
        resetEditor();
    };
    const handleDelete = async (user: User): Promise<void> => {
        if (confirmingDeleteUserId !== user.id) {
            deleteUserMutation.reset();
            setConfirmingDeleteUserId(user.id);
            return;
        }

        try {
            deleteUserMutation.reset();
            await deleteUserMutation.mutateAsync({ id: user.id });
            resetDeleteConfirmation();
            if (editingUserId === user.id) {
                resetEditor();
            }
        } catch {
            resetDeleteConfirmation();
            return;
        }
    };
    const submitError = editingUserId === undefined ? createUserMutation.error : updateUserMutation.error;
    const users = usersQuery.data ?? [];
    const recordsLabel: string = `${users.length} ${users.length === 1 ? 'record' : 'records'}`;

    return {
        confirmingDeleteUserId,
        deletingUserId: deleteUserMutation.isPending ? deleteUserMutation.variables?.id : undefined,
        deleteErrorMessage: deleteUserMutation.error === null
            ? undefined
            : toErrorMessage(deleteUserMutation.error, 'Could not delete the user.'),
        editingUserId,
        editorTitle: isEditorOpen ? (editingUserId === undefined ? 'New user' : 'Edit user') : undefined,
        emailError: form.formState.errors.email?.message,
        emailField: form.register('email'),
        isDeleting: deleteUserMutation.isPending,
        isEditorOpen,
        isLoading: usersQuery.isLoading,
        isSubmitting: createUserMutation.isPending || updateUserMutation.isPending,
        loadErrorMessage: usersQuery.error === null ? undefined : toErrorMessage(usersQuery.error, 'Could not load users.'),
        nameError: form.formState.errors.name?.message,
        nameField: form.register('name'),
        onCancelDelete: resetDeleteConfirmation,
        onCancelEdit: handleCancelEdit,
        onDelete: handleDelete,
        onEdit: handleEdit,
        onOpenCreate: handleOpenCreate,
        onSubmit: form.handleSubmit(submit),
        recordsLabel,
        submitButtonLabel: isEditorOpen
            ? (editingUserId === undefined
                ? (createUserMutation.isPending ? 'Creating...' : 'Create user')
                : (updateUserMutation.isPending ? 'Saving...' : 'Save changes'))
            : undefined,
        submitErrorMessage: submitError === null ? undefined : toErrorMessage(submitError, 'Could not save the user.'),
        users
    };
}
