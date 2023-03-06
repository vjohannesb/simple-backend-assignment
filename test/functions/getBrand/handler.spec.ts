import { handler } from '@/functions/getBrand';
import { DocumentClient } from '@/utils/DocumentClient';
import { GetCommand } from '@aws-sdk/lib-dynamodb';
import { mockClient } from 'aws-sdk-client-mock';

const ddbMock = mockClient(DocumentClient);

describe('Get brand', () => {
  beforeEach(() => {
    ddbMock.reset();
  });

  it('should return a brand if given a valid path parameter', async () => {
    const brand = 'volvo';
    const expected = { name: brand, counter: 1 };
    ddbMock.on(GetCommand).resolves({
      Item: expected,
    });

    const result = await handler({ pathParameters: { brand } } as any);
    console.log(result);

    expect(result.statusCode).toBe(200);
    expect(result.body).toBe(JSON.stringify(expected));
  });

  it('should return a 404 if brand does not exist yet', async () => {
    const brand = 'volvo';
    ddbMock.on(GetCommand).resolves({});

    const result = await handler({ pathParameters: { brand } } as any);
    console.log(result);

    expect(result.statusCode).toBe(404);
  });

  it('should return a 400 if given an invalid path parameter', async () => {
    const brand = '';
    const result = await handler({ pathParameters: { brand } } as any);
    console.log(result);

    expect(result.statusCode).toBe(400);
  });

  it('should log error if get call throws', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    ddbMock.on(GetCommand).rejects(new Error('Error'));

    await handler({ pathParameters: { brand: 'volvo' } } as any);

    expect(consoleSpy).toHaveBeenCalled();
  });
});
