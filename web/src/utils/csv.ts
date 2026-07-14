/** The maximum number of bytes read from the file in order to extract the header row */
const MAX_HEADER_BYTES = 1024 * 1024;

/** Split a delimited line, treating anything between double quotes as literal (matching the quote char used by polars on the server) */
const splitLine = (line: string, separator: string): string[] => {
  const values: string[] = [];
  let current = '';
  let isQuoted = false;
  for (let i = 0; i < line.length; i++) {
    const char = line[i]!;
    if (char === '"') {
      if (isQuoted && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        isQuoted = !isQuoted;
      }
    } else if (char === separator && !isQuoted) {
      values.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  values.push(current);
  return values;
};

const BYTE_ORDER_MARK = 0xfeff;

const stripByteOrderMark = (line: string): string => {
  return line.charCodeAt(0) === BYTE_ORDER_MARK ? line.slice(1) : line;
};

/**
 * Extract the column names from the header row of a CSV or TSV file. The separator is inferred from
 * the filename, as is done on the server when the file is parsed.
 */
export async function parseColumnNames(file: File): Promise<string[]> {
  const head = await file.slice(0, MAX_HEADER_BYTES).text();
  const separator = file.name.endsWith('.tsv') ? '\t' : ',';
  const headerRow = stripByteOrderMark(head.split('\n')[0]?.replace(/\r$/, '') ?? '');
  const columns = splitLine(headerRow, separator)
    .map((name) => name.trim())
    .filter((name) => name !== '');
  if (columns.length === 0) {
    throw new Error(`Failed to extract any column names from the header of file: ${file.name}`);
  }
  return columns;
}
