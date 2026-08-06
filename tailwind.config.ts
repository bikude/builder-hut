import type { Config } from 'tailwindcss';

/**
 * A Builder Hut design tokens.
 *
 * Two token families live side by side on purpose:
 *  - `brand.*` — the literal palette the identity is built from. Black and gold carry the
 *    brand; copper and ember carry the warmth. Red is no longer a brand-wide primary — it
 *    is the Club's own accent, because the Club's floor is genuinely full of red iron.
 *    Use these in bespoke components.
 *  - `accent.*` — one hue per branch, sampled from that branch's own lighting:
 *    Batanagar's gold LED ceiling, the Club's red machines, 3.0's warm copper hex panels.
 *    A branch's accent colours its card, its rail panel and its section furniture, so the
 *    three read as siblings rather than repaints.
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
          // Surfaces and copy read from CSS variables so the light theme can flip them
          // without touching a single component. See the `.light` block in globals.css.
          ink: 'rgb(var(--ink) / <alpha-value>)', // page base
          forge: 'rgb(var(--forge) / <alpha-value>)', // raised surface
          steel: 'rgb(var(--steel) / <alpha-value>)', // hairlines, inset panels
          iron: 'rgb(var(--iron) / <alpha-value>)', // top of the metal gradient
          bullion: 'rgb(var(--bullion) / <alpha-value>)', // gold — value shifts for contrast, hue never does
          gilt: 'rgb(var(--gilt) / <alpha-value>)', // gold highlight
          copper: '#B4693C', // copper — warm mid, the second metal
          patina: '#7A4526', // copper shadow, gradient anchor
          flare: '#FF7A2F', // orange accent, used sparingly for heat
          blood: '#E11B22', // red — now the Club's accent, not a site-wide primary
          ember: '#8E0F17', // deep red, gradient anchor
          chalk: 'rgb(var(--chalk) / <alpha-value>)', // primary copy
          smoke: 'rgb(var(--smoke) / <alpha-value>)', // muted copy
        },
        accent: {
          // Per-branch identity. Sampled from each branch's real lighting.
          batanagar: '#C9A227',
          club: '#E11B22',
          'three-zero': '#B4693C',
        },
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: { DEFAULT: 'hsl(var(--card))', foreground: 'hsl(var(--card-foreground))' },
        popover: { DEFAULT: 'hsl(var(--popover))', foreground: 'hsl(var(--popover-foreground))' },
        primary: { DEFAULT: 'hsl(var(--primary))', foreground: 'hsl(var(--primary-foreground))' },
        secondary: { DEFAULT: 'hsl(var(--secondary))', foreground: 'hsl(var(--secondary-foreground))' },
        muted: { DEFAULT: 'hsl(var(--muted))', foreground: 'hsl(var(--muted-foreground))' },
        ui: { DEFAULT: 'hsl(var(--accent))', foreground: 'hsl(var(--accent-foreground))' },
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
        'glow-copper': '0 0 50px -10px rgba(180,105,60,0.6)',
        // Long, low, warm — a spotlight above the platform rather than a UI drop shadow.
        spot: '0 60px 120px -40px rgba(180,105,60,0.35), 0 0 0 1px rgba(245,242,237,0.06)',
        inset: 'inset 0 1px 0 0 rgba(245,242,237,0.07)',
      },
      backgroundImage: {
        'gold-sheen': 'linear-gradient(100deg,#7A5C12 0%,#C9A227 28%,#F3DA95 48%,#C9A227 68%,#7A5C12 100%)',
        'copper-sheen': 'linear-gradient(100deg,#5A3018 0%,#B4693C 30%,#E8A870 50%,#B4693C 70%,#5A3018 100%)',
        'red-forge': 'linear-gradient(135deg,#E11B22 0%,#8E0F17 100%)',
        // Brushed metal: fine anisotropic streaks, the way light behaves on a barbell sleeve.
        'brushed-metal':
          'repeating-linear-gradient(96deg,rgba(245,242,237,0.055) 0px,rgba(245,242,237,0.055) 1px,transparent 1px,transparent 3px),linear-gradient(160deg,#241F2C 0%,#0E0C13 55%,#06050A 100%)',
        // Warm volumetric wash used behind hero copy so text keeps contrast over video.
        'heat-wash':
          'radial-gradient(120% 80% at 12% 100%,rgba(180,105,60,0.28) 0%,transparent 60%),radial-gradient(90% 70% at 88% 0%,rgba(201,162,39,0.20) 0%,transparent 55%)',
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
