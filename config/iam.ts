const statements = [
  {
    Effect: 'Allow',
    Action: ['xray:PutTraceSegments', 'xray:PutTelemetryRecords'],
    Resource: ['*'],
  },
  {
    Effect: 'Allow',
    Action: ['sqs:SendMessage'],
    Resource:
      'arn:aws:sqs:eu-north-1:' +
      '${self:provider.environment.AWS_ACCOUNT}:' +
      '${self:provider.environment.VEHICLE_BRANDS_QUEUE}',
  },
  {
    Effect: 'Allow',
    Action: ['s3:GetObject', 's3:DeleteObject'],
    Resource: 'arn:aws:s3:::${self:provider.environment.VEHICLE_BRANDS_BUCKET}-${self:provider.environment.STAGE}/*',
  },
  {
    Effect: 'Allow',
    Action: ['dynamodb:Query', 'dynamodb:Scan', 'dynamodb:UpdateItem', 'dynamodb:PutItem', 'dynamodb:GetItem'],
    Resource: [
      'arn:aws:dynamodb:eu-north-1:' +
        '${self:provider.environment.AWS_ACCOUNT}:' +
        'table/${self:provider.environment.VEHICLE_BRANDS_TABLE}',
    ],
  },
];

export default {
  role: {
    statements,
  },
};
