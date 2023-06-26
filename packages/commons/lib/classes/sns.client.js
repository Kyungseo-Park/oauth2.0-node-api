const { awsConfig } = require('../config/aws');
const AWS = require('aws-sdk');

class SNS {
  constructor(snsTopicArn) {
    this.aws = AWS.config.update(awsConfig);
    this.sns = new AWS.SNS();
    this.snsTopicArn = snsTopicArn;
  }

  static getInstance(snsTopicArn) {
    if (!SNS.instance) {
      SNS.instance = new SNS(snsTopicArn);
    }

    return SNS.instance;
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

module.exports = SNS;
