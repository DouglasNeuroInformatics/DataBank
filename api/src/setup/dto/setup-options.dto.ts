import { DataTransferObject } from '@douglasneuroinformatics/libnest';

import { $SetupOptions } from '../setup.schemas';

import type { SetupOptions } from '../setup.schemas';

export class SetupOptionsDto extends DataTransferObject($SetupOptions) implements SetupOptions {}
