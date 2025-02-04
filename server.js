const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

// Servir les fichiers statiques (css, js, images dans assets)
app.use(express.static(__dirname));

// Route principale
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Démarrer le serveur
app.listen(port, () => {
    console.log(`Le serveur est démarré sur http://localhost:${port}`);
}); 