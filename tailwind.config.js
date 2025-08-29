/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      colors: {
        bgGray: "#FAFAFA",
        lightGray: "#EAECF0",
        skyblue: "#02ADF7",
        bgBlue: "#EDF1FC",
      },
    },
  },
  plugins: [
    function ({ addComponents }) {
      addComponents({
        '.btn-primary': {
          '@apply w-20 h-10 w-fit px-3 bg-skyblue font-medium hover:bg-sky-600 text-white py-2 rounded-lg flex items-center justify-center transition duration-300 ease-in-out disabled:opacity-50': {},
        },
        '.btn-secondary': {
          '@apply w-20 h-10 w-fit px-3 bg-white text-skyblue font-medium border border-gray-300 hover:text-skyblue hover:border-skyblue py-2 rounded-lg flex items-center justify-center transition duration-300 ease-in-out disabled:opacity-50': {},
        },
        '.btn-outline': {
          '@apply w-20 h-10 w-fit px-3 font-bold bg-white text-skyblue border border-skyblue hover:text-skyblue hover:border-skyblue py-2 rounded-lg flex items-center justify-center transition duration-300 ease-in-out disabled:opacity-50': {},
        },
        '.btn-danger': {
          '@apply w-20 h-10 w-fit px-3 font-bold bg-red-600 text-white hover:bg-red-800 py-2 rounded-lg flex items-center justify-center transition duration-300 ease-in-out disabled:opacity-50': {},
        },
        '.thead': {
          '@apply text-[#5C5C5C] bg-gray-100 font-[400] text-sm leading-normal': {}
        },
        '.tbody': {
          '@apply border-b border-gray-200 hover:bg-gray-100': {}
        },   
        '.container': {
          '@apply rounded-lg shadow-sm bg-gray-100 pb-6' : {}
        },
        '.header': {
          '@apply flex justify-between items-center p-4 border-b bg-white' : {}
        },
        '.card': {
          '@apply p-6 rounded-lg bg-white m-4 shadow' : {}
        },
        '.select': {
          '@apply w-full border p-3 bg-white rounded-md' : {}
        },
        '.label': {
          '@apply block text-sm font-medium mb-1' : {}
        },
        '.disabled': {
          '@apply bg-gray-100 cursor-not-allowed' : {}
        },
        '.validation': {
          '@apply text-red-500 text-sm mt-1' : {}
        },
        '.badge': {
        '@apply inline-flex items-center px-2 py-1 text-xs font-medium rounded-full': {},
        },
        '.badge-green': {
          '@apply bg-green-100 text-green-800': {},
        },
        '.badge-red': {
          '@apply bg-red-100 text-red-800': {},
        },
      });
    },
  ],
}

