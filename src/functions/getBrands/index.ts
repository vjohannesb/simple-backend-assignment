import { BrandsRepo } from '../BrandsRepo';
import { notFound, response } from '../response';

const repo = new BrandsRepo();
export async function handler(_event: AWSLambda.APIGatewayEvent): Promise<AWSLambda.APIGatewayProxyResult> {
  console.log('Fetching brands from DynamoDB.');

  const result = await repo.getBrands();
  if (!result?.length) return notFound('No brands found.');

  return response(result);
}
