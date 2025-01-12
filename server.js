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

  // Événement : un nouvel utilisateur choisit un pseudo
  socket.on('newUser', (username) => {
    users[socket.id] = username; // Associer le pseudo à l'ID du socket
    console.log(`${username} a rejoint le chat.`);
    
    // Notifier les autres utilisateurs qu'une nouvelle personne a rejoint le chat
    socket.broadcast.emit('userJoined', username);
  });

  // Événement : un utilisateur envoie un message
  socket.on('message', (data) => {
    console.log(`${data.username}: ${data.message}`);
    
    // Diffuser le message à tous les utilisateurs
    io.emit('message', data);
  });

  // Événement : un utilisateur se déconnecte
  socket.on('disconnect', () => {
    const username = users[socket.id]; // Récupérer le pseudo de l'utilisateur
    if (username) {
      console.log(`${username} s'est déconnecté.`);
      
      // Supprimer l'utilisateur de la liste des connectés
      delete users[socket.id];
      
      // Notifier les autres utilisateurs que cette personne a quitté le chat
      socket.broadcast.emit('userJoined', `${username} a quitté le chat.`);
    }
  });
});

// Configuration du port (Render utilise process.env.PORT, sinon 3000 par défaut)
const PORT = process.env.PORT || 3000;

// Démarrage du serveur
server.listen(PORT, () => {
  console.log(`Serveur lancé sur le port ${PORT}`);
});
