'use strict';

const Server = require('commons/lib/classes/server');
const authorizationRouter = require('./routes/authRoute');

class AuthServer {
  constructor() {
    this.server = new Server();
    this.server.addRouter('/api/auth/v1', authorizationRouter);
    this.server.errorHandlers();
    this.server.start(process.env.AUTH_SERVER_PORT, 'Auth Server');
  }
}

new AuthServer();
