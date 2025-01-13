const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static('public')); // Serve les fichiers statiques depuis le dossier "public"

// Gérer la connexion des clients
io.on('connection', (socket) => {
    console.log('Un utilisateur est connecté');
    
    // Gérer un nouvel utilisateur
    socket.on('new user', (username) => {
        socket.username = username;
        io.emit('chat message', `${username} a rejoint le chat.`);
    });
    
    // Gérer l'envoi de messages
    socket.on('chat message', (msg) => {
        io.emit('chat message', `${socket.username}: ${msg}`);
    });

    // Gérer la déconnexion d'un utilisateur
    socket.on('disconnect', () => {
        if (socket.username) {
            io.emit('chat message', `${socket.username} a quitté le chat.`);
        }
    });
});

// Démarrer le serveur
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
});
