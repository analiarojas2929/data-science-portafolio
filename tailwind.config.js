/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'data-pink-light': '#FADADD',
        'data-pink': '#C03A74',
        'data-pink-dark': '#a82d63',
      },
    },
  },
  plugins: [],
}