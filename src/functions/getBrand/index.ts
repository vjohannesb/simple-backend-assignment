import { BrandsRepo } from '../BrandsTableRepo';
import { badRequest, notFound, response } from '../response';

const repo = new BrandsRepo();
export async function handler(event: AWSLambda.APIGatewayEvent): Promise<AWSLambda.APIGatewayProxyResult> {
  const brand = event.pathParameters?.brand;
  if (!brand?.length) return badRequest('Missing "brand" path parameter.');

  console.log('Fetching brand from DynamoDB: ', brand);

  const result = await repo.getBrand(brand);
  if (!result) {
    console.log(`Brand "${brand}" not found.`);
    return notFound(`Brand "${brand}" not found.`);
  }

  console.log(`Brand "${brand}" found: `, result);
  return response(result);
}
