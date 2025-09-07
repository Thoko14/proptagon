/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        heading: ['Space Grotesk', 'Inter', 'sans-serif'],
      },
      colors: {
        // Brand colors - Sky Blue theme
        primary: {
          DEFAULT: '#0ea5e9',    // sky-500
          hover: '#0284c7',      // sky-600
          light: '#e0f2fe',      // sky-100
          dark: '#0369a1',       // sky-700
          50: '#f0f9ff',         // sky-50
          100: '#e0f2fe',        // sky-100
          200: '#bae6fd',        // sky-200
          300: '#7dd3fc',        // sky-300
          400: '#38bdf8',        // sky-400
          500: '#0ea5e9',        // sky-500
          600: '#0284c7',        // sky-600
          700: '#0369a1',        // sky-700
          800: '#075985',        // sky-800
          900: '#0c4a6e',        // sky-900
        },
        // Module accent colors
        grow: '#10b981',         // emerald-500
        invest: '#06b6d4',       // cyan-500
        manage: '#0ea5e9',       // sky-500 (updated from teal)
        operate: '#84cc16',      // lime-500
        sell: '#f59e0b',         // amber-500
      },
      spacing: {
        // 4px spacing scale for layout consistency
        '1': '4px',
        '2': '8px',
        '3': '12px',
        '4': '16px',
        '5': '20px',
        '6': '24px',
        '8': '32px',
        '10': '40px',
        '12': '48px',
        '16': '64px',
      },
      maxWidth: {
        'container': '1280px',
      },
      borderRadius: {
        DEFAULT: '0.5rem',
        xl: '1rem',
        '2xl': '1.5rem',
      },
      boxShadow: {
        card: '0 4px 14px rgba(0, 0, 0, 0.08)',
        soft: '0 2px 8px rgba(0, 0, 0, 0.06)',
      },
      transitionDuration: {
        DEFAULT: '150ms',
      },
    },
  },
  plugins: [],
} 