// Check current database passwords
require('dotenv').config();
const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'pdf_db'
});

connection.connect((err) => {
    if (err) {
        console.error('❌ Connection FAILED:', err.message);
        process.exit(1);
    }
    
    console.log('✅ MySQL Connected\n');
    
    const sql = 'SELECT id, email, password, first_name FROM users LIMIT 5';
    
    connection.query(sql, (err, results) => {
        if (err) {
            console.error('❌ Error:', err.message);
        } else {
            console.log('📊 Users in Database:\n');
            results.forEach(user => {
                const isHashed = user.password.startsWith('$2');
                console.log(`${user.first_name} (${user.email})`);
                console.log(`  Password: ${user.password}`);
                console.log(`  Type: ${isHashed ? '🔒 HASHED' : '📝 PLAIN TEXT'}\n`);
            });
        }
        connection.end();
    });
});
