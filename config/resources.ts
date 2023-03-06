import { vehicleBrandsSQS } from './sqs';
import { vehicleBrandsTable } from './dynamodb';

const resources = { vehicleBrandsSQS, vehicleBrandsTable };

export default {
  Resources: resources,
};
