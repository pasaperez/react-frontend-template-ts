import type { UsersFeatureDependencies } from '@features/users/application/UsersFeatureDependencies';
import { UsersPage } from '@features/users/ui/pages/UsersPage';
import { createElement } from 'react';
import type { RouteObject } from 'react-router-dom';

export function createUsersRoutes(dependencies: UsersFeatureDependencies): RouteObject[] {
    return [{ path: 'users', element: createElement(UsersPage, { dependencies }) }];
}
