const containsTextRegex = /[a-zA-Z]/;

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
