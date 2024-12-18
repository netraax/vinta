const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Configuration
dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./src/routes/auth'));
app.use('/api', require('./src/routes/api'));

// Port
const PORT = process.env.PORT || 3000;

// Démarrage serveur
app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
});
