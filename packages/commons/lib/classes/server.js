'use strict';

const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');

class Server {
  constructor() {
    this.app = express();
    this.middleWares();
    this.routes();
    this.errorHandlers();
  }

  middleWares() {
    this.app.use(express.json());
    this.app.use(cookieParser());
    this.app.use(express.urlencoded({ extended: false }));
    this.app.use(morgan('dev'));
  }

  addRouter(path, router) {
    this.app.use(path, router);
  }
  // routes(routers = []) {
  //   routers.forEach(router => {
  //       this.app.use(router.path, router.router);
  //   });
  // }

  errorHandlers() {
    this.app.use((err, req, res, next) => {
      console.error(err.stack);
      res.status(500).send('Something broke!');
    });
  }

  start(port, serviceName) {
    this.app.listen(port, () => {
      console.log(`${serviceName} is listening on port ${port}`);
    });
  }
}

module.exports = Server;
