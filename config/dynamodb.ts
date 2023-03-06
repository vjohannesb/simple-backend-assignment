export const vehicleBrandsTable = {
  Type: 'AWS::DynamoDB::Table',
  DeletionPolicy: 'Retain',
  UpdateReplacePolicy: 'Retain',
  Properties: {
    TableName: '${self:provider.environment.VEHICLE_BRANDS_TABLE}',
    AttributeDefinitions: [
      {
        AttributeName: 'brand',
        AttributeType: 'S',
      },
    ],
    KeySchema: [
      {
        AttributeName: 'brand',
        KeyType: 'HASH',
      },
    ],
    PointInTimeRecoverySpecification: {
      PointInTimeRecoveryEnabled: true,
    },
    BillingMode: 'PAY_PER_REQUEST',
  },
};
