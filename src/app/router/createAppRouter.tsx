import type { AppDependencies } from '@app/composition/createAppDependencies';
import { AppLayout } from '@app/layout/AppLayout';
import { NotFoundPage } from '@app/router/NotFoundPage';
import { RouteErrorBoundary } from '@app/router/RouteErrorBoundary';
import { createUsersRoutes } from '@features/users';
import { createElement } from 'react';
import { createBrowserRouter, Navigate, Outlet, type RouteObject } from 'react-router-dom';

export function createAppRoutes(dependencies: AppDependencies): RouteObject[] {
    return [{
        path: '/',
        element: createElement(AppLayout),
        children: [{
            element: createElement(Outlet),
            errorElement: createElement(RouteErrorBoundary),
            children: [
                { index: true, element: createElement(Navigate, { replace: true, to: '/users' }) },
                ...createUsersRoutes(dependencies.users),
                { path: '*', element: createElement(NotFoundPage) }
            ]
        }]
    }];
}

export function createAppRouter(dependencies: AppDependencies): ReturnType<typeof createBrowserRouter> {
    return createBrowserRouter(createAppRoutes(dependencies));
}
