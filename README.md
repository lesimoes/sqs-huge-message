# sqs-huge-message
A service to send and receive huge (and not huge) payload to SQS with Lambda.

![Node.js CI](https://github.com/lesimoes/sqs-huge-message/workflows/Node.js%20CI/badge.svg?branch=master) [![NPM version](https://img.shields.io/npm/v/sqs-huge-message.svg)](https://www.npmjs.com/package/sqs-huge-message)
#### How it works

"A picture is worth a thousand words", said a painter, then check this out this nice and emoji flow picture below.


![send message](https://raw.githubusercontent.com/lesimoes/sqs-huge-message/master/docs/send.png)

![receive message](https://raw.githubusercontent.com/lesimoes/sqs-huge-message/master/docs/receive.png)


Nice, isn't, but we have a explanation in words too: AWS Node SDK has a little anoing particularity about size of messages, sometimes we need send a huge message payload to SQS, but the AWS SQS has a limit of 256kb (😢). One way to tackle this particularity is send a huge message payload to S3 Bucket and a meta-data, with info about file on Bucket, to SQS. For receive messages the process should work as the same way, and after receivement the message will be deleted from SQS. 


#### Instalation

```
npm install sqs-huge-message
```

#### Usage

##### Initialize

```javascript
import { SqsService } from './sqs-huge-msg';

const sqsOptions = {
    endpoint: ENDPOINT_SQS,
    region: REGION,
    queueName: QUEUE_NAME,
    s3EndpointUrl: ENDPOINT_S3,
    s3Bucket: BUCKET_NAME,
}

const sqsService = new SqsService(sqsOptions);
```

##### Send Message

```javascript
import { SqsService } from './sqs-huge-msg';

const payload = await sqsService.sendMessage(sqsOptions.queueName, message);

```

##### Receive Message

```javascript
import { SqsService } from './sqs-huge-msg';

const message = await sqsService.getMessage(sqsOptions.queueName);

```




#### More info

I based my project on this awesome project: https://github.com/aspecto-io/sns-sqs-big-payload
This project works very well, but doesn't work with AWS Lambda.


