import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { SQSRepo } from '../SQSRepo';
import { SendMessageCommandOutput } from '@aws-sdk/client-sqs';
import { parseBrandTextFile, validateTextFile } from './vehicleBrandsStream';

const s3 = new S3Client({ region: 'eu-north-1' });
const sqs = new SQSRepo();

export async function handler(event: AWSLambda.S3Event): Promise<void> {
  const records = event.Records;
  if (!records?.length) {
    console.error('No records found in event.');
    return;
  }

  for (const record of records) {
    const { bucket, object } = record.s3;
    const params = {
      Bucket: bucket.name,
      Key: object.key,
    };

    let brands: string[];
    try {
      const s3Response = await s3.send(new GetObjectCommand(params));
      if (s3Response.ContentType !== 'text/plain') {
        console.error(`Invalid content type for file: ${params.Key}`);
        continue;
      }

      const textFile = await s3Response.Body?.transformToString();
      const isValidTextFile = validateTextFile(textFile);
      if (!isValidTextFile) {
        console.error(`Invalid file format for file: ${params.Key}`);
        continue;
      }

      brands = parseBrandTextFile(textFile);
      if (!brands?.length) {
        console.error(`No brands found in file: ${params.Key}`);
        continue;
      }
    } catch (ex) {
      console.error(`Error when fetching s3 object (${params.Key}): `, ex?.message);
      continue;
    }

    const promises: Promise<SendMessageCommandOutput>[] = [];
    for (const brand of brands) {
      console.log(`Sending brand to SQS: ${brand}`);
      promises.push(sqs.sendBrandToSQS(brand));
    }

    const result = await Promise.all(promises);
    console.log(`SQS messages sent: ${result.length}.`);
  }
}
