import { AppLayout } from '@app/layout/AppLayout';
import { ThemeProvider } from '@app/providers/ThemeProvider';
import { render, screen } from '@testing-library/react';
import { fireEvent } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';

const sidebarStorageKey = 'react-frontend-template-ts.sidebar';

function renderLayout(initialEntry: string = '/users') {
    const router = createMemoryRouter([{
        path: '/',
        element: (
            <ThemeProvider>
                <AppLayout />
            </ThemeProvider>
        ),
        children: [{ index: true, element: <div>Root page</div> }, { path: 'users', element: <div>Users page</div> }]
    }], { initialEntries: [initialEntry] });

    return render(<RouterProvider router={router} />);
}

function getFrame(): HTMLElement {
    const frame: Element | null = document.querySelector('.app-frame');

    if (!(frame instanceof HTMLElement)) {
        throw new Error('App frame not found.');
    }

    return frame;
}

describe('AppLayout', () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('renders the header, sidebar navigation, and active route content', async () => {
        renderLayout('/users');

        expect(screen.getByRole('link', { name: 'React Frontend Template TS' })).toHaveAttribute('href', '/users');
        expect(screen.getByRole('link', { name: 'Users' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /theme/i })).toBeInTheDocument();
        expect(await screen.findByText('Users page')).toBeInTheDocument();
    });

    it('collapses the desktop sidebar when requested', () => {
        renderLayout('/users');

        fireEvent.click(screen.getByRole('button', { name: 'Collapse navigation' }));

        expect(getFrame()).toHaveClass('app-frame--sidebar-collapsed');
        expect(screen.getByRole('button', { name: 'Expand navigation' })).toBeInTheDocument();
    });

    it('restores the stored sidebar state after a reload', () => {
        const { unmount } = renderLayout('/users');

        fireEvent.click(screen.getByRole('button', { name: 'Collapse navigation' }));

        expect(window.localStorage.getItem(sidebarStorageKey)).toBe('collapsed');
        expect(getFrame()).toHaveClass('app-frame--sidebar-collapsed');

        unmount();
        renderLayout('/users');

        expect(getFrame()).toHaveClass('app-frame--sidebar-collapsed');
        expect(screen.getByRole('button', { name: 'Expand navigation' })).toBeInTheDocument();

        fireEvent.click(screen.getByRole('button', { name: 'Expand navigation' }));

        expect(window.localStorage.getItem(sidebarStorageKey)).toBe('expanded');
        expect(getFrame()).not.toHaveClass('app-frame--sidebar-collapsed');
    });

    it('opens and closes the mobile navigation controls', () => {
        renderLayout('/users');

        fireEvent.click(screen.getByRole('button', { name: 'Open menu' }));

        expect(getFrame()).toHaveClass('app-frame--mobile-nav-open');
        expect(screen.getByRole('button', { name: 'Close navigation' })).toBeInTheDocument();

        fireEvent.click(screen.getByRole('button', { name: 'Close navigation' }));

        expect(getFrame()).not.toHaveClass('app-frame--mobile-nav-open');
    });

    it('closes the mobile navigation when a route is selected', () => {
        renderLayout('/users');

        fireEvent.click(screen.getByRole('button', { name: 'Open menu' }));
        fireEvent.click(screen.getByRole('link', { name: 'Users' }));

        expect(getFrame()).not.toHaveClass('app-frame--mobile-nav-open');
    });

    it('keeps the layout interactive when browser storage is unavailable', () => {
        vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
            throw new Error('Storage is blocked.');
        });
        vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
            throw new Error('Storage is blocked.');
        });

        renderLayout('/users');

        fireEvent.click(screen.getByRole('button', { name: 'Collapse navigation' }));
        expect(getFrame()).toHaveClass('app-frame--sidebar-collapsed');

        fireEvent.click(screen.getByRole('button', { name: /theme/i }));
        fireEvent.click(screen.getAllByRole('button', { name: /Nightfall/i })[0]!);

        expect(screen.getByRole('button', { name: /theme/i })).toHaveTextContent('Nightfall');
    });
});
