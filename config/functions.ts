export default {
  'get-brand': {
    handler: 'src/functions/getBrand/index.handler',
    events: [
      {
        httpApi: {
          path: '/brands/{brand}',
          method: 'get',
        },
      },
    ],
  },
  'get-brands': {
    handler: 'src/functions/getBrands/index.handler',
    events: [
      {
        httpApi: {
          path: '/brands',
          method: 'get',
        },
      },
    ],
  },
  'vehicle-brands-file-handler': {
    handler: 'src/functions/vehicleBrandsFileHandler/index.handler',
    events: [
      {
        s3: {
          bucket: '${self:provider.environment.VEHICLE_BRANDS_BUCKET-${self:provider.environment.STAGE}',
          event: 's3:ObjectCreated:*',
          rules: [{ prefix: 'uploads/' }],
        },
      },
    ],
  },
  'vehicle-brands-queue-handler': {
    handler: 'src/functions/vehicleBrandsQueueHandler/index.handler',
    events: [
      {
        sqs: {
          arn: {
            'Fn::GetAtt': ['${self:provider.environment.VEHICLE_BRANDS_QUEUE}', 'Arn'],
          },
        },
      },
    ],
  },
};
