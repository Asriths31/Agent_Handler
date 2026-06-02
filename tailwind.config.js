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
          100: '#00afb9',
          200: '#0081a7',
          300: '#0081a7',
          400: '#00afb9',
          500: '#fdfcdc',
        },
        primary: {
          50: '#00afb9',
          100: '#00afb9',
          500: '#fdfcdc',
          600: '#fdfcdc',
          700: '#fdfcdc',
        },
        slate: {
          50: '#0081a7',
          100: '#0081a7',
          200: '#0081a7',
          300: '#0081a7',
          400: '#00afb9',
          500: '#fdfcdc',
          600: '#fdfcdc',
          700: '#fdfcdc',
          800: '#fdfcdc',
          900: '#fdfcdc',
          950: '#fdfcdc',
        }
      }
    },
  },
  plugins: [],
}

