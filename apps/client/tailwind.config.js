/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        black: '#000000',
        'rich-black': '#0C1821',
        'oxford-blue': '#1B2A41',
        charcoal: '#324A5F',
        lavender: '#CCC9DC',
        'lavender-light': '#E8E6EF',
      },
    },
  },
  plugins: [],
};
