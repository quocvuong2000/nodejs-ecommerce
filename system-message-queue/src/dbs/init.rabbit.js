'use strict';

const amqp = require('amqplib');

const connectToRabbitMQ = async () => {
  try {
    const connection = await amqp.connect('amqp://guest:12345@localhost');

    const channel = await connection.createChannel();
    console.log('Connected to RabbitMQ');

    return { connection, channel };
  } catch (error) {
    console.error('Error connecting to RabbitMQ:', error);
    throw error;
  }
};

const connectToRabbitMQforTest = async () => {
  try {
    const { connection, channel } = await connectToRabbitMQ();

    // Publish message to a queue
    const message = { text: 'Hello RabbitMQ' };
    channel.assertQueue(queue);
    channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)));
    console.log('Message sent to RabbitMQ for Test:', message);

    // close the connection
    channel.close();
  } catch (error) {
    console.error('Error connecting to RabbitMQ for Test:', error);
    throw error;
  }
};

module.exports = {
  connectToRabbitMQ,
};
