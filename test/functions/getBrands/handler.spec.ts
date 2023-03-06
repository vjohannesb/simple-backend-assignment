import { handler } from '@/functions/getBrands';
import { DynamoDBDocumentClient, ScanCommand } from '@aws-sdk/lib-dynamodb';
import { mockClient } from 'aws-sdk-client-mock';

const ddbMock = mockClient(DynamoDBDocumentClient);

describe('Get brands', () => {
  beforeEach(() => {
    ddbMock.reset();
  });

  it('should return all brands available', async () => {
    const expected = [{ name: 'volvo', counter: 1 }];
    ddbMock.on(ScanCommand).resolves({
      Items: expected,
    });

    const result = await handler({} as any);
    console.log(result);

    expect(result.statusCode).toBe(200);
    expect(result.body).toBe(JSON.stringify(expected));
  });

  it('should return a 404 if no brands are available', async () => {
    ddbMock.on(ScanCommand).resolves({});

    const result = await handler({} as any);
    console.log(result);

    expect(result.statusCode).toBe(404);
  });

  it('should log error if scan call throws', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    ddbMock.on(ScanCommand).rejects(new Error('Error'));

    await handler({} as any);

    expect(consoleSpy).toHaveBeenCalled();
  });
});
