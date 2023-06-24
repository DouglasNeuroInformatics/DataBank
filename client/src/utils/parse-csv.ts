import Papa from 'papaparse';

import { formatFileSize } from './formatFileSize';

const MAX_FILE_SIZE = 10485760; // 10 MB

export async function parseCSV(file: File) {
  return new Promise((resolve, reject) => {
    if (!file) {
      throw new Error('File object must be defined');
    } else if (file.size > MAX_FILE_SIZE) {
      throw new Error(`File size of ${formatFileSize(file.size)} exceeds maximum of ${formatFileSize(MAX_FILE_SIZE)}`);
    }
    Papa.parse(file, {
      complete(results) {
        if (results.errors.length > 0) {
          throw new Error('Failed to parse file', {
            cause: results.errors
          });
        }
        resolve(results);
      },
      error: (error) => {
        reject(error);
      },
      header: true,
      skipEmptyLines: true,
      transformHeader(header, index) {
        if (header === '') {
          reject(new Error(`Invalid column name at index '${index}': must not be empty string`));
        } else if (!/^[\w.-]+$/.test(header)) {
          reject(new Error(`Invalid column name '${header}': must contain only letters, numbers, or underscores`));
        }
        return header.toUpperCase();
      }
    });
  });
}
