/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',     // for Next.js pages
    './components/**/*.{js,ts,jsx,tsx}', // for your UI components
    './lib/**/*.{js,ts,jsx,tsx}',     // for extensions or utils
  ],
  theme: {
    extend: {
      colors: {
        yellow: '#fde047',
        green: '#86efac',
        pink: '#f9a8d4',
        'blue-200': '#bfdbfe',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Georgia', 'serif'],
        mono: ['Courier New', 'monospace'],
        poppins: ['Poppins', 'sans-serif'],
      },
    },
  },
  darkMode: 'class', // or 'media' or false
  plugins: [],
};
