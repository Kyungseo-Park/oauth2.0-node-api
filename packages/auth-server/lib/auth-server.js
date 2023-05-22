'use strict';

const Server = require('commons/lib/classes/server');
const authorizationRouter = require('./routes/authRoute');

class AuthServer {
  constructor() {
    this.server = Server();
    this.server.addRouter('/api/auth/v1', authorizationRouter);
    this.server.start(process.env.AUTH_SERVER_PORT);
  }
}

new AuthServer();
