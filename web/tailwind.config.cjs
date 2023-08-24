// @ts-check

const path = require('path');

const baseConfig = require('@douglasneuroinformatics/ui/tailwind.config.cjs');

const componentLibraryContent = path.join(
  path.dirname(require.resolve('@douglasneuroinformatics/ui')),
  '**/*.{js,cjs,mjs}'
);

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}', componentLibraryContent],
  presets: [baseConfig],
  darkMode: 'class',
  plugins: [require('@headlessui/tailwindcss'), require('@tailwindcss/container-queries')]
};
