const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');  // Utilisation de path pour les chemins

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

let users = [];

// Servir les fichiers statiques à partir du dossier public
app.use(express.static(path.join(__dirname, 'public')));  // Le dossier 'public' contient index.html, chat.html, etc.

// Gestion des connexions des utilisateurs
io.on('connection', (socket) => {
  console.log('Un utilisateur est connecté');
  
  // Écoute des nouveaux utilisateurs
  socket.on('newUser', (username) => {
    users.push(username);
    io.emit('userList', users);  // Mise à jour de la liste des utilisateurs
  });

  // Écoute des messages
  socket.on('message', (data) => {
    io.emit('message', data);  // Diffuser les messages à tous les utilisateurs
  });

  // Écoute de la déconnexion
  socket.on('disconnectUser', (username) => {
    users = users.filter(user => user !== username);
    io.emit('userList', users);  // Mise à jour de la liste des utilisateurs après déconnexion
  });

  // Lorsque l'utilisateur se déconnecte (fermeture de la session)
  socket.on('disconnect', () => {
    console.log('Un utilisateur est déconnecté');
  });
});

// Démarre le serveur sur le port 3000
server.listen(3000, () => {
  console.log('Serveur démarré sur le port 3000');
});
