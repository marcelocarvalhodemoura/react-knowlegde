/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#007bff',
          hover: '#0056b3',
        },
        secondary: {
          DEFAULT: '#6c757d',
          hover: '#545b62',
        },
      },
    },
  },
  plugins: [],
}
