import { SqsService, SqsServiceOptions } from './sqs-huge-msg';

const TEST_ENDPOINTS = {
    sqsEndpointUrl: 'http://localhost:4566',
    s3EndpointUrl: 'http://localhost:4566',
}
const TEST_REGION = 'us-east-1';
const QUEUE_NAME = 'test-queue';
const TEST_BUCKET_NAME = 'huge-message-payload';

const sqsOptions: SqsServiceOptions = {
    endpoint: TEST_ENDPOINTS.sqsEndpointUrl,
    region: TEST_REGION,
    queueName: QUEUE_NAME,
    s3EndpointUrl: TEST_ENDPOINTS.s3EndpointUrl,
    s3Bucket: TEST_BUCKET_NAME,
}

const message = "Any man's life told truly is a novel. - Ernest Hemingway."

describe('SqsService', () => {
    test('Should send message direct to SQS', async () => {

        const sut = new SqsService(sqsOptions);
        await sut.sendMessage(sqsOptions.queueName, message);
        const messagePayload = await sut.getMessage(sqsOptions.queueName);
        const [{ Body }] = messagePayload.Messages;
        expect(JSON.parse(Body).message).toEqual(message)

    })
    test('Should send message direct to S3', async () => {

        sqsOptions.maxMessageSize = 1;
        const sut = new SqsService(sqsOptions);
        const queueResponse = await sut.sendMessage(sqsOptions.queueName, message);
        const messagePayload = await sut.getMessage(sqsOptions.queueName);
        const [{ Body }] = messagePayload.Messages;
        expect(JSON.parse(Body).message).toEqual(message)
    })
})