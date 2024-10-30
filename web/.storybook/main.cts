import type { StorybookConfig } from '@storybook/react-vite';

import path = require('node:path');

import autoprefixer = require('autoprefixer');
import tailwindcss = require('tailwindcss');
import vite = require('vite');

const config: StorybookConfig = {
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    '@storybook/addon-themes'
  ],
  docs: {
    autodocs: 'tag'
  },
  framework: {
    name: '@storybook/react-vite',
    options: {}
  },
  stories: [
    {
      directory: '../src/components',
      files: '**/*.stories.@(js|jsx|ts|tsx)',
      titlePrefix: 'Components'
    },
    {
      directory: '../src/features',
      files: '**/*.stories.@(js|jsx|ts|tsx)',
      titlePrefix: 'Features'
    }
  ],
  viteFinal(config) {
    return vite.mergeConfig(config, {
      css: {
        postcss: {
          plugins: [autoprefixer(), tailwindcss()]
        }
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '..', 'src')
        }
      }
    });
  }
};

export = config;
