
import * as AWS from 'aws-sdk';
import { v4 as uuid } from 'uuid';

export interface SqsServiceOptions {
    endpoint?: string,
    region: string,
    queueName: string,
    maxMessageSize?: number,
    s3EndpointUrl: string,
    s3Bucket: string,
}

export enum SqsServiceMessage {
    MAX_SQS_MESSAGE_SIZE = 256 * 1024
}
export class SqsService {
    
    private endpoint: string;
    private region: string;
    private queueName: string;
    private maxMessageSize: number;
    private s3EndpointUrl: string;
    private s3Bucket: string;

    constructor(options: SqsServiceOptions) {
        this.endpoint = options.endpoint;
        this.region = options.region;
        this.queueName = options.queueName;
        this.maxMessageSize = options.maxMessageSize || SqsServiceMessage.MAX_SQS_MESSAGE_SIZE;
        this.s3EndpointUrl = options.s3EndpointUrl;
        this.s3Bucket = options.s3Bucket;

    }

    private getInstance (): AWS.SQS {
        const sqsConfig = {
            region: this.region,
            endpoint: this.endpoint,
          }
          if (!this.endpoint) {
              delete sqsConfig.endpoint;
          }
          return new AWS.SQS(sqsConfig);
    }

    private getInstanceS3 (): AWS.S3 {
        const s3Config = {
            s3ForcePathStyle: true,
            signatureVersion: 'v2',
            region: this.region,
            endpoint: this.s3EndpointUrl,
        }
        return new AWS.S3(s3Config);
    }

    private async deleteMessage (queueName: string, message: any): Promise<void> {
        const queueUrl = await this.getQueueUrl(queueName);
        
        await this.getInstance()
        .deleteMessage({
            QueueUrl: queueUrl,
            ReceiptHandle: message.Messages[0].ReceiptHandle,
        }).promise();
    }

    public async getQueueUrl (queueName: string): Promise<string> {
        const { QueueUrl } = await this.getInstance()
        .getQueueUrl({
          QueueName: queueName || this.queueName,
        }).promise();
  
      return QueueUrl;
    }

    public async sendMessage (queueName: string, body: string): Promise<any> {
        const msgSize = Buffer.byteLength(body, 'utf-8');
        const queueUrl = await this.getQueueUrl(queueName);
        
        if (msgSize < this.maxMessageSize) {
            const messageConfig = {
              QueueUrl: queueUrl,
              MessageBody: JSON.stringify({
                  message: body,
              }),
            }
            return this.getInstance()
              .sendMessage(messageConfig).promise()
          }

          const keyId = uuid();
          const payloadId = `${keyId}.json`

          const responseBucket = await this.getInstanceS3().upload({
            Bucket: this.s3Bucket,
            Body: JSON.stringify({
                message: body,
            }),
            Key: payloadId,
          }).promise();

          const messageConfig = {
            QueueUrl: queueUrl,
            MessageBody: JSON.stringify({
              S3Payload: {
                Id: payloadId,
                Key: responseBucket.Key,
                Location: responseBucket.Location,
              },
            }),
          }
          return this.getInstance()
            .sendMessage(messageConfig).promise()
        }

    public async getMessage (queueName: string): Promise<any> {
        const queueUrl = await this.getQueueUrl(queueName);
        const message = await this.getInstance()
            .receiveMessage({ QueueUrl: queueUrl }).promise()
        
         let payloadMessage = message;
         const [{ Body }] = message.Messages;
         if (JSON.parse(Body).S3Payload) {
            const s3Object = await this.getInstanceS3()
                .getObject({
                    Bucket: this.s3Bucket,
                    Key: JSON.parse(Body).S3Payload.Key,
                })
                .promise();
            payloadMessage.Messages[0].Body = s3Object.Body.toString();
         }
        await this.deleteMessage(queueName, message);
        
        return message;
    }

}