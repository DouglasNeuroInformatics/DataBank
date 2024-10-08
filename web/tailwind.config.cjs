const config = require('@douglasneuroinformatics/libui/tailwind/config');

module.exports = config({
  content: ['index.html', './src/**/*.{js,ts,jsx,tsx}'],
  root: __dirname
});
