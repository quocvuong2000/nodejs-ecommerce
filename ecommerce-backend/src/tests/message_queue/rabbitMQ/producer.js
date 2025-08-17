const amqp = require('amqplib');
const messages  = "hello, RabbitMQ for tipjs javascript";

const runProducer = async () => {
  try {
    const connect = await amqp.connect('amqp://localhost');
    const channel = await connect.createChannel();

    const queueName = 'test-queue';

    await channel.assertQueue(queueName), {
      durable: true,
    };

    // send message to consumer channel
     channel.sendToQueue(queueName, Buffer.from(messages));
     console.log('message sent',messages);
  } catch (error) {
    console.error(error);
  }
}

runProducer().catch(console.error);