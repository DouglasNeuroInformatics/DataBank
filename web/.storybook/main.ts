import path from 'node:path';

import type { StorybookConfig } from '@storybook/react-vite';
import { mergeConfig } from 'vite';

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
    return mergeConfig(config, {
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '..', 'src')
        }
      }
    });
  }
};
export default config;
