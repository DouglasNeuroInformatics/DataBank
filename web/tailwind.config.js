import config from '@douglasneuroinformatics/ui/tailwind.config';

/** @type {import('tailwindcss').Config} */
export default {
  content: [...config.content, 'index.html', './src/**/*.{js,ts,jsx,tsx}'],
  presets: [config]
};
