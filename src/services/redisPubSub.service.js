const Redis = require("redis");

class RedisPubSubService {
  constructor() {
    this.client = Redis.createClient();
    this.publisher = this.client.duplicate();
    this.subscriber = this.client.duplicate();
  }

  async init() {
    await this.client.connect();
    await this.publisher.connect();
    await this.subscriber.connect();
  }


  async publish(channel, message) {
    try {
      await this.publisher.publish(channel, message);
      return true;
    } catch (err) {
      console.error('Publish failed:', err);
      throw err;
    }
  }

  async subscribe(channel, callback) {
    try {
      await this.subscriber.subscribe(channel, (message) => {
        console.log(`Received message on ${channel}: ${message}`);
        callback(message);
      });
    } catch (err) {
      console.error('Subscribe failed:', err);
      throw err;
    }
  }
}

module.exports = new RedisPubSubService();
