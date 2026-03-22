/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Syne"', 'sans-serif'],
        body: ['"DM Sans"', 'sans-serif'],
        mono: ['"DM Mono"', 'monospace'],
      },
      colors: {
        ink: {
          900: '#0d0d1a',
          800: '#1a1a2e',
          700: '#16213e',
          600: '#0f3460',
        },
        pulse: {
          DEFAULT: '#e94560',
          light: '#ff6b8a',
          dark: '#c72d47',
        },
        calm: {
          DEFAULT: '#4ecdc4',
          light: '#7eddd6',
          dark: '#2fa89f',
        },
        amber: {
          pill: '#f7c59f',
        }
      }
    }
  },
  plugins: []
}
