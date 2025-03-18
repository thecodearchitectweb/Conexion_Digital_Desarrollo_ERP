/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      './src/views/**/*.ejs',
      './node_modules/flowbite/**/*.js'
    ],
      theme: {
      extend: {},
    },
    plugins: [
      require('flowbite/plugin')
    ],
  }