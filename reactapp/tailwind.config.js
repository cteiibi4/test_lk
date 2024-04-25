/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'media',
  content: ["./src/**/*.{html,js,jsx}", "./public/*.html"],
  theme: {
    extend: {
      animation:{
        shake: 'shake 1s',
      },
      keyframes: {
        shake: {
          '0%': {
            'margin-right': 0
          },
          '25%':{
            'margin-right': '25px'
          },
          '75%':{
            'margin-right': '-25px'
          },
          '100%':{
            'margin-right': 0
          }
        }
      },
      rotate: {
        '270': '270deg',
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('flowbite/plugin')
  ],
}

