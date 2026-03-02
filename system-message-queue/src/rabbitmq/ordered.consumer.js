// Consumer that processes messages in order
const amqp = require('amqplib');

async function startOrderedConsumer() {
  try {
    const connection = await amqp.connect('amqp://localhost');
    const channel = await connection.createChannel();

    await channel.assertExchange('ordered-exchange', 'direct', { durable: true });
    await channel.assertQueue('ordered-notification-queue', {
      durable: true,
      arguments: {
        'x-single-active-consumer': true
      }
    });

    await channel.bindQueue('ordered-notification-queue', 'ordered-exchange', 'ordered');

    channel.prefetch(1); // Important: process one at a time for ordering

    channel.consume('ordered-notification-queue', async (msg) => {
      if (!msg) return;

      const message = JSON.parse(msg.content.toString());

      console.log(`🔄 Processing ordered message:`, message);

      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 1000));

      console.log(`✅ Completed processing:`, message);

      channel.ack(msg);
    });

    console.log('🚀 Ordered consumer started. Processing messages in sequence...');
  } catch (error) {
    console.error('Ordered consumer error:', error);
  }
}

startOrderedConsumer();