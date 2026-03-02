// Basic consumer - processes messages from work queue
const amqp = require('amqplib');

const MAX_RETRIES = 3;

// Simulate notification service (fails sometimes)
function sendNotification(message) {
  const success = Math.random() > 0.4; // 60% success rate
  if (!success) {
    throw new Error('Notification service unavailable');
  }
  return true;
}

async function startConsumer() {
  try {
    const connection = await amqp.connect('amqp://localhost');
    const channel = await connection.createChannel();

    // Ensure queues exist
    await channel.assertExchange('main-exchange', 'direct', { durable: true });
    await channel.assertQueue('notification-queue', { durable: true });
    await channel.assertQueue('delay-queue', {
      durable: true,
      arguments: {
        'x-message-ttl': 5000,
        'x-dead-letter-exchange': 'main-exchange',
        'x-dead-letter-routing-key': 'notification'
      }
    });
    await channel.assertQueue('failed-queue', { durable: true }); // For final failures

    await channel.bindQueue('notification-queue', 'main-exchange', 'notification');

    channel.prefetch(1); // Process one message at a time

    // Consume from notification queue
    channel.consume('notification-queue', async (msg) => {
      if (!msg) return;

      const message = JSON.parse(msg.content.toString());
      const retryCount = message.retry || 0;

      console.log(`Processing message (attempt ${retryCount + 1}):`, message);

      try {
        // Try to send notification
        sendNotification(message);

        console.log('✅ SUCCESS: Notification sent!');
        channel.ack(msg);

      } catch (error) {
        console.log('❌ FAILED:', error.message);

        if (retryCount < MAX_RETRIES) {
          // Retry: send back to delay queue
          const retryMessage = { ...message, retry: retryCount + 1 };

          channel.sendToQueue('delay-queue', Buffer.from(JSON.stringify(retryMessage)), {
            persistent: true
          });

          console.log(`🔄 Retrying in 5 seconds (attempt ${retryCount + 2}/${MAX_RETRIES + 1})`);
        } else {
          // Max retries reached: send to failed queue
          const failedMessage = { ...message, retry: retryCount + 1, finalError: error.message };

          channel.sendToQueue('failed-queue', Buffer.from(JSON.stringify(failedMessage)), {
            persistent: true
          });

          console.log('💀 Max retries reached. Message sent to failed queue.');
        }

        channel.ack(msg);
      }
    });

    console.log('🚀 Consumer started. Waiting for messages...');
  } catch (error) {
    console.error('Consumer error:', error);
  }
}

startConsumer();