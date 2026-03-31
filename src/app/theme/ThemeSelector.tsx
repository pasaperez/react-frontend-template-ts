import { useTheme } from '@app/providers/themeContext';
import type { ThemeDefinition, ThemeId } from '@app/theme/themes';
import type { ReactElement } from 'react';
import { useEffect, useId, useRef, useState } from 'react';

const modeLabels = { dark: 'Dark', light: 'Light' } as const;

function ThemeOption(
    { isActive, onSelect, theme }: { isActive: boolean; onSelect: (themeId: ThemeId) => void; theme: ThemeDefinition; }
): ReactElement {
    return (
        <button
            aria-pressed={isActive}
            className={`theme-switcher__option${isActive ? ' theme-switcher__option--active' : ''}`}
            onClick={() => onSelect(theme.id)}
            type='button'
        >
            <div aria-hidden='true' className='theme-switcher__swatches'>
                {theme.preview.map((color: string, index: number) => (
                    <span className='theme-switcher__swatch' key={`${theme.id}-${index}`} style={{ backgroundColor: color }} />
                ))}
            </div>
            <div className='theme-switcher__meta'>
                <span className='theme-switcher__name'>{theme.name}</span>
                <span className='theme-switcher__mode'>{modeLabels[theme.mode]}</span>
            </div>
        </button>
    );
}

export function ThemeSelector(): ReactElement {
    const { activeTheme, selectTheme, themes } = useTheme();
    const [isSelectorOpen, setIsSelectorOpen] = useState<boolean>(false);
    const panelId: string = useId();
    const selectorReference = useRef<HTMLDivElement>(null);
    const groupedThemes = {
        light: themes.filter((theme: ThemeDefinition) => theme.mode === 'light'),
        dark: themes.filter((theme: ThemeDefinition) => theme.mode === 'dark')
    } as const;

    useEffect((): (() => void) | undefined => {
        if (!isSelectorOpen) {
            return undefined;
        }

        const handleWindowKeyDown = (event: KeyboardEvent): void => {
            if (event.key === 'Escape') {
                setIsSelectorOpen(false);
            }
        };
        const handlePointerDown = (event: PointerEvent): void => {
            if (selectorReference.current !== null && !selectorReference.current.contains(event.target as Node)) {
                setIsSelectorOpen(false);
            }
        };

        window.addEventListener('keydown', handleWindowKeyDown);
        window.addEventListener('pointerdown', handlePointerDown);

        return (): void => {
            window.removeEventListener('keydown', handleWindowKeyDown);
            window.removeEventListener('pointerdown', handlePointerDown);
        };
    }, [isSelectorOpen]);

    function handleThemeSelection(themeId: ThemeId): void {
        selectTheme(themeId);
        setIsSelectorOpen(false);
    }

    return (
        <div className='theme-switcher' ref={selectorReference}>
            <button
                aria-controls={isSelectorOpen ? panelId : undefined}
                aria-expanded={isSelectorOpen}
                aria-haspopup='dialog'
                className='theme-switcher__trigger'
                onClick={() => setIsSelectorOpen((currentValue: boolean) => !currentValue)}
                type='button'
            >
                <span className='theme-switcher__trigger-label'>Theme</span>
                <span className='theme-switcher__trigger-current'>{activeTheme.name}</span>
            </button>
            {isSelectorOpen
                ? (
                    <div aria-label='Theme palette' aria-modal='false' className='theme-switcher__panel' id={panelId} role='dialog'>
                        {Object.entries(groupedThemes).map(([mode, modeThemes]: [string, readonly ThemeDefinition[]]) => (
                            <section className='theme-switcher__section' key={mode}>
                                <h2 className='theme-switcher__section-title'>{modeLabels[mode as keyof typeof modeLabels]}</h2>
                                <div className='theme-switcher__grid'>
                                    {modeThemes.map((theme: ThemeDefinition) => (
                                        <ThemeOption
                                            isActive={theme.id === activeTheme.id}
                                            key={theme.id}
                                            onSelect={handleThemeSelection}
                                            theme={theme}
                                        />
                                    ))}
                                </div>
                            </section>
                        ))}
                    </div>
                )
                : null}
        </div>
    );
}
