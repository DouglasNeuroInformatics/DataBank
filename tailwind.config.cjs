/** @type {import('tailwindcss').Config} */
const { createConfig } = require('@douglasneuroinformatics/react-components/tailwind.utils.cjs');

module.exports = createConfig({
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}'
  ]
});
