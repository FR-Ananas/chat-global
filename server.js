const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static('public'));  // Sert les fichiers statiques

const users = {};

io.on('connection', (socket) => {
  // Ajout d'un nouvel utilisateur
  socket.on('newUser', (username) => {
    users[socket.id] = { username, status: 'connected' };
    socket.broadcast.emit('userNotification', `${username} a rejoint le chat.`);
    io.emit('updateUsers', Object.values(users));  // Simplification: on envoie directement la liste des utilisateurs
  });

  // Réception d'un message
  socket.on('message', ({ message }) => {
    const username = users[socket.id]?.username || 'Anonyme';
    if (message?.trim()) {
      io.emit('message', { username, message });  // Envoi du message
    } else {
      socket.emit('message', { username: 'Serveur', message: 'Message invalide.' });  // Message invalide
    }
  });

  // Gestion de la déconnexion
  socket.on('disconnect', () => {
    const user = users[socket.id];
    if (user) {
      delete users[socket.id];  // Suppression de l'utilisateur
      io.emit('userNotification', `${user.username} a quitté le chat.`);
      io.emit('updateUsers', Object.values(users));  // Mise à jour de la liste des utilisateurs
    }
  });
});

// Lancement du serveur
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Serveur lancé sur le port ${PORT}`));
