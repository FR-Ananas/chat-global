// Import des modules nécessaires
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

// Initialisation des applications Express et HTTP
const app = express();
const server = http.createServer(app);

// Initialisation de Socket.IO
const io = new Server(server);

// Configuration pour servir les fichiers statiques (HTML, CSS, JS)
app.use(express.static('public'));

// Stockage des utilisateurs connectés
const users = {};

// Gestion des connexions Socket.IO
io.on('connection', (socket) => {
  console.log('Un utilisateur est connecté.');

  // Envoyer la liste des utilisateurs connectés au nouvel utilisateur
  socket.emit('userList', users);

  // Événement : un nouvel utilisateur choisit un pseudo
  socket.on('newUser', (username) => {
    users[socket.id] = { username, status: 'connected' }; // Associer le pseudo à l'ID du socket
    console.log(`${username} a rejoint le chat.`);

    // Informer tous les utilisateurs de la nouvelle connexion
    io.emit('userJoined', { id: socket.id, username });
  });

  // Événement : un utilisateur envoie un message
  socket.on('message', (data) => {
    const username = users[socket.id]?.username;
    if (username) {
      console.log(`${username}: ${data.message}`);
      io.emit('message', { username, message: data.message });
    }
  });

  // Événement : un utilisateur se déconnecte
  socket.on('disconnect', () => {
    const username = users[socket.id]?.username;
    if (username) {
      console.log(`${username} s'est déconnecté.`);
      io.emit('userLeft', { id: socket.id, username });
      users[socket.id].status = 'disconnected';

      // Supprimer l'utilisateur de la liste après un délai (pour effet visuel côté client)
      setTimeout(() => {
        delete users[socket.id];
      }, 3000);
    }
  });
});

// Configuration du port (Render utilise process.env.PORT, sinon 3000 par défaut)
const PORT = process.env.PORT || 3000;

// Démarrage du serveur
server.listen(PORT, () => {
  console.log(`Serveur lancé sur le port ${PORT}`);
});
