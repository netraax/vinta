const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || 'vintedpro',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Test de connexion
pool.getConnection()
    .then(connection => {
        console.log('✅ Connecté à MySQL!');
        connection.release();
    })
    .catch(err => {
        console.error('❌ Erreur de connexion MySQL:', err);
    });

module.exports = pool;
