import { useMemo, useRef, useState } from 'react';

import {
  licensesArrayLowercase,
  mostFrequentOpenSourceLicenses,
  nonOpenSourceLicensesArray,
  openSourceLicensesArray
} from '@databank/core';
import type { $DatasetLicenses, LicenseWithLowercase } from '@databank/core';
import type FormTypes from '@douglasneuroinformatics/libui-form-types';

type BaseFormData = {
  isOpenSource?: boolean;
  license?: $DatasetLicenses;
  searchLicenseString?: string;
};

function toObject(licenses: typeof licensesArrayLowercase): { [key: string]: string } {
  return Object.fromEntries(
    licenses.map(([key, value]) => {
      return [key, value.name];
    })
  );
}

export function useDebounceLicensesFilter() {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const [licenseOptions, setLicenseOptions] = useState<{ [key: string]: string }>(mostFrequentOpenSourceLicenses);

  const subscribe = useMemo(
    () => ({
      onChange: (values: BaseFormData, setValues: React.Dispatch<React.SetStateAction<BaseFormData>>) => {
        clearTimeout(timeoutRef.current);
        const { isOpenSource, license, searchLicenseString } = values;

        if (searchLicenseString === undefined && isOpenSource === undefined) {
          setLicenseOptions(mostFrequentOpenSourceLicenses);
          return;
        }

        const searchString = searchLicenseString?.toLowerCase();

        timeoutRef.current = setTimeout(() => {
          let filterLicensesArray: [string, LicenseWithLowercase][];
          if (isOpenSource === undefined) {
            filterLicensesArray = licensesArrayLowercase;
          } else {
            filterLicensesArray = isOpenSource ? openSourceLicensesArray : nonOpenSourceLicensesArray;
          }

          if (!searchString) {
            setLicenseOptions(toObject(filterLicensesArray));
            if (filterLicensesArray.find(([key]) => key === license)) {
              setValues((prevValues) => ({ ...prevValues, license: undefined }));
            }
            return;
          }

          filterLicensesArray = filterLicensesArray.filter(
            ([_, license]) =>
              license.lowercaseLicenseId.includes(searchString) || license.lowercaseName.includes(searchString)
          );

          setLicenseOptions(toObject(filterLicensesArray));
          if (filterLicensesArray.find(([key]) => key === license)) {
            setValues((prevValues) => ({ ...prevValues, license: undefined }));
          }
        }, 500);
      },
      selector: (values: FormTypes.PartialData<BaseFormData>) => {
        return `${values.isOpenSource}-${values.searchLicenseString}`;
      }
    }),
    []
  );

  return { licenseOptions, subscribe };
}
