import { licenses } from '@douglasneuroinformatics/liblicense';
import z from 'zod/v4';

const licensesArray = Array.from(licenses);

const licensesObjects = Object.fromEntries(licensesArray);

// Labels embed the SPDX id because the combobox filters on the label, so this matches
// both a search for "Apache License 2.0" and one for "Apache-2.0"
const licenseOptions: { [key: string]: string } = Object.fromEntries(
  licensesArray.map(([id, license]) => [id, `${license.name} (${id})`])
);

const $DatasetLicenses = z.enum(Object.keys(licensesObjects) as [string, ...string[]]);
type $DatasetLicenses = z.infer<typeof $DatasetLicenses>;

export { $DatasetLicenses, licenseOptions, licensesObjects };
