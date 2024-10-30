import nodemon from 'nodemon';

import { clean, copyIrisDataset, copyTranslations, outfile, watch } from './build.js';

await clean();
await copyIrisDataset();
await copyTranslations();
await watch();

nodemon({ script: outfile });
