const mysql = require('mysql2/promise');

class UserRepository {
  constructor() {
    this.pool = mysql.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });
  }

  async createUser(username, password) {
    const conn = await this.pool.getConnection();

    try {
      const [result] = await conn.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, password]);
      return result.insertId;
    } catch (err) {
      console.error(err);
      throw err;
    } finally {
      conn.release();
    }
  }

  async findUserByUsername(username) {
    const conn = await this.pool.getConnection();

    try {
      const [rows] = await conn.query('SELECT * FROM users WHERE username = ?', [username]);
      if (rows.length === 0) {
        return null;
      }
      return rows[0];
    } catch (err) {
      console.error(err);
      throw err;
    } finally {
      conn.release();
    }
  }

  async findUserById(userId) {
    const conn = await this.pool.getConnection();
    
    try {
      const [rows] = await conn.query('SELECT * FROM users WHERE id = ?', [userId]);
      if (rows.length === 0) {
        return null;
      }
      return rows[0];
    } catch (err) {
      console.error(err);
      throw err;
    } finally {
      conn.release();
    }
  }
}

module.exports = new UserRepository();
