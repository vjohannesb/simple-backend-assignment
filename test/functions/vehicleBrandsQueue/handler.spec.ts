import { handler } from '@/functions/vehicleBrandsQueue';
import { DynamoDBDocumentClient, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { mockClient } from 'aws-sdk-client-mock';

const ddbMock = mockClient(DynamoDBDocumentClient);
describe('Vehicle brands queue', () => {
  beforeEach(() => {
    ddbMock.reset();
  });

  it('should log error if no records are found in event', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    await handler({} as any);
    expect(consoleSpy).toHaveBeenCalled();
  });

  it('should log error if no brand is found in record', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    const Records = [{ body: '' }];
    await handler({ Records } as any);
    expect(consoleSpy).toHaveBeenCalled();
  });

  it('should log error if update call throws', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    ddbMock.on(UpdateCommand).rejects(new Error('Error'));
    const Records = [{ body: 'volvo' }];
    await handler({ Records } as any);
    expect(consoleSpy).toHaveBeenCalled();
  });

  it('should call `update` to increment brands received from the queue', async () => {
    ddbMock.on(UpdateCommand).resolves({});

    const Records = [
      {
        body: 'volvo',
      },
      {
        body: 'Volvo',
      },
      {
        body: 'Renault',
      },
    ];

    await handler({ Records } as any);

    const updateCalls = ddbMock.commandCalls(UpdateCommand);
    Records.forEach((record, index) => {
      const brand = updateCalls[index].firstArg.input.Key.brand;
      expect(brand).toBe(record.body.toLowerCase());
    });
  });
});
