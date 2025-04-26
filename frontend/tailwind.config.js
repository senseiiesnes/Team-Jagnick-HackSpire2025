/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'deep-purple': '#432E54',
        'medium-purple': '#4B4376',
        'muted-rose': '#AE445A',
        'pale-pink': '#E8BCB9',
        'primary': '#432E54',    // Alias for deep-purple
        'secondary': '#4B4376',  // Alias for medium-purple
        'accent': '#AE445A',     // Alias for muted-rose
      }
    },
  },
  plugins: [],
} 