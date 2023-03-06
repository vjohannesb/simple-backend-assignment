import { BrandsRepo } from '../BrandsTableRepo';
import { notFound, response } from '../response';

const repo = new BrandsRepo();
export async function handler(_event: AWSLambda.APIGatewayEvent): Promise<AWSLambda.APIGatewayProxyResult> {
  console.log('Fetching brands from DynamoDB.');

  const result = await repo.getBrands();
  if (!result?.length) {
    console.log('No brands found.');
    return notFound('No brands found.');
  }

  console.log(`Found ${result.length} brands.`);
  return response(result);
}
