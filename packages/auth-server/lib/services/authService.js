const argon2 = require('argon2');
const { BadRequest } = require('commons/lib/middleware/errors');
const RabbitMQ = require('commons/lib/classes/rabbitmq.client');
const AuthRepository = require('../repositories/authRepository');

class AuthService {
  constructor() {
    this.authRepository = AuthRepository.getInstance();
    this.rabbitMQ = RabbitMQ.getInstance();
  }

  getInstance() {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }

    return AuthService.instance;
  }

  async sendMailToQueue(userId, email) {
    try {
      const queueName = 'email_queue';
      const queueMessage = {
        userId,
        email,
      };

      const messageBuffer = Buffer.from(JSON.stringify(queueMessage));

      await this.rabbitMQ.sendToQueue(queueName, messageBuffer);
    } catch (error) {
      console.error('Error occurred during example usage:', error);
    }
  }

  async validatorByEmail(email) {
    const result = await this.authRepository.findByEmail(email);
    if (result && result.rowCount > 0) {
      throw new BadRequest({ email: 'exists' });
    }
  }

  async signup(params) {
    const { email, password, first_name, middle_name, last_name } = params;

    await this.validatorByEmail(email);
    const hashedPassword = await argon2.hash(password);

    const user = {
      email,
      password: hashedPassword,
      first_name,
      middle_name,
      last_name,
    };

    return this.authRepository.signup(user);
  }
}

module.exports = new AuthService();
