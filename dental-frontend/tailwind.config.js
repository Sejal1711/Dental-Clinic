/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors:{
        primary:'#5E4943',
        background:'#F7F1E6' 
      },
    },
  },
  plugins: [],
}
