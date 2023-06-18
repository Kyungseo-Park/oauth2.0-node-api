const { createPool } = require('slonik');

class Database {
  constructor(config) {
    const { username, password, host, port, database } = config;
    const connectionString = `postgres://${username}:${password}@${host}:${port}/${database}`;

    this.createConnectionPool(connectionString);
    this.isClosing = false;

    process.on('exit', () => {
        console.log("Process is exiting");
        this.close();
    });

    process.on('SIGINT', () => {
        this.close();
        console.log("SIGINT received");
        process.exit(1);
    });
  }

  async createConnectionPool(connectionString) {
    this.pool = await createPool(connectionString);
  }


  async query(sql, values) {
    return await this.pool.query(sql, values);
  }

  async close() {
    if (!this.isClosing) {
      this.isClosing = true;
      await this.pool.end();
    }
  }
}

module.exports = Database;
