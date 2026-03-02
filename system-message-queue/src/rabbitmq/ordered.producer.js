// Producer that maintains message order
const amqp = require('amqplib');

async function sendOrderedMessages() {
  try {
    const connection = await amqp.connect('amqp://localhost');
    const channel = await connection.createChannel();

    // Create exchange for ordered processing
    await channel.assertExchange('ordered-exchange', 'direct', { durable: true });

    // Create ordered queue (single consumer to maintain order)
    await channel.assertQueue('ordered-notification-queue', {
      durable: true,
      arguments: {
        'x-single-active-consumer': true // Ensures only one consumer at a time
      }
    });

    await channel.bindQueue('ordered-notification-queue', 'ordered-exchange', 'ordered');

    // Send multiple ordered messages
    const messages = [
      { id: 1, step: 'user-registered', userId: 123 },
      { id: 2, step: 'email-verified', userId: 123 },
      { id: 3, step: 'profile-completed', userId: 123 },
      { id: 4, step: 'first-purchase', userId: 123 }
    ];

    for (let i = 0; i < messages.length; i++) {
      const message = messages[i];

      channel.publish('ordered-exchange', 'ordered', Buffer.from(JSON.stringify(message)), {
        persistent: true,
        messageId: message.id.toString()
      });

      console.log(`Sent ordered message ${i + 1}:`, message);

      // Small delay to demonstrate ordering
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    setTimeout(() => connection.close(), 1000);
  } catch (error) {
    console.error('Error:', error);
  }
}

sendOrderedMessages();