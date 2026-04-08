/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f5f7ff',
          100: '#ebf0fe',
          200: '#cebcfe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
          950: '#1e1b4b',
        },
        neutral: {
          50: '#fafafa',
          100: '#f5f5f5',
          200: '#e5e5e5',
          300: '#d4d4d4',
          400: '#a3a3a3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#171717',
          950: '#0a0a0c',
        },
        secondary: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617',
        },
        border: "#262626", 
        input: "#171717",
        ring: "#4f46e5",
        background: "#0a0a0c",
        foreground: "#f5f5f5",
        card: {
          DEFAULT: "#121214",
          foreground: "#f5f5f5",
        },
        popover: {
          DEFAULT: "#121214",
          foreground: "#f5f5f5",
        },
        muted: {
          DEFAULT: "#171717",
          foreground: "#737373",
        },
        accent: {
          DEFAULT: "#171717",
          foreground: "#f5f5f5",
        },
        destructive: {
          DEFAULT: "#450a0a",
          foreground: "#f5f5f5",
        },
      },
      fontFamily: {
        sans: ['Inter', 'SF Pro Display', 'sans-serif'],
      },
      boxShadow: {
        'stripe': '0 2px 5px rgba(0,0,0,0.4), 0 1px 1px rgba(0,0,0,0.1)',
        'linear-glow': '0 0 20px rgba(79, 70, 229, 0.15)',
      },
    },
  },
  plugins: [],
}
