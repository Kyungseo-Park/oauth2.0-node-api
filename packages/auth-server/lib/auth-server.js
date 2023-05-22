'use strict';

const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const mysql = require('mysql2');

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
        this.app.post('/client', async (req, res) => {
            const { redirect_uris } = req.body;
            const clientId = crypto.randomBytes(16).toString('hex');
            const clientSecret = crypto.randomBytes(16).toString('hex');
            const id = uuid.v4();
            try {
            await this.pool.query('INSERT INTO clients (id, client_id, client_secret, redirect_uris) VALUES (?, ?, ?, ?)');
            res.json({ id, clientId, clientSecret, redirect_uris });   
            } catch (error) {
            console.error(err);
            res.status(500).json({ error: 'server_error' });
            }
        });
    }

    errorHandlers() {
        this.app.use((err, req, res, next) => {
            console.error(err.stack);
            res.status(500).send('Something broke!');
        });
    }

    start() {
        this.app.listen(process.env.AUTH_SERVER_PORT, () => {
            console.log(`Server is listening on port ${port}`);
        });
    }
}

module.exports = new AuthServer()
