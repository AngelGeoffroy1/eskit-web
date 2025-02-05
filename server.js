const express = require('express');
const path = require('path');
const nodemailer = require('nodemailer');
const { body, validationResult } = require('express-validator');
const app = express();
const port = 3000;

// Middleware pour parser le JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir les fichiers statiques (css, js, images dans assets)
app.use(express.static(__dirname));

// Configuration du transporteur d'emails
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'bob@bobsarl.com',
        pass: 'ggws xhnw fzkq jrlc'
    }
});

// Validation du formulaire
const validateContact = [
    body('name').trim().notEmpty().withMessage('Le nom est requis'),
    body('email').isEmail().withMessage('Email invalide'),
    body('message').trim().notEmpty().withMessage('Le message est requis')
];

// Route pour gérer l'envoi d'email
app.post('/send-email', validateContact, async (req, res) => {
    // Vérifier les erreurs de validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, message } = req.body;

    // Configuration de l'email
    const mailOptions = {
        from: email,
        to: 'bob@bobsarl.com', // Email de réception
        subject: `Nouveau message de ${name} via Arkitek`,
        text: `
            Nom: ${name}
            Email: ${email}
            Message: ${message}
        `
    };

    try {
        // Envoyer l'email
        await transporter.sendMail(mailOptions);
        res.json({ success: true, message: 'Email envoyé avec succès' });
    } catch (error) {
        console.error('Erreur lors de l\'envoi de l\'email:', error);
        res.status(500).json({ success: false, message: 'Erreur lors de l\'envoi de l\'email' });
    }
});

// Route principale
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Démarrer le serveur
app.listen(port, () => {
    console.log(`Le serveur est démarré sur http://localhost:${port}`);
}); 