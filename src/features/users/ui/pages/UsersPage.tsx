import { useDocumentMetadata } from '@app/seo/useDocumentMetadata';
import type { UsersFeatureDependencies } from '@features/users/application/UsersFeatureDependencies';
import { UsersView } from '@features/users/ui/components/UsersView';
import { useUsersPage } from '@features/users/ui/hooks/useUsersPage';
import type { ReactElement } from 'react';

interface UsersPageProps {
    dependencies: UsersFeatureDependencies;
}

export function UsersPage({ dependencies }: UsersPageProps): ReactElement {
    useDocumentMetadata({
        description: 'Users CRUD connected to the backend template with accessible table, form, and status feedback.',
        title: 'Users | React Frontend Template TS'
    });

    return <UsersView {...useUsersPage(dependencies)} />;
}
