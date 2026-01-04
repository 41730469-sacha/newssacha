// Check current database passwords (PostgreSQL version)
require('dotenv').config();
const { Pool } = require('pg');

// Create a PostgreSQL pool connection
const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'sacha_news',
    port: process.env.DB_PORT || 5432
});

(async () => {
    try {
        // Test connection
        const client = await pool.connect();
        console.log('✅ PostgreSQL Connected\n');

        // Query first 5 users
        const res = await client.query('SELECT id, email, password, first_name FROM users LIMIT 5');

        console.log('📊 Users in Database:\n');
        res.rows.forEach(user => {
            const isHashed = user.password.startsWith('$2'); // assuming bcrypt hashes
            console.log(`${user.first_name} (${user.email})`);
            console.log(`  Password: ${user.password}`);
            console.log(`  Type: ${isHashed ? '🔒 HASHED' : '📝 PLAIN TEXT'}\n`);
        });

        client.release();
    } catch (err) {
        console.error('❌ Connection FAILED:', err.message);
        process.exit(1);
    } finally {
        await pool.end();
    }
})();
