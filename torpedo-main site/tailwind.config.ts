import type { Config } from 'tailwindcss';
import plugin from 'tailwindcss/plugin';
import { BRAND_TOKENS, hexToRgbTriplet } from './lib/brand-tokens';

const config: Config = {
  darkMode: ['selector', '[data-theme="dark"]'],
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-dm-sans)', 'DM Sans', 'system-ui', 'sans-serif'],
        display: ['var(--font-syne)', 'Syne', 'system-ui', 'sans-serif'],
        mono: ['var(--font-jetbrains-mono)', 'JetBrains Mono', 'ui-monospace', 'monospace'],
      },
      colors: {
        tw: {
          void: 'var(--bg-void)',
          base: 'var(--bg-base)',
          surface: 'var(--bg-surface)',
          muted: 'var(--bg-muted)',
          ghost: 'var(--bg-ghost)',
          fg: 'var(--fg-primary)',
          'fg-secondary': 'var(--fg-secondary)',
          'fg-tertiary': 'var(--fg-tertiary)',
          brand: 'var(--brand)',
          'brand-hover': 'var(--brand-hover)',
        },
        torpedo: {
          orange: 'rgb(var(--torpedo-orange-rgb) / <alpha-value>)',
          orangeDark: 'rgb(var(--torpedo-orange-dark-rgb) / <alpha-value>)',
          dark: BRAND_TOKENS.dark,
          gray: BRAND_TOKENS.gray,
          light: BRAND_TOKENS.light,
        },
      },
      backgroundImage: {
        'galactic-fade': 'linear-gradient(to bottom, #FFFFFF 0%, #F5F5F7 100%)',
        'subtle-glow':
          'radial-gradient(circle at 50% 50%, rgb(var(--torpedo-orange-rgb) / 0.03) 0%, transparent 50%)',
        'clay-brand': 'var(--clay-brand-grad)',
        'clay-surface': 'var(--clay-surface-grad)',
        'clay-light': 'var(--clay-light-grad)',
      },
      boxShadow: {
        'clay-brand': 'var(--clay-shadow-brand)',
        'clay-brand-hover': 'var(--clay-shadow-brand-hover)',
        'clay-brand-pressed': 'var(--clay-shadow-brand-pressed)',
        'clay-surface': 'var(--clay-shadow-surface)',
        'clay-light': 'var(--clay-shadow-light)',
        'clay-input':
          'inset 0 2px 6px rgba(0,0,0,0.35), inset 0 -1px 0 rgba(255,255,255,0.04)',
      },
      borderRadius: {
        clay: 'var(--clay-radius-md)',
        'clay-sm': 'var(--clay-radius-sm)',
        'clay-lg': 'var(--clay-radius-lg)',
      },
      keyframes: {
        shimmer: {
          '0%': { transform: 'translateX(-100%) skewX(-15deg)' },
          '100%': { transform: 'translateX(200%) skewX(-15deg)' },
        },
      },
      animation: {
        shimmer: 'shimmer 2.5s infinite linear',
      },
    },
  },
  plugins: [
    plugin(({ addBase }) => {
      addBase({
        ':root': {
          '--torpedo-orange': BRAND_TOKENS.orange,
          '--torpedo-orange-rgb': hexToRgbTriplet(BRAND_TOKENS.orange),
          '--torpedo-orange-dark': BRAND_TOKENS.orangeDark,
          '--torpedo-orange-dark-rgb': hexToRgbTriplet(BRAND_TOKENS.orangeDark),
        },
      });
    }),
  ],
};

export default config;
