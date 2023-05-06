/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./public/**/*.{html,js}"],
  theme: {
    extend: {
      fontFamily: {
        poppins: ['Poppins', ' sans-serif'],
        saira: ['Saira Condensed', 'sans-serif']
      },
      colors: {
        "color-gradient-1": "#474E68",
        "color-gradient-2": "#6B728E",
        'primary-color': '#088395',
        'primary-button': '#2A2F4F',
        'primary-header': '#9BA4B5'
      },

    },
  },
  plugins: [
    require('tailwind-scrollbar')
  ],
}