/** Цветовые и размерные токены — перенесены из CSS-переменных `EagleCode/src/index.css`. */
export const colors = {
  bg: '#121413',
  deep: '#0d0f0e',
  panel: '#1a1c1b',
  raised: '#1e201f',
  highest: '#282a29',
  border: '#334137',
  outline: '#3c4a3e',
  text: '#e2e3e0',
  body: '#b8c4ba',
  muted: '#9aaa9c',
  primary: '#37e787',
  primarySoft: '#8affaf',
  onPrimary: '#00210d',
  gold: '#e4c277',
  danger: '#ff8177',

  cardBorder: 'rgba(102,123,106,0.19)',
  inputBg: '#121514',
  inputPlaceholder: '#758177',
  inputHoverBorder: '#526255',
  badgeBorder: '#39453b',
  badgeText: '#bcc8be',
  badgePrimaryBorder: 'rgba(55,231,135,0.32)',
  badgePrimaryBg: 'rgba(55,231,135,0.1)',
  badgeGoldText: '#ffe4a4',
  badgeGoldBg: 'rgba(228,194,119,0.11)',
  badgeGoldBorder: 'rgba(228,194,119,0.32)',
  badgeDangerText: '#ffc1bb',
  badgeDangerBg: 'rgba(255,129,119,0.1)',
  badgeDangerBorder: 'rgba(255,129,119,0.3)',
  buttonSecondaryHoverBorder: '#627466',
  buttonDangerText: '#ffd8d4',
  buttonDangerBg: '#441c1b',
  buttonDangerBorder: '#70312e',
  progressTrack: '#0a0c0b',
  progressBorder: '#202822',
} as const;

export const radius = {
  sm: 6,
  md: 8,
  lg: 12,
  xl: 16,
  pill: 999,
} as const;

export const space = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 28,
} as const;

export const font = {
  sans: 'Inter_400Regular',
  sansMedium: 'Inter_500Medium',
  sansSemiBold: 'Inter_600SemiBold',
  sansBold: 'Inter_700Bold',
  display: 'Geist_600SemiBold',
  displayBold: 'Geist_700Bold',
  mono: 'JetBrainsMono_400Regular',
  monoSemiBold: 'JetBrainsMono_600SemiBold',
} as const;

export const theme = { colors, radius, space, font } as const;

export type Theme = typeof theme;
