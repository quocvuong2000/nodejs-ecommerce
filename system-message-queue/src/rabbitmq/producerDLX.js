// Producer specifically for Dead Letter Exchange examples
const amqp = require('amqplib');

async function setupDLXExample() {
  try {
    const connection = await amqp.connect('amqp://localhost');
    const channel = await connection.createChannel();

    // Main processing exchange
    await channel.assertExchange('processing-exchange', 'direct', { durable: true });

    // Dead letter exchange for failed messages
    await channel.assertExchange('dlx-exchange', 'direct', { durable: true });

    // Work queue with DLX configuration
    await channel.assertQueue('work-with-dlx', {
      durable: true,
      arguments: {
        'x-dead-letter-exchange': 'dlx-exchange',
        'x-dead-letter-routing-key': 'failed'
      }
    });

    // Dead letter queue
    await channel.assertQueue('dead-letter-queue', { durable: true });

    // Retry queue with TTL
    await channel.assertQueue('retry-queue', {
      durable: true,
      arguments: {
        'x-message-ttl': 10000, // 10 seconds
        'x-dead-letter-exchange': 'processing-exchange',
        'x-dead-letter-routing-key': 'work'
      }
    });

    // Bind queues
    await channel.bindQueue('work-with-dlx', 'processing-exchange', 'work');
    await channel.bindQueue('dead-letter-queue', 'dlx-exchange', 'failed');

    // Send test message
    const message = {
      id: Date.now(),
      type: 'critical-notification',
      payload: { userId: 456, action: 'account-suspended' },
      retry: 0,
      maxRetries: 2
    };

    channel.publish('processing-exchange', 'work', Buffer.from(JSON.stringify(message)), {
      persistent: true
    });

    console.log('DLX test message sent:', message);
    console.log('Message flow:');
    console.log('1. processing-exchange → work-with-dlx');
    console.log('2. If processing fails → dlx-exchange → dead-letter-queue');
    console.log('3. Or if retry needed → retry-queue (wait 10s) → back to work-with-dlx');

    setTimeout(() => connection.close(), 1000);
  } catch (error) {
    console.error('DLX setup error:', error);
  }
}

setupDLXExample();