// Set up SQS to use FIFO, but not based on content as multiple messages may contain the same vehicle brand.
// Instead include a MessageDeduplicationId in the send command.
export const vehicleBrandsSQS = {
  Type: 'AWS::SQS::Queue',
  Properties: {
    QueueName: '${self:provider.environment.VEHICLE_BRANDS_QUEUE}',
    ContentBasedDeduplication: false,
  },
};
