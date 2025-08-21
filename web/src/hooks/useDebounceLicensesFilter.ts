import { useCallback } from 'react';

import { licensesArrayLowercase, nonOpenSourceLicensesArray, openSourceLicensesArray } from '@databank/core';
import type { LicenseWithLowercase } from '@databank/core';
import { useDebounceCallback } from 'usehooks-ts';

export function useDebounceLicensesFilter() {
  const _filterLicenses = useCallback(
    (searchString: string | undefined, isOpenSource: boolean | undefined): { [key: string]: string } => {
      let filterLicensesArray: [string, LicenseWithLowercase][];
      if (isOpenSource === undefined) {
        filterLicensesArray = licensesArrayLowercase;
      } else {
        filterLicensesArray = isOpenSource ? openSourceLicensesArray : nonOpenSourceLicensesArray;
      }

      if (searchString !== undefined) {
        filterLicensesArray = filterLicensesArray.filter(
          ([_, license]) =>
            license.lowercaseLicenseId.includes(searchString) || license.lowercaseName.includes(searchString)
        );
      }

      return Object.fromEntries(
        filterLicensesArray.map(([key, value]) => {
          return [key, value.name];
        })
      );
    },
    []
  );

  const debouncedLicensesFilter = useDebounceCallback(_filterLicenses, 200);

  return debouncedLicensesFilter;
}
