const amqp = require('amqplib');
const { rabbitMqConfig } = require('../config/rabbitmq');


class RabbitMQ {
  constructor(url) {
    this.url = url;
    this.connection = null;
    this.channel = null;
  }

  static getInstance() {
    if (!RabbitMQ.instance) {
      RabbitMQ.instance = new RabbitMQ(`amqp://${rabbitMqConfig.username}:${rabbitMqConfig.password}@localhost`);
    }

    return RabbitMQ.instance;
  }

  async connect() {
    try {
      // RabbitMQ 서버에 연결
      this.connection = await amqp.connect(this.url);
    
      // 채널 생성
      this.channel = await this.connection.createChannel();
    } catch (error) {
      console.error('Error connecting to RabbitMQ:', error);
      throw error;
    }
  }

  async sendToQueue(queueName, message) {
    try {
      await this.connect();
      // 큐 선언
      await this.channel.assertQueue(queueName);
      // 메시지 전송
      this.channel.sendToQueue(queueName, Buffer.from(message));
    } catch (error) {
      throw error;
    }finally {
      await this.close();
    }
  }

  async close() {
    try {
      // 연결과 채널 닫기
      if (this.channel) {
        await this.channel.close();
        this.channel = null;
      }
  
      if (this.connection) {
        await this.connection.close();
        this.connection = null;
      }
  
      console.log('RabbitMQ connection closed.');
    } catch (error) {
      console.error('Error closing to RabbitMQ:', error);
      throw error;
    }
  }
}

module.exports = RabbitMQ;
