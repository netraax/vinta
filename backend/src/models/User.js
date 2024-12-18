// Ce fichier sera utilisé quand MySQL sera configuré
const pool = require('../config/database');
const bcrypt = require('bcrypt');

class User {
    static async createTable() {
        const sql = `
            CREATE TABLE IF NOT EXISTS users (
                id INT PRIMARY KEY AUTO_INCREMENT,
                username VARCHAR(255) UNIQUE NOT NULL,
                email VARCHAR(255) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        `;
        try {
            await pool.query(sql);
            console.log('✅ Table users créée ou déjà existante');
        } catch (error) {
            console.error('❌ Erreur création table users:', error);
            throw error;
        }
    }

    static async create(userData) {
        const { username, email, password } = userData;
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const sql = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
        try {
            const [result] = await pool.query(sql, [username, email, hashedPassword]);
            return result.insertId;
        } catch (error) {
            if (error.code === 'ER_DUP_ENTRY') {
                throw new Error('Username ou email déjà utilisé');
            }
            throw error;
        }
    }

    static async findByEmail(email) {
        const sql = 'SELECT * FROM users WHERE email = ?';
        const [rows] = await pool.query(sql, [email]);
        return rows[0];
    }

    static async verifyPassword(plainPassword, hashedPassword) {
        return await bcrypt.compare(plainPassword, hashedPassword);
    }
}

module.exports = User;
