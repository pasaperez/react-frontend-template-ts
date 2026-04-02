import { ThemeProvider } from '@app/providers/ThemeProvider';
import { ThemeSelector } from '@app/theme/ThemeSelector';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

describe('ThemeSelector', () => {
    it('opens the palette and selects another theme', () => {
        render(
            <ThemeProvider>
                <ThemeSelector />
            </ThemeProvider>
        );

        fireEvent.click(screen.getByRole('button', { name: /theme/i }));

        expect(screen.getByRole('button', { name: /theme/i })).toHaveAttribute('aria-expanded', 'true');
        expect(screen.getByRole('heading', { name: 'Light' })).toBeInTheDocument();
        expect(screen.getByRole('heading', { name: 'Dark' })).toBeInTheDocument();

        fireEvent.click(screen.getByRole('button', { name: /Nightfall/i }));

        expect(screen.queryByRole('group', { name: 'Theme palette' })).not.toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Nightfall/i })).toHaveTextContent('Nightfall');
    });

    it('closes the palette when escape is pressed', () => {
        render(
            <ThemeProvider>
                <ThemeSelector />
            </ThemeProvider>
        );

        fireEvent.click(screen.getByRole('button', { name: /theme/i }));
        expect(screen.getByRole('group', { name: 'Theme palette' })).toBeInTheDocument();

        fireEvent.keyDown(window, { key: 'Escape' });

        expect(screen.queryByRole('group', { name: 'Theme palette' })).not.toBeInTheDocument();
    });

    it('keeps the palette open when another key is pressed', () => {
        render(
            <ThemeProvider>
                <ThemeSelector />
            </ThemeProvider>
        );

        fireEvent.click(screen.getByRole('button', { name: /theme/i }));
        fireEvent.keyDown(window, { key: 'Enter' });

        expect(screen.getByRole('group', { name: 'Theme palette' })).toBeInTheDocument();
    });

    it('closes the palette when clicking outside the selector', () => {
        render(
            <ThemeProvider>
                <div>Outside</div>
                <ThemeSelector />
            </ThemeProvider>
        );

        fireEvent.click(screen.getByRole('button', { name: /theme/i }));
        expect(screen.getByRole('group', { name: 'Theme palette' })).toBeInTheDocument();

        fireEvent.pointerDown(screen.getByText('Outside'));

        expect(screen.queryByRole('group', { name: 'Theme palette' })).not.toBeInTheDocument();
    });

    it('keeps the palette open when clicking inside the selector panel', () => {
        render(
            <ThemeProvider>
                <ThemeSelector />
            </ThemeProvider>
        );

        fireEvent.click(screen.getByRole('button', { name: /theme/i }));
        fireEvent.pointerDown(screen.getByRole('group', { name: 'Theme palette' }));

        expect(screen.getByRole('group', { name: 'Theme palette' })).toBeInTheDocument();
    });
});
