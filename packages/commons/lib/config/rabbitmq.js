const amqp = require('amqplib');

class RabbitMQ {
  constructor(channel) {
    this.channel = channel;
  }

  static async getInstance() {
    if (!RabbitMQ.instance) {
      const rabbitmqUrl = 'amqp://localhost'; // RabbitMQ 서버 URL
      const connection = await amqp.connect(rabbitmqUrl);
      const channel = await connection.createChannel();
      RabbitMQ.instance = new RabbitMQ(channel);
    }

    return RabbitMQ.instance;
  }

  async sendToQueue(queueName, queueMessage) {
    await this.channel.assertQueue(queueName); // 큐 선언
    this.channel.sendToQueue(queueName, Buffer.from(JSON.stringify(queueMessage)));
  }
}

module.exports = RabbitMQ;
