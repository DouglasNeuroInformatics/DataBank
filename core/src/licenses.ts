import { licenses } from '@douglasneuroinformatics/liblicense';
import z from 'zod/v4';

const licensesArray = Array.from(licenses);

const licensesObjects = Object.fromEntries(licensesArray);

type LicenseWithLowercase = (typeof licensesObjects)[string] & {
  lowercaseLicenseId: string;
  lowercaseName: string;
};

const licensesArrayLowercase: [string, LicenseWithLowercase][] = licensesArray.map(([key, value]) => {
  return [
    key,
    {
      lowercaseLicenseId: key.toLowerCase(),
      lowercaseName: value.name.toLowerCase(),
      ...value
    } as LicenseWithLowercase
  ];
});

const licensesWithLowercase = Object.fromEntries(licensesArrayLowercase);

const openSourceLicensesArray = licensesArrayLowercase.filter(([_, entry]) => entry.isOpenSource);

const nonOpenSourceLicensesArray = licensesArrayLowercase.filter(([_, entry]) => !entry.isOpenSource);

const openSourceLicenses = Object.fromEntries(openSourceLicensesArray);

const nonOpenSourceLicenses = Object.fromEntries(nonOpenSourceLicensesArray);

// Reference: https://opensource.org/blog/the-most-popular-licenses-for-each-language-2023
const mostFrequentOpenSourceLicensesArray = Object.entries(openSourceLicenses).filter(
  ([key, _]) => key.includes('MIT') || key.includes('Apache-2.0') || key.includes('BSD') || key.includes('GPL')
);

const mostFrequentOpenSourceLicenses = Object.fromEntries(
  mostFrequentOpenSourceLicensesArray.map(([key, value]) => {
    return [key, value.name];
  })
);

const $DatasetLicenses = z.enum(Object.keys(licensesObjects) as [string, ...string[]]);
type $DatasetLicenses = z.infer<typeof $DatasetLicenses>;

export {
  $DatasetLicenses,
  licensesArray,
  licensesArrayLowercase,
  licensesObjects,
  licensesWithLowercase,
  mostFrequentOpenSourceLicenses,
  nonOpenSourceLicenses,
  nonOpenSourceLicensesArray,
  openSourceLicenses,
  openSourceLicensesArray
};

export type { LicenseWithLowercase };
