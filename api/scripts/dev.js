import nodemon from 'nodemon';

import { clean, copyTranslations, outfile, watch } from './build.js';

await clean();
await copyTranslations();
await watch();
nodemon(outfile);
