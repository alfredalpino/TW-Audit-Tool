export const BRAND_TOKENS = {
  orange: '#FF5500',
  orangeDark: '#C44A00',
  dark: '#0A0A0B',
  gray: '#888888',
  light: '#F5F5F7',
  white: '#FFFFFF',
} as const;

export function hexToRgbTriplet(hex: string): string {
  const normalized = hex.replace('#', '');
  const value =
    normalized.length === 3
      ? normalized
          .split('')
          .map((char) => `${char}${char}`)
          .join('')
      : normalized;
  const int = Number.parseInt(value, 16);
  const r = (int >> 16) & 255;
  const g = (int >> 8) & 255;
  const b = int & 255;
  return `${r} ${g} ${b}`;
}
