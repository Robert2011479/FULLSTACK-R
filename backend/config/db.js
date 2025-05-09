//config/db.js
const { Pool } = require('pg');

class Database {
    constructor() {
        this.pool = new Pool({
            user: 'postgres',
            host: 'localhost',
            database: 'novasalud',
            password: 'admin123',
            port: 5432,
        });

        this.pool.on('error', (err) => {
            console.error('Unexpected error on idle client', err);
            process.exit(-1);
        });
    }

    async query(text, params) {
        try {
            const res = await this.pool.query(text, params);
            return res;
        } catch (err) {
            console.error('Error executing query', { text, params, err });
            throw err;
        }
    }
}

module.exports = new Database();