require('dotenv').config();

const rabbitMqConfig = {
    username: process.env.RABBIT_MQ_USERNAME,
    password: process.env.RABBIT_MQ_PASSWORD
}

module.exports = {rabbitMqConfig};
