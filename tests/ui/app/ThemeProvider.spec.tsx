import { useTheme } from '@app/providers/themeContext';
import { ThemeProvider } from '@app/providers/ThemeProvider';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

const storageKey = 'react-frontend-template-ts.theme';

function getThemeRoot(): HTMLElement {
    const themeRoot: Element | null = document.querySelector('.theme-root');

    if (!(themeRoot instanceof HTMLElement)) {
        throw new Error('Theme root not found.');
    }

    return themeRoot;
}

function ThemeConsumer() {
    const { activeTheme, selectTheme } = useTheme();

    return (
        <>
            <div>{activeTheme.name}</div>
            <button onClick={() => selectTheme('nightfall-dark')} type='button'>Use nightfall</button>
        </>
    );
}

describe('ThemeProvider', () => {
    it('uses the default theme and persists selections made through the theme context', () => {
        render(
            <ThemeProvider>
                <ThemeConsumer />
            </ThemeProvider>
        );

        expect(screen.getByText('Fern')).toBeInTheDocument();
        expect(getThemeRoot()).toHaveAttribute('data-theme', 'fern-light');

        fireEvent.click(screen.getByRole('button', { name: 'Use nightfall' }));

        expect(screen.getByText('Nightfall')).toBeInTheDocument();
        expect(getThemeRoot()).toHaveAttribute('data-theme', 'nightfall-dark');
        expect(window.localStorage.getItem(storageKey)).toBe('nightfall-dark');
    });

    it('restores a stored theme when the stored id is valid', () => {
        window.localStorage.setItem(storageKey, 'tide-dark');

        render(
            <ThemeProvider>
                <ThemeConsumer />
            </ThemeProvider>
        );

        expect(screen.getByText('Tide')).toBeInTheDocument();
        expect(getThemeRoot()).toHaveAttribute('data-theme', 'tide-dark');
    });

    it('falls back to the default theme when the stored id is unknown', () => {
        window.localStorage.setItem(storageKey, 'unknown-theme');

        render(
            <ThemeProvider>
                <ThemeConsumer />
            </ThemeProvider>
        );

        expect(screen.getByText('Fern')).toBeInTheDocument();
        expect(getThemeRoot()).toHaveAttribute('data-theme', 'fern-light');
    });

    it('throws when the theme hook is used outside the provider', () => {
        expect(() => render(<ThemeConsumer />)).toThrowError('useTheme must be used within ThemeProvider.');
    });
});
