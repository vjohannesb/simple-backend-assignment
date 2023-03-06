import { deleteS3Object, parseUploadedFile } from './vehicleBrandsFileHandler';
import { SQSRepo } from '../SQSRepo';

const sqs = new SQSRepo();
export async function handler(event: AWSLambda.S3Event): Promise<void> {
  const records = event.Records;
  if (!records?.length) {
    console.error('No records found in event.');
    return;
  }

  for (const record of records) {
    const { bucket, object } = record.s3;
    const params = { Bucket: bucket.name, Key: object.key };

    const brands = await parseUploadedFile(params);
    if (!brands) continue;

    const sqsResult = await sqs.sendBrandsToSQS(brands);
    const success = sqsResult.every((result) => result?.MessageId);
    if (!success) continue;

    await deleteS3Object(params);
  }
}
