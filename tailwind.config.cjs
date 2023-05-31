// @ts-check

const baseConfig = require('@douglasneuroinformatics/react-components/tailwind.config.cjs');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './node_modules/@douglasneuroinformatics/react-components/dist/**/*.{js,cjs,mjs}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  presets: [baseConfig],
  darkMode: 'class',
  theme: {
    extend: {
      container: {
        center: true,
        padding: {
          DEFAULT: '1rem',
          sm: '2rem',
          lg: '4rem',
          xl: '5rem',
          '2xl': '6rem'
        }
      }
    }
  }
};
