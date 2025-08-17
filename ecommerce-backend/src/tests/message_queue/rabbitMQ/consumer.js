const amqp = require('amqplib');
const messages = 'hello, RabbitMQ for tipjs javascript';

const runConsumer = async () => {
  try {
    const connect = await amqp.connect('amqp://localhost');
    const channel = await connect.createChannel();

    const queueName = 'test-queue';

    await channel.assertQueue(queueName),
      {
        durable: true,
      };

    // send message to consumer channel
    channel.consume(
      queueName,
      (msg) => {
        console.log('message received', msg.content.toString());
      },
      {
        noAck: false,
      }
    );
    console.log('message sent', messages);
  } catch (error) {
    console.error(error);
  }
};

runConsumer().catch(console.error);
