// @ts-check

import fs from 'fs/promises';
import path from 'path';

import { nativeModulesPlugin } from '@douglasneuroinformatics/esbuild-plugin-native-modules';
import { prismaPlugin } from '@douglasneuroinformatics/esbuild-plugin-prisma';
import esbuild from 'esbuild';
import { copy } from 'esbuild-plugin-copy';
import esbuildPluginTsc from 'esbuild-plugin-tsc';

const entryFile = path.resolve(import.meta.dirname, '../src/main.ts');
const outdir = path.resolve(import.meta.dirname, '../dist');
const tsconfig = path.resolve(import.meta.dirname, '../tsconfig.json');

await fs.rm(outdir, { force: true, recursive: true });
await fs.mkdir(outdir);

const cjsShims = `
const { __dirname, __filename, require } = await (async () => {
  const module = (await import('module')).default;
  const path = (await import('path')).default;
  const url = (await import('url')).default;

  const __filename = url.fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const require = module.createRequire(__dirname);

  return { __dirname, __filename, require };
})();
`;

const watch = process.argv.includes('--watch');

/** @type {import('esbuild').BuildOptions} */
const options = {
  banner: {
    js: cjsShims
  },
  bundle: true,
  entryPoints: [entryFile],
  external: ['@nestjs/microservices', '@nestjs/websockets/socket-module', 'class-transformer', 'class-validator'],
  format: 'esm',
  keepNames: true,
  outfile: path.resolve(outdir, 'app.mjs'),
  platform: 'node',
  plugins: [
    copy({
      assets: {
        from: ['./src/i18n/translations/*'],
        to: ['./dist/translations']
      },
      resolveFrom: path.resolve(import.meta.dirname, '..'),
      watch
    }),
    esbuildPluginTsc({
      tsconfigPath: tsconfig
    }),
    prismaPlugin({ outdir: path.join(outdir, 'core') }),
    nativeModulesPlugin({
      resolveFailure: 'warn'
    })
  ],
  target: 'node20',
  tsconfig
};

if (watch) {
  const ctx = await esbuild.context({
    ...options,
    sourcemap: true
  });
  await ctx.watch();
  console.log('Watching...');
} else {
  await esbuild.build(options);
  console.log('Done!');
}
