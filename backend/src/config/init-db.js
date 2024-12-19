const mysql = require('mysql2/promise');
require('dotenv').config();

async function initializeDatabase() {
    // Créer une connexion sans sélectionner de base de données
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD
    });

    try {
        // Créer la base de données si elle n'existe pas
        await connection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`);
        console.log(`✅ Base de données ${process.env.DB_NAME} créée ou déjà existante`);

        // Utiliser la base de données
        await connection.query(`USE ${process.env.DB_NAME}`);

        // Créer la table users si elle n'existe pas
        await connection.query(`
            CREATE TABLE IF NOT EXISTS users (
                id INT PRIMARY KEY AUTO_INCREMENT,
                username VARCHAR(255) UNIQUE NOT NULL,
                email VARCHAR(255) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                subscription ENUM('standard', 'premium') DEFAULT 'standard',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        `);
        console.log('✅ Table users créée ou déjà existante');

    } catch (error) {
        console.error('❌ Erreur lors de l\'initialisation de la base de données:', error);
    } finally {
        await connection.end();
    }
}

// Exécuter l'initialisation
initializeDatabase().then(() => {
    console.log('✅ Initialisation de la base de données terminée');
    process.exit(0);
}).catch(error => {
    console.error('❌ Erreur:', error);
    process.exit(1);
});
