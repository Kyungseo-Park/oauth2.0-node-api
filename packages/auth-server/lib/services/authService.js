const argon2 = require('argon2');
const { BadRequest } = require('commons/lib/middleware/errors');
const RabbitMQ = require('commons/lib/config/rabbitmq');
const AuthRepository = require('../repositories/authRepository');


class AuthService {
    constructor() {
      this.authRepository = AuthRepository.getInstance();
      this.rabbitmq = RabbitMQ.getInstance();
    }

    getInstance() {
        if (!AuthService.instance) {
            AuthService.instance = new AuthService();
        }

        return AuthService.instance;
    }

    async sendMailToQueue() {
        const queueName = 'email_queue'; // 큐 이름

        const queueMessage = {
          userId: user.id,
          email: user.email,
        };

        this.rabbitmq.sendToQueue(queueName, Buffer.from(JSON.stringify(queueMessage)));
    }

    async validatorByEmail(email) {
        const result = await this.authRepository.findByEmail(email);
        if (result.rowCount > 0) {
            throw new BadRequest({email: 'exists'});
        }
    }

    async signup(params) {
        // NOTE: 이미 존재하는지 이메일인지 검사는 사용자 이메일의 유출에 대한 문제로 인해 생략 
        await this.validatorByEmail(params.email);
        params.password = await argon2.hash(params.password);

        return this.authRepository.signup(params);
    }
}

module.exports = new AuthService();
