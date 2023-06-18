const { sql } = require('slonik');
const { authDbConfig } = require('commons/lib/config/database'); 

const Database = require('commons/lib/classes/pg.client');


class AuthRepository {
    constructor() {
        this.pg = new Database(authDbConfig);
    }

    getInstance() {
        if (!AuthRepository.instance) {
            AuthRepository.instance = new AuthRepository();
        }

        return AuthRepository.instance;
    }

    findByEmail(email) {
        const query = sql.type('id')`
            SELECT id
            FROM oauth_users
            WHERE email = ${email}
        `;

        return this.pg.query(query);
    }

    async signup(params) {
        const { email, password, first_name, middle_name, last_name } = params;

        const keys = [];
        const values = [];
        
        if (email) {
            keys.push(sql.identifier(['email']));
            values.push(email);
        }

        if (password) {
            keys.push(sql.identifier(['password']));
            values.push(password);
        }

        if (first_name) {
            keys.push(sql.identifier(['first_name']));
            values.push(first_name);
        }

        if (middle_name) {
            keys.push(sql.identifier(['middle_name']));
            values.push(middle_name);
        }

        if (last_name) {
            keys.push(sql.identifier(['last_name']));
            values.push(last_name);
        }

        const query = sql.type('id')`
            INSERT INTO oauth_users (${sql.join(keys, `, `)})
            VALUES (${sql.join(values.map(value => `${value}`), `, `)})
            RETURNING id, email
        `;

        const result = await this.pg.query(query);
        if (result.rowCount === 0) {
            throw new Error('Failed to signup');
        }

        return result.rows[0];
    }
}

module.exports = new AuthRepository();
