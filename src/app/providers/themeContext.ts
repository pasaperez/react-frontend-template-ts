import type { ThemeDefinition, ThemeId } from '@app/theme/themes';
import { createContext, useContext } from 'react';

export interface ThemeContextValue {
    readonly activeTheme: ThemeDefinition;
    readonly selectTheme: (themeId: ThemeId) => void;
    readonly themes: readonly ThemeDefinition[];
}

export const ThemeContext = createContext<ThemeContextValue | null>(null);

export function useTheme(): ThemeContextValue {
    const context: ThemeContextValue | null = useContext(ThemeContext);

    if (context === null) {
        throw new Error('useTheme must be used within ThemeProvider.');
    }

    return context;
}
