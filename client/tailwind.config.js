/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#7367f0',
          50: '#f3f2ff',
          100: '#e9e7ff',
          200: '#d6d2ff',
          300: '#b8b0ff',
          400: '#9585ff',
          500: '#7367f0',
          600: '#5e50ee',
          700: '#4c3fe0',
          800: '#3f35c4',
          900: '#37329e',
        },
      },
      fontFamily: {
        sans: ['Montserrat', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}



