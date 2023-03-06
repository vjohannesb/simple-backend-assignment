import { SQSClient, SendMessageCommand, SendMessageCommandInput, SendMessageCommandOutput } from '@aws-sdk/client-sqs';
import { randomUUID } from 'crypto';

export class SQSRepo {
  private static sqs: SQSClient = new SQSClient({ region: 'eu-north-1' });
  private queueUrl =
    `https://sqs.${process.env.AWS_REGION}.amazonaws.com` +
    `/${process.env.AWS_ACCOUNT_ID}` +
    `/${process.env.VEHICLE_BRANDS_QUEUE}`;

  async sendBrandToSQS(brand: string): Promise<SendMessageCommandOutput> {
    const params: SendMessageCommandInput = {
      QueueUrl: this.queueUrl,
      MessageBody: brand,
      MessageDeduplicationId: randomUUID(),
    };

    try {
      const result = await SQSRepo.sqs.send(new SendMessageCommand(params));
      console.log(`SQS Message sent. Brand: ${brand}. MessageId: ${result.MessageId}.`);
      return result;
    } catch (ex) {
      console.error('Error at SQSRepo.sendMessage: ', ex?.message);
    }
  }
}
