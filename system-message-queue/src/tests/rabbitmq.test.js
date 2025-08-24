'use strict'

const { connectToRabbitMQforTest } = require('../dbs/init.rabbit');

describe('first', () => {
  it('should connect to RabbitMQ and send a test message', async () => {
   const result = await connectToRabbitMQforTest();
   expect(result).toBeDefined();
  });
});