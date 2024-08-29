import path from 'node:path';

import autoprefixer from 'autoprefixer';
import tailwindcss from 'tailwindcss';
import { mergeConfig } from 'vite';

/** @type {import('@storybook/react-vite').StorybookConfig} */
const config = {
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    '@storybook/addon-themes',
    'storybook-react-i18next'
  ],
  core: {
    builder: '@storybook/builder-vite'
  },
  docs: {
    autodocs: 'tag'
  },
  framework: {
    name: '@storybook/react-vite',
    options: {}
  },
  stories: [
    {
      directory: '../src/features',
      files: '**/*.stories.@(js|jsx|ts|tsx)',
      titlePrefix: 'Features'
    }
  ],
  viteFinal(config) {
    return mergeConfig(config, {
      css: {
        postcss: {
          plugins: [autoprefixer(), tailwindcss()]
        }
      },
      resolve: {
        alias: {
          // eslint-disable-next-line no-undef
          '@': path.resolve(__dirname, '..', 'src')
        }
      }
    });
  }
};

export default config;
