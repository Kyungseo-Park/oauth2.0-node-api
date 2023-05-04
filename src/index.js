const express = require('express');
const morgan = require('morgan');
const authorizationRouter = require('./routes/authRoute');

class App {
  constructor() {
    this.apiServer = express();
    this.authServer = express();
    this.middleWares();
    this.routes();
    this.errorHandlers();
  }

  middleWares() {
    this.apiServer.use(express.json());
    this.apiServer.use(morgan('dev'));
  }

  routes() {
    this.apiServer.use('authorization', authorizationRouter);
    this.authServer.use('authorization', authorizationRouter);
  }

  errorHandlers() {
    this.apiServer.use((err, req, res, next) => {
      console.error(err.stack);
      res.status(500).send('Something broke!');
    });
  }

  start(apiPort, authPort) {
    this.apiServer.listen(apiPort, () => {
      console.log(`Server is listening on port ${apiPort}`);
    });

    this.authServer.listen(authPort, () => {
      console.log(`Server is listening on port ${port}`);
    });
  }
}

const app = new App();

app.start(3000, 3001);