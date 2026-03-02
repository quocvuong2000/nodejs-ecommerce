// Basic producer - sends initial messages
const amqp = require('amqplib');

async function sendMessage() {
  try {
    const connection = await amqp.connect('amqp://localhost');
    const channel = await connection.createChannel();

    // Create exchanges
    await channel.assertExchange('main-exchange', 'direct', { durable: true });

    // Create work queue
    await channel.assertQueue('notification-queue', { durable: true });

    // Create delay queue with TTL and dead letter settings
    await channel.assertQueue('delay-queue', {
      durable: true,
      arguments: {
        'x-message-ttl': 5000, // 5 seconds delay
        'x-dead-letter-exchange': 'main-exchange',
        'x-dead-letter-routing-key': 'notification'
      }
    });

    // Bind work queue to exchange
    await channel.bindQueue('notification-queue', 'main-exchange', 'notification');

    // Send message
    const message = {
      id: Date.now(),
      type: 'new-product',
      userId: 123,
      data: { productName: 'iPhone 15', price: 999 },
      retry: 0
    };

    channel.sendToQueue('delay-queue', Buffer.from(JSON.stringify(message)), {
      persistent: true
    });

    console.log('Message sent to delay queue:', message);

    setTimeout(() => connection.close(), 1000);
  } catch (error) {
    console.error('Error:', error);
  }
}

sendMessage();