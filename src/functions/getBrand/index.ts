import { BrandsRepo } from '../BrandsRepo';
import { badRequest, notFound, response } from '../response';

export async function handler(event: AWSLambda.APIGatewayEvent): Promise<AWSLambda.APIGatewayProxyResult> {
  const brand = event.pathParameters?.brand;
  if (!brand) return badRequest('Missing "brand" path parameter.');

  console.log('Fetching brand from DynamoDB: ', brand);

  const repo = new BrandsRepo();
  const result = await repo.getBrand(brand);
  if (!result) {
    console.log(`Brand "${brand}" not found.`);
    return notFound(`Brand "${brand}" not found.`);
  }

  console.log(`Brand "${brand}" found: `, result);
  return response(result);
}
