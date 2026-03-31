import { amber, amberA, amberDark, amberDarkA, blackA, blue, blueA, cyanDark, cyanDarkA, grass, grassA, grassDark, grassDarkA, iris, irisA, irisDark, irisDarkA, jade, jadeA, jadeDark, jadeDarkA, mauve, mauveA, mauveDark, mauveDarkA, olive, oliveA, oliveDark, oliveDarkA, orange, orangeA, orangeDark, orangeDarkA, red, redA, redDark, redDarkA, sage, sageA, sand, sandA, slate, slateA, slateDark, slateDarkA, whiteA } from '@radix-ui/colors';

export type ThemeMode = 'dark' | 'light';

type ColorScale = Record<string, string>;

interface ThemeTokens {
    readonly accent: string;
    readonly accentContrast: string;
    readonly accentStrong: string;
    readonly backgroundEnd: string;
    readonly backgroundLeft: string;
    readonly backgroundMiddle: string;
    readonly backgroundStart: string;
    readonly backgroundTopRight: string;
    readonly buttonShadow: string;
    readonly dangerInk: string;
    readonly dangerSurface: string;
    readonly focusRing: string;
    readonly ink: string;
    readonly inkMuted: string;
    readonly inputBackground: string;
    readonly inputBorder: string;
    readonly rowActive: string;
    readonly shadow: string;
    readonly subtleFill: string;
    readonly surface: string;
    readonly surfaceBorder: string;
    readonly surfaceStrong: string;
    readonly tableHover: string;
    readonly warningInk: string;
    readonly warningSurface: string;
}

export interface ThemeDefinition {
    readonly id: string;
    readonly mode: ThemeMode;
    readonly name: string;
    readonly preview: readonly [string, string, string, string];
    readonly tokens: ThemeTokens;
}

interface ThemePaletteDefinition {
    readonly accent: ColorScale;
    readonly accentAlpha: ColorScale;
    readonly accentName: string;
    readonly danger: ColorScale;
    readonly dangerAlpha: ColorScale;
    readonly dangerName: string;
    readonly id: string;
    readonly mode: ThemeMode;
    readonly name: string;
    readonly neutral: ColorScale;
    readonly neutralAlpha: ColorScale;
    readonly neutralName: string;
    readonly warning: ColorScale;
    readonly warningAlpha: ColorScale;
    readonly warningName: string;
}

function getColorStep(scale: ColorScale, token: string): string {
    return scale[token]!;
}

function createThemeTokens(definition: ThemePaletteDefinition): ThemeTokens {
    const isDark: boolean = definition.mode === 'dark';
    const accentStep = (step: number): string => getColorStep(definition.accent, `${definition.accentName}${step}`);
    const accentAlphaStep = (step: number): string => getColorStep(definition.accentAlpha, `${definition.accentName}A${step}`);
    const neutralStep = (step: number): string => getColorStep(definition.neutral, `${definition.neutralName}${step}`);
    const neutralAlphaStep = (step: number): string => getColorStep(definition.neutralAlpha, `${definition.neutralName}A${step}`);
    const dangerStep = (step: number): string => getColorStep(definition.danger, `${definition.dangerName}${step}`);
    const dangerAlphaStep = (step: number): string => getColorStep(definition.dangerAlpha, `${definition.dangerName}A${step}`);
    const warningStep = (step: number): string => getColorStep(definition.warning, `${definition.warningName}${step}`);
    const warningAlphaStep = (step: number): string => getColorStep(definition.warningAlpha, `${definition.warningName}A${step}`);

    return {
        accent: accentStep(9),
        accentContrast: neutralStep(1),
        accentStrong: accentStep(10),
        backgroundEnd: neutralStep(3),
        backgroundLeft: warningAlphaStep(isDark ? 5 : 4),
        backgroundMiddle: neutralStep(isDark ? 2 : 2),
        backgroundStart: neutralStep(1),
        backgroundTopRight: accentAlphaStep(isDark ? 5 : 4),
        buttonShadow: `0 14px 28px ${accentAlphaStep(isDark ? 8 : 7)}`,
        dangerInk: dangerStep(11),
        dangerSurface: dangerAlphaStep(isDark ? 5 : 4),
        focusRing: accentAlphaStep(isDark ? 6 : 5),
        ink: neutralStep(12),
        inkMuted: neutralStep(11),
        inputBackground: neutralStep(1),
        inputBorder: neutralStep(isDark ? 7 : 6),
        rowActive: accentAlphaStep(isDark ? 5 : 4),
        shadow: isDark ? `0 20px 48px ${blackA.blackA8}` : `0 18px 46px ${blackA.blackA4}`,
        subtleFill: neutralAlphaStep(isDark ? 4 : 3),
        surface: isDark ? neutralStep(2) : neutralStep(1),
        surfaceBorder: neutralStep(isDark ? 6 : 5),
        surfaceStrong: isDark ? neutralStep(3) : neutralStep(2),
        tableHover: isDark ? whiteA.whiteA2 : blackA.blackA2,
        warningInk: warningStep(11),
        warningSurface: warningAlphaStep(isDark ? 5 : 4)
    };
}

function createThemeDefinition(definition: ThemePaletteDefinition): ThemeDefinition {
    const tokens: ThemeTokens = createThemeTokens(definition);

    return {
        id: definition.id,
        mode: definition.mode,
        name: definition.name,
        preview: [tokens.backgroundStart, tokens.surfaceStrong, tokens.accent, tokens.ink],
        tokens
    };
}

export const themeCatalog = [
    createThemeDefinition({
        accent: jade,
        accentAlpha: jadeA,
        accentName: 'jade',
        danger: red,
        dangerAlpha: redA,
        dangerName: 'red',
        id: 'fern-light',
        mode: 'light',
        name: 'Fern',
        neutral: sage,
        neutralAlpha: sageA,
        neutralName: 'sage',
        warning: amber,
        warningAlpha: amberA,
        warningName: 'amber'
    }),
    createThemeDefinition({
        accent: blue,
        accentAlpha: blueA,
        accentName: 'blue',
        danger: red,
        dangerAlpha: redA,
        dangerName: 'red',
        id: 'harbor-light',
        mode: 'light',
        name: 'Harbor',
        neutral: slate,
        neutralAlpha: slateA,
        neutralName: 'slate',
        warning: amber,
        warningAlpha: amberA,
        warningName: 'amber'
    }),
    createThemeDefinition({
        accent: orange,
        accentAlpha: orangeA,
        accentName: 'orange',
        danger: red,
        dangerAlpha: redA,
        dangerName: 'red',
        id: 'copper-light',
        mode: 'light',
        name: 'Copper',
        neutral: sand,
        neutralAlpha: sandA,
        neutralName: 'sand',
        warning: amber,
        warningAlpha: amberA,
        warningName: 'amber'
    }),
    createThemeDefinition({
        accent: grass,
        accentAlpha: grassA,
        accentName: 'grass',
        danger: red,
        dangerAlpha: redA,
        dangerName: 'red',
        id: 'sage-light',
        mode: 'light',
        name: 'Sage',
        neutral: olive,
        neutralAlpha: oliveA,
        neutralName: 'olive',
        warning: amber,
        warningAlpha: amberA,
        warningName: 'amber'
    }),
    createThemeDefinition({
        accent: iris,
        accentAlpha: irisA,
        accentName: 'iris',
        danger: red,
        dangerAlpha: redA,
        dangerName: 'red',
        id: 'iris-light',
        mode: 'light',
        name: 'Iris',
        neutral: mauve,
        neutralAlpha: mauveA,
        neutralName: 'mauve',
        warning: amber,
        warningAlpha: amberA,
        warningName: 'amber'
    }),
    createThemeDefinition({
        accent: jadeDark,
        accentAlpha: jadeDarkA,
        accentName: 'jade',
        danger: redDark,
        dangerAlpha: redDarkA,
        dangerName: 'red',
        id: 'graphite-dark',
        mode: 'dark',
        name: 'Graphite',
        neutral: slateDark,
        neutralAlpha: slateDarkA,
        neutralName: 'slate',
        warning: amberDark,
        warningAlpha: amberDarkA,
        warningName: 'amber'
    }),
    createThemeDefinition({
        accent: cyanDark,
        accentAlpha: cyanDarkA,
        accentName: 'cyan',
        danger: redDark,
        dangerAlpha: redDarkA,
        dangerName: 'red',
        id: 'tide-dark',
        mode: 'dark',
        name: 'Tide',
        neutral: slateDark,
        neutralAlpha: slateDarkA,
        neutralName: 'slate',
        warning: amberDark,
        warningAlpha: amberDarkA,
        warningName: 'amber'
    }),
    createThemeDefinition({
        accent: orangeDark,
        accentAlpha: orangeDarkA,
        accentName: 'orange',
        danger: redDark,
        dangerAlpha: redDarkA,
        dangerName: 'red',
        id: 'ember-dark',
        mode: 'dark',
        name: 'Ember',
        neutral: mauveDark,
        neutralAlpha: mauveDarkA,
        neutralName: 'mauve',
        warning: amberDark,
        warningAlpha: amberDarkA,
        warningName: 'amber'
    }),
    createThemeDefinition({
        accent: grassDark,
        accentAlpha: grassDarkA,
        accentName: 'grass',
        danger: redDark,
        dangerAlpha: redDarkA,
        dangerName: 'red',
        id: 'moss-dark',
        mode: 'dark',
        name: 'Moss',
        neutral: oliveDark,
        neutralAlpha: oliveDarkA,
        neutralName: 'olive',
        warning: amberDark,
        warningAlpha: amberDarkA,
        warningName: 'amber'
    }),
    createThemeDefinition({
        accent: irisDark,
        accentAlpha: irisDarkA,
        accentName: 'iris',
        danger: redDark,
        dangerAlpha: redDarkA,
        dangerName: 'red',
        id: 'nightfall-dark',
        mode: 'dark',
        name: 'Nightfall',
        neutral: mauveDark,
        neutralAlpha: mauveDarkA,
        neutralName: 'mauve',
        warning: amberDark,
        warningAlpha: amberDarkA,
        warningName: 'amber'
    })
] as const satisfies readonly ThemeDefinition[];

export type ThemeId = (typeof themeCatalog)[number]['id'];

export const defaultThemeId: ThemeId = 'fern-light';
