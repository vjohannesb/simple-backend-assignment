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
      'arn:aws:sqs:${self:provider.environment.AWS_REGION}:' +
      '${self:provider.environment.AWS_ACCOUNT}:' +
      '${self:provider.environment.VEHICLE_BRANDS_QUEUE}',
  },
  {
    Effect: 'Allow',
    Action: ['s3:GetObject'],
    Resource: 'arn:aws:s3:::${self:provider.environment.VEHICLE_BRANDS_BUCKET}-${self:provider.environment.STAGE}/*',
  },
  {
    Effect: 'Allow',
    Action: ['dynamodb:Query', 'dynamodb:Scan', 'dynamodb:UpdateItem', 'dynamodb:PutItem'],
    Resource: [
      'arn:aws:dynamodb:${self:provider.environment.AWS_REGION}:' +
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
