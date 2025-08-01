/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
       primary: '#5E4943',
        background: '#F7F1E6',
        'cream-rose': '#F8E1D6', // Soft pinkish cream
        'light-gray': '#E5E7EB', // Light gray

    },
  },
  plugins: [],
}
