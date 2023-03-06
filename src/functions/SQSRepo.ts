import { SQSClient, SendMessageCommand, SendMessageCommandInput, SendMessageCommandOutput } from '@aws-sdk/client-sqs';
import { randomUUID } from 'crypto';

export class SQSRepo {
  private static sqs: SQSClient = new SQSClient({ region: 'eu-north-1' });
  private queueUrl = `https://sqs.eu-north-1.amazonaws.com/${process.env.AWS_ACCOUNT}/${process.env.VEHICLE_BRANDS_QUEUE}`;

  async sendBrandsToSQS(brands: string[]): Promise<SendMessageCommandOutput[]> {
    const promises: Promise<SendMessageCommandOutput>[] = [];
    for (const brand of brands) {
      console.log(`Sending brand to SQS: ${brand}`);
      promises.push(this.sendBrandToSQS(brand));
    }

    const result = await Promise.all(promises);
    console.log(`SQS messages sent: ${result.length}.`);
    return result;
  }

  private async sendBrandToSQS(brand: string): Promise<SendMessageCommandOutput> {
    const params: SendMessageCommandInput = {
      QueueUrl: this.queueUrl,
      MessageBody: brand,
      MessageDeduplicationId: randomUUID(),
      MessageGroupId: 'vehicle-brands',
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
