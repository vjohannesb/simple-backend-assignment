export const vehicleBrandsSQS = {
  Type: 'AWS::SQS::Queue',
  Properties: {
    QueueName: '${self:provider.environment.VEHICLE_BRANDS_SQS}',
  },
};
