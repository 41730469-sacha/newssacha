// Quick MySQL connection test
require('dotenv').config();
const mysql = require('mysql2');

console.log('Testing MySQL connection with:');
console.log('Host:', process.env.DB_HOST || 'localhost');
console.log('User:', process.env.DB_USER || 'root');
console.log('Password:', process.env.DB_PASSWORD ? '***' : '(empty)');
console.log('Database:', process.env.DB_NAME || 'pdf_db');
console.log('---');

const connection = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'pdf_db'
});

connection.connect((err) => {
    if (err) {
        console.error('❌ Connection FAILED:', err.message);
        console.error('Error Code:', err.code);
        console.error('---');
        console.log('Troubleshooting:');
        console.log('1. Make sure XAMPP MySQL is running');
        console.log('2. Check if password is correct (default is empty or "sacha123")');
        console.log('3. Try connecting to phpMyAdmin: http://localhost/phpmyadmin');
        process.exit(1);
    }
    
    console.log('✅ MySQL Connected Successfully!');
    console.log('Connection ID:', connection.threadId);
    
    connection.query('SHOW DATABASES', (err, results) => {
        if (err) {
            console.error('Error querying databases:', err);
        } else {
            console.log('\nAvailable Databases:');
            results.forEach(db => console.log(' -', db.Database));
        }
        connection.end();
    });
});
