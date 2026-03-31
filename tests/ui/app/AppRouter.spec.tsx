import type {AppDependencies} from '@app/composition/createAppDependencies';
import {AppLayout} from '@app/layout/AppLayout';
import {ThemeProvider} from '@app/providers/ThemeProvider';
import {createAppRoutes} from '@app/router/createAppRouter';
import {RouteErrorBoundary} from '@app/router/RouteErrorBoundary';
import {render, screen} from '@testing-library/react';
import type {ReactElement} from 'react';
import {createElement} from 'react';
import {createMemoryRouter, MemoryRouter, Outlet, type RouteObject, RouterProvider} from 'react-router-dom';
import {describe, expect, it, vi} from 'vitest';

function createDependencies(): AppDependencies {
    return {
        env: { apiBaseUrl: 'http://127.0.0.1:3000' },
        users: {
            createUser: { execute: vi.fn().mockResolvedValue(undefined) },
            deleteUser: { execute: vi.fn().mockResolvedValue(undefined) },
            listUsers: { execute: vi.fn().mockResolvedValue([]) },
            updateUser: { execute: vi.fn().mockResolvedValue(undefined) }
        }
    };
}

function renderRouter(initialEntry: string, routes: RouteObject[]): void {
    const router = createMemoryRouter(routes, { initialEntries: [initialEntry] });

    render(
        <ThemeProvider>
            <RouterProvider router={router} />
        </ThemeProvider>
    );
}

function ThrowingRoute({ error }: { error: unknown; }): ReactElement {
    throw error;
}

describe('App router', () => {
    it('renders the app not found page for unknown routes', async () => {
        renderRouter('/missing', createAppRoutes(createDependencies()));

        expect(await screen.findByRole('heading', { name: 'Page not found' })).toBeInTheDocument();
        expect(screen.getByText('The page you requested does not exist or is no longer available.')).toBeInTheDocument();
        expect(screen.getByRole('link', { name: 'Go to home' })).toHaveAttribute('href', '/');
        expect(document.title).toBe('Page not found | React Frontend Template TS');
        expect(document.querySelector('meta[name="description"]')?.getAttribute('content')).toBe(
            'The requested route does not exist in this frontend template.'
        );
    });

    it('renders the route error boundary for thrown Error values', async () => {
        vi.spyOn(console, 'error').mockImplementation(() => {});

        renderRouter('/broken', [{
            path: '/',
            element: createElement(AppLayout),
            children: [{
                element: createElement(Outlet),
                errorElement: createElement(RouteErrorBoundary),
                children: [{ path: 'broken', element: createElement(ThrowingRoute, { error: new Error('Route exploded') }) }]
            }]
        }]);

        expect(await screen.findByRole('heading', { name: 'Something went wrong' })).toBeInTheDocument();
        expect(screen.getByRole('alert')).toHaveTextContent('Route exploded');
        expect(screen.getByRole('link', { name: 'Back to users' })).toHaveAttribute('href', '/users');
        expect(document.title).toBe('Route error | React Frontend Template TS');
        expect(document.querySelector('meta[name="description"]')?.getAttribute('content')).toBe(
            'The current route failed before it could render. Review the error message and return to a working page.'
        );
    });

    it('renders the route error boundary for route response errors', async () => {
        vi.spyOn(console, 'error').mockImplementation(() => {});

        renderRouter('/response-error', [{
            path: '/',
            element: createElement(AppLayout),
            children: [{
                element: createElement(Outlet),
                errorElement: createElement(RouteErrorBoundary),
                children: [{
                    path: 'response-error',
                    loader: (): never => {
                        throw Object.assign(new Error('Service Unavailable'), {
                            data: undefined,
                            internal: false,
                            status: 503,
                            statusText: 'Service Unavailable'
                        });
                    },
                    element: <div>Should not render</div>
                }]
            }]
        }]);

        expect(await screen.findByRole('heading', { name: 'Something went wrong' })).toBeInTheDocument();
        expect(screen.getByText('503')).toBeInTheDocument();
        expect(screen.getByRole('alert')).toHaveTextContent('Service Unavailable');
    });

    it('renders the fallback route error message for unknown route error values', async () => {
        vi.resetModules();
        vi.doMock('react-router-dom', async () => {
            const actual = await vi.importActual('react-router-dom');

            return { ...actual, useRouteError: () => 'Unexpected failure' };
        });

        const { RouteErrorBoundary: MockedRouteErrorBoundary } = await import('@app/router/RouteErrorBoundary');

        render(
            <ThemeProvider>
                <MemoryRouter>
                    <MockedRouteErrorBoundary />
                </MemoryRouter>
            </ThemeProvider>
        );

        expect(await screen.findByRole('heading', { name: 'Something went wrong' })).toBeInTheDocument();
        expect(screen.getByRole('alert')).toHaveTextContent('The route failed before it could render.');

        vi.doUnmock('react-router-dom');
        vi.resetModules();
    });
});
