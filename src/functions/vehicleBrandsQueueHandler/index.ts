import { BrandsRepo } from '../BrandsTableRepo';

const repo = new BrandsRepo();
export async function handler(event: AWSLambda.SQSEvent): Promise<void> {
  const records = event.Records;
  if (!records?.length) {
    console.error('No records found in event.');
    return;
  }

  for (const record of records) {
    const brand = record.body;
    if (!brand) {
      console.error('No brand found in record.');
      continue;
    }

    console.log('Incrementing brand count: ', brand);

    try {
      const result = await repo.incrementBrandCounter(brand);
      console.log('Brand count incremented: ', result.counter);
    } catch (ex) {
      console.error('Error when incrementing brand count: ', ex?.message, brand);
    }
  }
}
