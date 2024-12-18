class ErrorHandler {
    static handle(err, req, res, next) {
        console.error(err.stack);
        
        if (err.name === 'UnauthorizedError') {
            return res.status(401).json({ error: "Non autorisé" });
        }
        
        if (err.name === 'ValidationError') {
            return res.status(400).json({ error: err.message });
        }
        
        res.status(500).json({ error: "Erreur serveur" });
    }
}

module.exports = ErrorHandler;
