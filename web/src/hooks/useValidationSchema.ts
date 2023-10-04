import { useMemo } from 'react';

import type { DatasetEntry, TDataset } from '@databank/types';
import { match } from 'ts-pattern';
import { z } from 'zod';

export function useValidationSchema<T extends DatasetEntry>({ columns }: Pick<TDataset<T>, 'columns'>) {
  return useMemo(() => {
    const entityShape: z.ZodRawShape = {};
    for (const column of columns) {
      entityShape[column.name] = match(column.type)
        .with('FLOAT', () => z.number())
        .with('INTEGER', () => z.number().int())
        .with('STRING', () => z.string())
        .exhaustive();
    }
    return z.array(z.object(entityShape));
  }, [columns]);
}
