'use strict';

const Server = require('commons/lib/classes/server');
const resourceRouter = require('./routes/resourceRoute');

class ResourceServer {
  constructor() {
    this.server = Server();
    this.server.addRouter('/api/resource/v1', resourceRouter);
    this.server.start(process.env.RESOURCE_SERVER_PORT);
  }
}

new ResourceServer();
