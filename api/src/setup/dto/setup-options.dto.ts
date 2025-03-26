import { $SetupOptions } from '@databank/core';
import type { SetupOptions } from '@databank/core';
import { DataTransferObject } from '@douglasneuroinformatics/libnest';

export class SetupOptionsDto extends DataTransferObject($SetupOptions) implements SetupOptions {}
