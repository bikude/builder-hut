import type { Config } from 'tailwindcss';

/**
 * A Builder Hut design tokens.
 *
 * Two token families live side by side on purpose:
 *  - `brand.*` — the literal palette the identity is built from (black / red / white / gold).
 *    Use these in bespoke components.
 *  - shadcn semantic tokens (`background`, `primary`, `muted`, …) — driven by the HSL CSS
 *    variables in globals.css so any component pulled in later with `npx shadcn@latest add`
 *    inherits the same identity with no rework.
 */
const config: Config = {
  darkMode: ['class'],
  content: ['./src/**/*.{ts,tsx,mdx}'],
  theme: {
    container: {
      center: true,
      padding: { DEFAULT: '1.25rem', sm: '1.5rem', lg: '2.5rem' },
      screens: { '2xl': '1360px' },
    },
    extend: {
      colors: {
        brand: {
          ink: '#08070A', // base black — cool violet cast, never pure #000
          forge: '#121016', // raised surface
          steel: '#1D1A22', // hairlines, inset panels
          blood: '#E11B22', // primary red
          ember: '#8E0F17', // deep red, gradient anchor
          bullion: '#C9A227', // gold
          gilt: '#F3DA95', // gold highlight
          chalk: '#F5F2ED', // off-white (lifting chalk, not paper white)
          smoke: '#9A939F', // muted copy
        },
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: { DEFAULT: 'hsl(var(--card))', foreground: 'hsl(var(--card-foreground))' },
        popover: { DEFAULT: 'hsl(var(--popover))', foreground: 'hsl(var(--popover-foreground))' },
        primary: { DEFAULT: 'hsl(var(--primary))', foreground: 'hsl(var(--primary-foreground))' },
        secondary: { DEFAULT: 'hsl(var(--secondary))', foreground: 'hsl(var(--secondary-foreground))' },
        muted: { DEFAULT: 'hsl(var(--muted))', foreground: 'hsl(var(--muted-foreground))' },
        accent: { DEFAULT: 'hsl(var(--accent))', foreground: 'hsl(var(--accent-foreground))' },
        destructive: { DEFAULT: 'hsl(var(--destructive))', foreground: 'hsl(var(--destructive-foreground))' },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
      },
      fontFamily: {
        display: ['var(--font-display)', 'Impact', 'sans-serif'],
        sans: ['var(--font-body)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'monospace'],
      },
      fontSize: {
        // Display scale is fluid so headlines stay imposing on a 360px phone
        // without overflowing, and never outgrow the grid on a 2560px monitor.
        'display-sm': ['clamp(2.25rem, 6vw, 3.5rem)', { lineHeight: '0.95', letterSpacing: '-0.02em' }],
        'display-md': ['clamp(2.75rem, 8vw, 5rem)', { lineHeight: '0.92', letterSpacing: '-0.025em' }],
        'display-lg': ['clamp(3.25rem, 11vw, 8.5rem)', { lineHeight: '0.86', letterSpacing: '-0.035em' }],
        eyebrow: ['0.6875rem', { lineHeight: '1', letterSpacing: '0.28em' }],
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      boxShadow: {
        plate: '0 30px 80px -30px rgba(0,0,0,0.9), 0 0 0 1px rgba(245,242,237,0.05)',
        'glow-red': '0 0 40px -8px rgba(225,27,34,0.55)',
        'glow-gold': '0 0 40px -8px rgba(201,162,39,0.5)',
        inset: 'inset 0 1px 0 0 rgba(245,242,237,0.07)',
      },
      backgroundImage: {
        'gold-sheen': 'linear-gradient(100deg,#7A5C12 0%,#C9A227 28%,#F3DA95 48%,#C9A227 68%,#7A5C12 100%)',
        'red-forge': 'linear-gradient(135deg,#E11B22 0%,#8E0F17 100%)',
        'plate-fade': 'linear-gradient(180deg,rgba(8,7,10,0) 0%,rgba(8,7,10,0.65) 55%,#08070A 100%)',
      },
      transitionTimingFunction: {
        hut: 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
      keyframes: {
        marquee: { from: { transform: 'translateX(0)' }, to: { transform: 'translateX(-50%)' } },
        sheen: { from: { backgroundPosition: '200% center' }, to: { backgroundPosition: '-200% center' } },
        float: { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-10px)' } },
        'accordion-down': { from: { height: '0' }, to: { height: 'var(--radix-accordion-content-height)' } },
        'accordion-up': { from: { height: 'var(--radix-accordion-content-height)' }, to: { height: '0' } },
      },
      animation: {
        marquee: 'marquee 32s linear infinite',
        sheen: 'sheen 6s linear infinite',
        float: 'float 6s ease-in-out infinite',
        'accordion-down': 'accordion-down 0.25s ease-out',
        'accordion-up': 'accordion-up 0.25s ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};

export default config;
