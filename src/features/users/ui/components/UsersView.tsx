import type { User } from '@features/users/domain/entities/User';
import type { UsersPageViewModel } from '@features/users/ui/hooks/useUsersPage';
import { Button } from '@shared/ui/Button';
import { TextField } from '@shared/ui/TextField';
import type { ReactElement } from 'react';

const dateFormatter = new Intl.DateTimeFormat('es-AR', { dateStyle: 'short', timeStyle: 'short' });

function formatTimestamp(value: string): string {
    return dateFormatter.format(new Date(value));
}

export function UsersView(viewModel: UsersPageViewModel): ReactElement {
    return (
        <section className='crud-page'>
            <header className='crud-header'>
                <div className='crud-header__title'>
                    <h1>Users</h1>
                </div>
                <div className='crud-header__actions'>
                    <div aria-live='polite' className='toolbar__count'>{viewModel.recordsLabel}</div>
                    <Button disabled={viewModel.isSubmitting || viewModel.isDeleting} onClick={viewModel.onOpenCreate} type='button'>
                        New user
                    </Button>
                </div>
            </header>
            {viewModel.deleteErrorMessage !== undefined
                ? <div className='inline-message inline-message--danger' role='alert'>{viewModel.deleteErrorMessage}</div>
                : null}
            <div className={`crud-layout${viewModel.isEditorOpen ? ' crud-layout--editing' : ''}`}>
                <section aria-busy={viewModel.isLoading} className='crud-surface'>
                    {viewModel.loadErrorMessage !== undefined
                        ? <div className='inline-message inline-message--danger' role='alert'>{viewModel.loadErrorMessage}</div>
                        : null}
                    {viewModel.isLoading
                        ? <div aria-live='polite' className='inline-message inline-message--warning' role='status'>Loading users...</div>
                        : null}
                    {!viewModel.isLoading && viewModel.loadErrorMessage === undefined && viewModel.users.length === 0
                        ? (
                            <div className='crud-empty'>
                                <h2>No users yet</h2>
                                {!viewModel.isEditorOpen
                                    ? <Button onClick={viewModel.onOpenCreate} type='button'>Create user</Button>
                                    : null}
                            </div>
                        )
                        : null}
                    {viewModel.users.length > 0
                        ? (
                            <div className='data-table'>
                                <table className='users-table'>
                                    <caption className='sr-only'>
                                        Users table with columns for user identifier, name, email, creation date, update date, and actions.
                                    </caption>
                                    <thead>
                                        <tr>
                                            <th scope='col'>Id</th>
                                            <th scope='col'>Name</th>
                                            <th scope='col'>Email</th>
                                            <th scope='col'>Created</th>
                                            <th scope='col'>Updated</th>
                                            <th scope='col'>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {viewModel.users.map((user: User) => (
                                            <tr className={viewModel.editingUserId === user.id ? 'row--active' : ''} key={user.id}>
                                                <th className='table-id' scope='row'>{user.id}</th>
                                                <td>{user.name}</td>
                                                <td>{user.email}</td>
                                                <td>
                                                    <time dateTime={user.createdAt}>{formatTimestamp(user.createdAt)}</time>
                                                </td>
                                                <td>
                                                    <time dateTime={user.updatedAt}>{formatTimestamp(user.updatedAt)}</time>
                                                </td>
                                                <td>
                                                    <div className='table-actions'>
                                                        {viewModel.confirmingDeleteUserId === user.id
                                                            ? (
                                                                <>
                                                                    <Button
                                                                        aria-label={`Confirm deleting ${user.name}`}
                                                                        className='button--danger button--small'
                                                                        disabled={viewModel.isSubmitting || viewModel.isDeleting}
                                                                        onClick={() => void viewModel.onDelete(user)}
                                                                        type='button'
                                                                    >
                                                                        {viewModel.deletingUserId === user.id ? 'Deleting...' : 'Confirm'}
                                                                    </Button>
                                                                    <Button
                                                                        aria-label={`Cancel deleting ${user.name}`}
                                                                        className='button--ghost button--small'
                                                                        disabled={viewModel.isDeleting}
                                                                        onClick={viewModel.onCancelDelete}
                                                                        type='button'
                                                                    >
                                                                        Cancel
                                                                    </Button>
                                                                </>
                                                            )
                                                            : (
                                                                <>
                                                                    <Button
                                                                        aria-label={`Edit ${user.name}`}
                                                                        className='button--secondary button--small'
                                                                        disabled={viewModel.isSubmitting || viewModel.isDeleting}
                                                                        onClick={() => viewModel.onEdit(user)}
                                                                        type='button'
                                                                    >
                                                                        Edit
                                                                    </Button>
                                                                    <Button
                                                                        aria-label={`Delete ${user.name}`}
                                                                        className='button--ghost button--danger button--small'
                                                                        disabled={viewModel.isSubmitting
                                                                            || (viewModel.isDeleting
                                                                                && viewModel.deletingUserId !== user.id)}
                                                                        onClick={() => void viewModel.onDelete(user)}
                                                                        type='button'
                                                                    >
                                                                        Delete
                                                                    </Button>
                                                                </>
                                                            )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )
                        : null}
                </section>
                {viewModel.isEditorOpen
                    ? (
                        <aside aria-labelledby='users-editor-title' className='crud-editor'>
                            <div className='crud-editor__header'>
                                <h2 id='users-editor-title'>{viewModel.editorTitle}</h2>
                                <Button className='button--ghost button--small' onClick={viewModel.onCancelEdit} type='button'>
                                    Close
                                </Button>
                            </div>
                            <form className='stack' noValidate onSubmit={viewModel.onSubmit}>
                                <TextField
                                    autoComplete='name'
                                    error={viewModel.nameError}
                                    id='name'
                                    label='Name'
                                    placeholder='Alice Example'
                                    {...viewModel.nameField}
                                />
                                <TextField
                                    autoComplete='email'
                                    error={viewModel.emailError}
                                    id='email'
                                    label='Email'
                                    placeholder='alice@example.com'
                                    type='email'
                                    {...viewModel.emailField}
                                />
                                {viewModel.submitErrorMessage !== undefined
                                    ? (
                                        <div className='inline-message inline-message--danger' role='alert'>
                                            {viewModel.submitErrorMessage}
                                        </div>
                                    )
                                    : null}
                                <div className='form-actions'>
                                    <Button disabled={viewModel.isSubmitting} type='submit'>{viewModel.submitButtonLabel}</Button>
                                </div>
                            </form>
                        </aside>
                    )
                    : null}
            </div>
        </section>
    );
}
