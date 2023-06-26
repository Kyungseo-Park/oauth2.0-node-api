const { awsConfig } = require('../config/aws');
const { SNS } = require("@aws-sdk/client-sns");

class SNSClient {
  constructor(snsTopicArn) {
    this.sns = new SNS(awsConfig);
    this.snsTopicArn = snsTopicArn;
  }

  static getInstance(snsTopicArn) {
    if (!SNSClient.instance) {
      SNSClient.instance = new SNSClient(snsTopicArn);
    }

    return SNSClient.instance;
  }

  sendSMS(emailData) {
    // 메일 발송
    const snsParams = {
      Message: JSON.stringify(emailData),
      TopicArn: this.snsTopicArn,
    };

    this.sns.publish(snsParams, (err, data) => {
      if (err) {
        console.error('Error sending email:', err);
      } else {
        console.log('Email sent:', data.MessageId);
      }
    });
  }
}

module.exports = SNSClient;
