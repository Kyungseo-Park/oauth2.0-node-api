require('dotenv').config();

const authDbConfig = {
    host: process.env.AUTH_DATABASE_HOST,
    port: process.env.AUTH_DATABASE_PORT,
    username: process.env.AUTH_DATABASE_USER,
    database: process.env.AUTH_DATABASE_NAME,
    password: process.env.AUTH_DATABASE_PASSWORD,
}

module.exports = {authDbConfig};
