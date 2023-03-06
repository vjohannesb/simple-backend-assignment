import { handler } from '@/functions/vehicleBrandsFileHandler';
import { DeleteObjectCommand, GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { SQSClient, SendMessageCommand } from '@aws-sdk/client-sqs';
import { mockClient } from 'aws-sdk-client-mock';
import { readFileSync } from 'fs';

const goodFile = readFileSync(`${__dirname}/goodFile.txt`, 'utf8');
const emptyFile = readFileSync(`${__dirname}/emptyFile.txt`, 'utf8');
const badFile = readFileSync(`${__dirname}/badFile.jpg`, 'utf8');

const mockedSQS = mockClient(SQSClient);
const mockedSQSReturn = { $metadata: {}, MessageId: '123' };

const mockedS3 = mockClient(S3Client);
const mockedS3GoodReturn = {
  Body: {
    async transformToString() {
      return Promise.resolve(goodFile);
    },
  } as any,
  ContentType: 'text/plain',
};
const mockedS3BadReturn = {
  Body: {
    async transformToString() {
      return Promise.resolve(badFile);
    },
  } as any,
  ContentType: 'image/jpeg',
};
const mockedS3EmptyReturn = {
  Body: {
    async transformToString() {
      return Promise.resolve(emptyFile);
    },
  } as any,
  ContentType: 'text/plain',
};
const mockedS3SpoofedReturn = {
  Body: {
    async transformToString() {
      return Promise.resolve(badFile);
    },
  } as any,
  ContentType: 'text/plain',
};

describe('Vehicle brands S3 stream', () => {
  beforeEach(() => {
    mockedSQS.reset();
    mockedS3.reset();
  });

  it('should log error and exit when no records are found in event', async () => {
    const logSpy = jest.spyOn(console, 'error');
    const event = {
      Records: [],
    };

    await handler(event as any);

    const sqsCalls = mockedSQS.commandCalls(SendMessageCommand);
    const s3Calls = mockedS3.commandCalls(GetObjectCommand);

    expect(logSpy).toHaveBeenCalledWith('No records found in event.');
    expect(sqsCalls.length).toBe(0);
    expect(s3Calls.length).toBe(0);
  });

  it('should log error and continue if file is not text/plain', async () => {
    let errorLog: any;
    console.error = jest.fn((message) => (errorLog = message));
    mockedS3.on(GetObjectCommand).resolves(mockedS3BadReturn);

    const event = {
      Records: [
        {
          s3: {
            bucket: { name: 'test-bucket' },
            object: { key: 'badFile.jpg' },
          },
        },
      ],
    };

    await handler(event as any);

    const sqsCalls = mockedSQS.commandCalls(SendMessageCommand);
    const s3Calls = mockedS3.commandCalls(GetObjectCommand);

    expect(errorLog).toContain('Invalid content type');
    expect(sqsCalls.length).toBe(0);
    expect(s3Calls.length).toBe(1);
  });

  it('should log error and continue if no brands are found in file', async () => {
    let errorLog: any;
    console.error = jest.fn((message) => (errorLog = message));
    mockedS3.on(GetObjectCommand).resolves(mockedS3EmptyReturn);

    const event = {
      Records: [
        {
          s3: {
            bucket: { name: 'test-bucket' },
            object: { key: 'goodFile.txt' },
          },
        },
      ],
    };

    await handler(event as any);

    const sqsCalls = mockedSQS.commandCalls(SendMessageCommand);
    const s3Calls = mockedS3.commandCalls(GetObjectCommand);

    expect(errorLog).toContain('No brands found in file');
    expect(sqsCalls.length).toBe(0);
    expect(s3Calls.length).toBe(1);
  });

  it('should log error and continue if file is not found', async () => {
    let errorLog: any;
    console.error = jest.fn((message) => (errorLog = message));
    mockedS3.on(GetObjectCommand).rejects(new Error('File not found'));

    const event = {
      Records: [
        {
          s3: {
            bucket: { name: 'test-bucket' },
            object: { key: 'none' },
          },
        },
      ],
    };

    await handler(event as any);

    const sqsCalls = mockedSQS.commandCalls(SendMessageCommand);
    const s3Calls = mockedS3.commandCalls(GetObjectCommand);

    expect(errorLog).toContain('Error when reading s3 object');
    expect(sqsCalls.length).toBe(0);
    expect(s3Calls.length).toBe(1);
  });

  it('should log error when SQS fails to send message and not delete file', async () => {
    let errorLog;
    console.error = jest.fn((message) => (errorLog = message));
    mockedS3.on(GetObjectCommand).resolves(mockedS3GoodReturn);
    mockedSQS.on(SendMessageCommand).rejects(new Error('SQS error'));

    const event = {
      Records: [
        {
          s3: {
            bucket: { name: 'test-bucket' },
            object: { key: 'goodFile.txt' },
          },
        },
      ],
    };

    await handler(event as any);

    const sqsCalls = mockedSQS.commandCalls(SendMessageCommand);
    const s3DeleteCalls = mockedS3.commandCalls(DeleteObjectCommand);

    expect(errorLog).toContain('Error at SQSRepo.sendMessage');
    expect(sqsCalls.length).toBe(6);
    expect(s3DeleteCalls.length).toBe(0);
  });

  it('should handle file with spoofed content type', async () => {
    mockedS3.on(GetObjectCommand).resolves(mockedS3SpoofedReturn);

    const event = {
      Records: [
        {
          s3: {
            bucket: { name: 'test-bucket' },
            object: { key: 'badFile.jpg' },
          },
        },
      ],
    };

    await handler(event as any);

    const sqsCalls = mockedSQS.commandCalls(SendMessageCommand);
    const s3Calls = mockedS3.commandCalls(GetObjectCommand);

    expect(sqsCalls.length).toBe(0);
    expect(s3Calls.length).toBe(1);
  });

  it('should read received key from S3, get file and send brands to the queue', async () => {
    mockedS3.on(GetObjectCommand).resolves(mockedS3GoodReturn);
    mockedSQS.on(SendMessageCommand).resolves(mockedSQSReturn);

    const event = {
      Records: [
        {
          s3: {
            bucket: { name: 'test-bucket' },
            object: { key: 'goodFile.txt' },
          },
        },
      ],
    };

    await handler(event as any);

    const sqsCalls = mockedSQS.commandCalls(SendMessageCommand);
    const s3Calls = mockedS3.commandCalls(GetObjectCommand);

    expect(sqsCalls.length).toBe(6);
    expect(s3Calls.length).toBe(1);
  });

  it('should delete the file from S3 after processing', async () => {
    mockedS3.on(GetObjectCommand).resolves(mockedS3GoodReturn);
    mockedS3.on(DeleteObjectCommand).resolves({});
    mockedSQS.on(SendMessageCommand).resolves(mockedSQSReturn);

    const event = {
      Records: [
        {
          s3: {
            bucket: { name: 'test-bucket' },
            object: { key: 'goodFile.txt' },
          },
        },
      ],
    };

    await handler(event as any);

    const s3Calls = mockedS3.commandCalls(DeleteObjectCommand);
    expect(s3Calls.length).toBe(1);
  });

  it('should log error if deletion failed', async () => {
    let errorLog;
    console.error = jest.fn((message) => (errorLog = message));
    mockedS3.on(GetObjectCommand).resolves(mockedS3GoodReturn);
    mockedS3.on(DeleteObjectCommand).rejects(new Error('Delete failed'));
    mockedSQS.on(SendMessageCommand).resolves(mockedSQSReturn);

    const event = {
      Records: [
        {
          s3: {
            bucket: { name: 'test-bucket' },
            object: { key: 'goodFile.txt' },
          },
        },
      ],
    };

    await handler(event as any);

    const s3Calls = mockedS3.commandCalls(DeleteObjectCommand);
    expect(errorLog).toContain('Error when deleting s3 object');
    expect(s3Calls.length).toBe(1);
  });

  it('should log deleted key if deletion succeeded', async () => {
    let consoleLog;
    console.log = jest.fn((message) => (consoleLog = message));
    mockedS3.on(GetObjectCommand).resolves(mockedS3GoodReturn);
    mockedS3.on(DeleteObjectCommand).resolves({});
    mockedSQS.on(SendMessageCommand).resolves(mockedSQSReturn);

    const event = {
      Records: [
        {
          s3: {
            bucket: { name: 'test-bucket' },
            object: { key: 'goodFile.txt' },
          },
        },
      ],
    };

    await handler(event as any);

    const s3Calls = mockedS3.commandCalls(DeleteObjectCommand);
    expect(consoleLog).toContain(`Deleted s3 object: ${event.Records[0].s3.object.key}`);
    expect(s3Calls.length).toBe(1);
  });
});
