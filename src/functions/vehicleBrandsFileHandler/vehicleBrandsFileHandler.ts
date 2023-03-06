import { DeleteObjectCommand, GetObjectCommand, GetObjectCommandInput, S3Client } from '@aws-sdk/client-s3';

const containsTextRegex = /[a-zA-Z]/;
// eslint-disable-next-line no-control-regex
const asciiRegex = /^[\x00-\x7F]*$/;

const s3Client = new S3Client({ region: 'eu-north-1' });

export async function parseUploadedFile(params: GetObjectCommandInput): Promise<string[]> {
  try {
    const s3Response = await s3Client.send(new GetObjectCommand(params));
    if (s3Response.ContentType !== 'text/plain') {
      console.error(`Invalid content type for file: ${params.Key}`);
      return;
    }

    const textFile = await s3Response.Body?.transformToString();
    const isValidTextFile = validateTextFile(textFile);
    if (!isValidTextFile) {
      console.error(`Invalid file format for file: ${params.Key}`);
      return;
    }

    const brands = parseBrandTextFile(textFile);
    if (!brands?.length) {
      console.error(`No brands found in file: ${params.Key}`);
      return;
    }

    return brands;
  } catch (ex) {
    console.error(`Error when reading s3 object (${params.Key}): `, ex?.message);
  }
}

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

/** Checks the first few bytes in the read text file for non-ascii characters,
 * which would indicate that it is not a plain text file.
 * Not complete, but should be good enough for this use case. */
export function validateTextFile(textFile: string): boolean {
  if (!textFile?.length || typeof textFile !== 'string') return false;

  const isPlainText = asciiRegex.test(textFile.slice(0, 20));
  return isPlainText;
}

export async function deleteS3Object(params: GetObjectCommandInput): Promise<boolean> {
  try {
    await s3Client.send(new DeleteObjectCommand(params));
    console.log(`Deleted s3 object: ${params.Key}`);
    return true;
  } catch (ex) {
    console.error(`Error when deleting s3 object (${params.Key}): `, ex?.message);
    return false;
  }
}
