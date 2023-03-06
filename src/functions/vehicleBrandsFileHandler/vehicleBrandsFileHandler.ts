const containsTextRegex = /[a-zA-Z]/;
// eslint-disable-next-line no-control-regex
const asciiRegex = /^[\x00-\x7F]*$/;

export function parseBrandTextFile(textFile?: string): string[] {
  if (!textFile?.length || typeof textFile !== 'string') return [];

  const rows = textFile.split('\n');

  const brands = [];
  for (const row of rows) {
    if (!row?.length) continue;

    const brand = row.trim();
    if (!brand?.length) continue;

    if (containsTextRegex.test(brand)) brands.push(brand);
  }

  return brands;
}

/** Checks for non-ascii characters in the read text file.
 * Not complete, but should be good enough for this use case. */
export function validateTextFile(textFile: string): boolean {
  if (!textFile?.length || typeof textFile !== 'string') return false;

  const isPlainText = asciiRegex.test(textFile);
  return isPlainText;
}
