'use strict';

const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');

const authorizationRouter = require('./routes/authRoute');

class AuthServer {
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

    routes() {
        this.app.use('/api/auth/v1', authorizationRouter);
    }

    errorHandlers() {
        this.app.use((err, req, res, next) => {
            console.error(err.stack);
            res.status(500).send('Something broke!');
        });
    }

    start() {
        const port = process.env.AUTH_SERVER_PORT;

        this.app.listen(port, () => {
            console.log(`Server is listening on port ${port}`);
        });
    }
}

module.exports = new AuthServer()
