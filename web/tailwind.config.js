const baseConfig = require('@douglasneuroinformatics/libui/tailwind.config.cjs');

/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [...baseConfig.content, './src/**/*.{js,ts,jsx,tsx}'],
  presets: [baseConfig]
};
