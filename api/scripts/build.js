#!/usr/bin/env node

import fs from 'fs/promises';
import path from 'path';

import { nativeModulesPlugin } from '@douglasneuroinformatics/esbuild-plugin-native-modules';
import { prismaPlugin } from '@douglasneuroinformatics/esbuild-plugin-prisma';
import esbuild from 'esbuild';
import esbuildPluginTsc from 'esbuild-plugin-tsc';

const entryFile = path.resolve(import.meta.dirname, '../src/main.ts');
const outdir = path.resolve(import.meta.dirname, '../dist');
const tsconfig = path.resolve(import.meta.dirname, '../tsconfig.json');

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

const outfile = path.resolve(outdir, 'app.mjs');

/** @type {import('esbuild').BuildOptions & { external: NonNullable<unknown>, plugins: NonNullable<unknown> }} */
const options = {
  banner: {
    js: cjsShims
  },
  bundle: true,
  entryPoints: [entryFile],
  external: ['@nestjs/microservices', '@nestjs/websockets/socket-module', 'class-transformer', 'class-validator'],
  format: 'esm',
  keepNames: true,
  outfile,
  platform: 'node',
  plugins: [
    esbuildPluginTsc({
      tsconfigPath: tsconfig
    }),
    prismaPlugin({ outdir: path.join(outdir, 'core') }),
    nativeModulesPlugin({
      resolveFailure: 'warn'
    })
  ],
  target: ['node18', 'es2022'],
  tsconfig
};

async function clean() {
  await fs.rm(outdir, { force: true, recursive: true });
  await fs.mkdir(outdir);
}

async function copyTranslations() {
  fs.cp(path.resolve(import.meta.dirname, '../src/i18n/translations'), path.resolve(outdir, 'translations'), {
    recursive: true
  });
}

async function build() {
  await clean();
  await copyTranslations();
  await esbuild.build(options);
  console.log('Done!');
}

async function watch() {
  return new Promise((resolve, reject) => {
    esbuild
      .context({
        ...options,
        plugins: [
          ...options.plugins,
          {
            name: 'rebuild',
            setup(build) {
              build.onEnd((result) => {
                console.log(`Done! Build completed with ${result.errors.length} errors`);
                resolve(result);
              });
            }
          }
        ],
        sourcemap: true
      })
      .then((ctx) => {
        ctx.watch();
        console.log('Watching...');
      })
      .catch((err) => {
        reject(err);
      });
  });
}

const isEntry = process.argv[1] === import.meta.filename;
if (isEntry) {
  build();
}

export { clean, copyTranslations, outfile, watch };
