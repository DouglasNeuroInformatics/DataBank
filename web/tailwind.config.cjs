// @ts-check
const configFunction = require('@douglasneuroinformatics/libui/tailwind/config');

/** @type {import('tailwindcss').Config} */
module.exports = configFunction({
  content: ['./src/**/*.{js,ts,jsx,tsx}']
});
