'use strict';

const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const {
  BadRequest,
  Unauthorized,
  Forbidden,
  InternalServerError,
  NotFound,
} = require("commons/lib/middleware/errors");


class Server {
  constructor() {
    this.app = express();
    this.middleWares();
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

  errorHandlers() {
    // 에러 핸들러 등록
    this.app.use((err, req, res, next) => {
      if (err instanceof BadRequest) {
        res.status(err.code).send({ message: err.message, errors: err.data });
        return;
      } else if (err instanceof Unauthorized) {
        res.status(err.code).send({ message: err.message, errors: err.data });
        return;
      } else if (err instanceof Forbidden) {
        res.status(err.code).send({ message: err.message, errors: err.data });
        return;
      } else if (err instanceof InternalServerError) {
        res.status(err.code).send({ message: err.message, errors: err.data });
        return;
      } else if (err instanceof NotFound) {
        res.status(err.code).send();
        return;
      } else {
        console.error(err);
        res.status(500).send({ message: "INTERNAL_SERVER_ERROR" });
        return;
      }
    });
  }

  start(port, serviceName) {
    this.app.listen(port, () => {
      console.log(`${serviceName} is listening on port http://127.0.0.1:${port}`);
    });
  }
}

module.exports = Server;
