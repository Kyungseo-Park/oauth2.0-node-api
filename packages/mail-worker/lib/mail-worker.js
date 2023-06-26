const SNSClient = require('commons/lib/classes/sns.client');
const RabbitMQ = require('commons/lib/classes/rabbitmq.client');

class MailWorker {
  constructor(snsTopicArn) {
    this.sns = SNSClient.getInstance(snsTopicArn);
    this.rabbitMQ = RabbitMQ.getInstance();
  }

  async sendEmailFromQueue() {
    console.log("Starring email worker...");
    try {
      // 커넥션
      await this.rabbitMQ.connect();

      // 큐 선언
      await this.rabbitMQ.channel.assertQueue('email_queue')
      
      // 큐 메시지 개수 확인
      const { messageCount } = await this.rabbitMQ.channel.checkQueue('email_queue');
      
      if (messageCount > 0) {
        const { content } = await this.rabbitMQ.channel.get('email_queue');
        const emailData = JSON.parse(content.toString());

        this.sns.sendSMS(emailData);

        // 큐 메시지 삭제
        await this.rabbitMQ.channel.ack('email_queue');
        console.log('Email worker finished.');
      } else {
        console.log('No email messages in the queue.');
      }
      await this.rabbitMQ.channel.close();
    } catch (error) {
      console.error('Error:', error);
    }
  }
}

const snsTopicArn = 'AWS_SNS_TOPIC_ARN';

const mailWorker = new MailWorker(snsTopicArn);
mailWorker.sendEmailFromQueue().catch(console.error);
