import type { Config } from 'tailwindcss';

/**
 * 4Ever Inner Circle — Tailwind configuration
 *
 * The brand palette is locked in here as Tailwind tokens.
 * Use these names everywhere: bg-cream, text-plum, border-mauve, etc.
 *
 * Colours derived from the 4Ever Photos brand:
 *   blush  — signature soft pink
 *   plum   — signature deep wine
 *   mauve  — signature dusty rose accent
 *   ink    — dark green-charcoal (the "4ever" wordmark colour)
 *   cream  — warm ivory background
 */
const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './content/**/*.{ts,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        // Brand palette
        cream: '#FAF4F0',
        blush: {
          DEFAULT: '#F0D5D0',
          soft: '#F5E2DD',
          deep: '#E8C5BE'
        },
        plum: {
          DEFAULT: '#4A1F3D',
          deep: '#381530'
        },
        mauve: {
          DEFAULT: '#A86B85',
          soft: '#C49AAA'
        },
        ink: '#2E3528',
        charcoal: '#3D4338',
        whisper: 'rgba(46, 53, 40, 0.6)',
        hairline: 'rgba(74, 31, 61, 0.14)'
      },
      fontFamily: {
        // Editorial serif — headlines, italics
        serif: ['var(--font-cormorant)', 'serif'],
        // Sans — body, labels, UI
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        // Brushy script — for "4ever"-style accents
        script: ['var(--font-yellowtail)', 'cursive'],
        // Elegant signature — for Annette's sign-off
        signature: ['var(--font-sacramento)', 'cursive']
      },
      letterSpacing: {
        'label': '0.32em',
        'small-caps': '0.22em'
      },
      maxWidth: {
        'container': '1240px',
        'narrow': '720px'
      },
      animation: {
        'fade-up': 'fadeUp 0.8s ease-out forwards'
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        }
      }
    }
  },
  plugins: []
};

export default config;
