/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        oat: {
          100: '#faf8f5',
          200: '#e1dbd3',
          300: '#faf8f5',
          400: '#b8ada1',
          500: '#36251c',
        },
        primary: {
          50: '#faf8f5',
          100: '#faf8f5',
          500: '#36251c',
          600: '#36251c',
          700: '#36251c',
        },
        slate: {
          50: '#faf8f5',
          100: '#e1dbd3',
          200: '#e1dbd3',
          300: '#e1dbd3',
          400: '#b8ada1',
          500: '#36251c',
          600: '#36251c',
          700: '#36251c',
          800: '#36251c',
          850: '#faf8f5',
          900: '#36251c',
          950: '#36251c',
        }
      }
    },
  },
  plugins: [],
}

