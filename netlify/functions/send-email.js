const nodemailer = require('nodemailer');

exports.handler = async function(event, context) {
    // Configuration des headers CORS
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
    };

    // Gestion de la requête OPTIONS (pre-flight)
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers
        };
    }

    // Vérification de la méthode HTTP
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            headers,
            body: JSON.stringify({ message: 'Méthode non autorisée' })
        };
    }

    try {
        const data = JSON.parse(event.body);
        
        // Vérification des variables d'environnement
        if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
            throw new Error('Configuration SMTP manquante');
        }

        // Configuration du transporteur email pour Gmail
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS
            },
            tls: {
                rejectUnauthorized: false
            }
        });

        // Configuration de l'email avec réponse automatique
        const mailOptions = {
            from: `"Arkitek Contact" <${process.env.SMTP_USER}>`,
            to: data.to,
            replyTo: data.email,
            subject: `Nouveau message de ${data.name}`,
            text: `
Nom: ${data.name}
Email: ${data.email}
Message: ${data.message}
            `,
            html: `
<h3>Nouveau message de contact</h3>
<p><strong>Nom:</strong> ${data.name}</p>
<p><strong>Email:</strong> ${data.email}</p>
<p><strong>Message:</strong></p>
<p>${data.message}</p>
            `
        };

        // Email de confirmation à l'expéditeur
        const confirmationMailOptions = {
            from: `"Arkitek" <${process.env.SMTP_USER}>`,
            to: data.email,
            subject: 'Confirmation de réception de votre message',
            text: `
Bonjour ${data.name},

Nous avons bien reçu votre message et nous vous en remercions.
Nous vous répondrons dans les plus brefs délais.

Cordialement,
L'équipe Arkitek
            `,
            html: `
<h3>Confirmation de réception</h3>
<p>Bonjour ${data.name},</p>
<p>Nous avons bien reçu votre message et nous vous en remercions.</p>
<p>Nous vous répondrons dans les plus brefs délais.</p>
<p>Cordialement,<br>L'équipe Arkitek</p>
            `
        };

        // Envoi des emails
        await transporter.sendMail(mailOptions);
        await transporter.sendMail(confirmationMailOptions);

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ message: 'Email envoyé avec succès' })
        };
    } catch (error) {
        console.error('Erreur:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ 
                message: 'Erreur lors de l\'envoi de l\'email', 
                error: error.message 
            })
        };
    }
}; 