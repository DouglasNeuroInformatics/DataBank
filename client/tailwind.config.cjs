// @ts-check

const path = require('path');

const baseConfig = require('@douglasneuroinformatics/react-components/tailwind.config.cjs');

const componentLibraryContent = path.join(
  path.dirname(require.resolve('@douglasneuroinformatics/react-components')),
  '**/*.{ts,tsx}'
);

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}', componentLibraryContent],
  presets: [baseConfig],
  darkMode: 'class'
};
