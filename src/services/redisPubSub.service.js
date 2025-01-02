const Redis = require("redis");

class RedisPubSubService {
  constructor() {
    this.client = Redis.createClient(); // Use a single client instance
    this.publisher = this.client.duplicate();
    this.subscriber = this.client.duplicate();
  }

  async connect() {
    await this.publisher.connect();
    await this.subscriber.connect();
  }

  async publish(channel, message) {
    try {
      await this.publisher.publish(channel, message);
      return true;
    } catch (err) {
      throw err;
    }
  }

  async subscribe(channel, callback) {
    await this.subscriber.subscribe(channel, callback);
  }
}

module.exports = new RedisPubSubService();