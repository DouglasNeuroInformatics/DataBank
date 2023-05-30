/** @type {import('tailwindcss').Config} */
const { createConfig } = require('@douglasneuroinformatics/react-components/tailwind.utils.cjs');

export default createConfig({
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}'
  ]
});
