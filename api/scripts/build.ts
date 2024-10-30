#!/usr/bin/env node

/* eslint-disable no-console */

import fs from 'fs/promises';
import path from 'path';

import { nativeModulesPlugin } from '@douglasneuroinformatics/esbuild-plugin-native-modules';
import { prismaPlugin } from '@douglasneuroinformatics/esbuild-plugin-prisma';
import esbuild from 'esbuild';
import type { BuildOptions } from 'esbuild';
import esbuildPluginTsc from 'esbuild-plugin-tsc';

const entryFile = path.resolve(import.meta.dirname, '../src/main.ts');
const outdir = path.resolve(import.meta.dirname, '../dist');
const tsconfig = path.resolve(import.meta.dirname, '../tsconfig.json');

const outfile = path.resolve(outdir, 'app.js');

const options: { external: NonNullable<unknown>; plugins: NonNullable<unknown> } & BuildOptions = {
  banner: {
    js: "Object.defineProperties(globalThis, { __dirname: { value: import.meta.dirname, writable: false }, __filename: { value: import.meta.filename, writable: false }, require: { value: (await import('module')).createRequire(import.meta.url), writable: false } });"
  },
  bundle: true,
  entryPoints: [entryFile],
  external: ['@nestjs/microservices', '@nestjs/websockets/socket-module', 'class-transformer', 'class-validator'],
  format: 'esm',
  keepNames: true,
  loader: {
    '.node': 'copy'
  },
  outfile,
  platform: 'node',
  plugins: [
    esbuildPluginTsc({
      tsconfigPath: tsconfig
    }),
    prismaPlugin({ outdir: path.join(outdir, 'prisma/client') }),
    nativeModulesPlugin({
      resolveFailure: 'warn'
    })
  ],
  target: ['node20', 'es2022'],
  tsconfig
};

async function clean() {
  await fs.rm(outdir, { force: true, recursive: true });
  await fs.mkdir(outdir);
}

async function copyTranslations() {
  return fs.cp(path.resolve(import.meta.dirname, '../src/i18n/translations'), path.resolve(outdir, 'translations'), {
    recursive: true
  });
}

async function copyIrisDataset() {
  return fs.cp(path.resolve(import.meta.dirname, '../src/setup/resources'), path.resolve(outdir, 'resources'), {
    recursive: true
  });
}

async function build() {
  await clean();
  await copyTranslations();
  await copyIrisDataset();
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
        void ctx.watch();
        console.log('Watching...');
      })
      .catch((err) => {
        reject(err as Error);
      });
  });
}

const isEntry = process.argv[1] === import.meta.filename;
if (isEntry) {
  await build();
}

export { clean, copyIrisDataset, copyTranslations, outfile, watch };
