import { licenses } from '@douglasneuroinformatics/liblicense';
import z from 'zod';

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

const openSourceLicenses = Object.fromEntries(licensesArrayLowercase.filter(([_, entry]) => entry.isOpenSource));

const nonOpenSourceLicenses = Object.fromEntries(licensesArrayLowercase.filter(([_, entry]) => !entry.isOpenSource));

// Reference: https://opensource.org/blog/the-most-popular-licenses-for-each-language-2023
const mostFrequentOpenSourceLicenses = Object.fromEntries(
  Object.entries(openSourceLicenses).filter(
    ([key, _]) => key.includes('MIT') || key.includes('Apache-2.0') || key.includes('BSD') || key.includes('GPL')
  )
);

const $DatasetLicenses = z.enum(Object.keys(licensesObjects) as [string, ...string[]]);

export {
  $DatasetLicenses,
  licensesArray,
  licensesObjects,
  licensesWithLowercase,
  mostFrequentOpenSourceLicenses,
  nonOpenSourceLicenses,
  openSourceLicenses
};
