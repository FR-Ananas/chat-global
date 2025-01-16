const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static('public')); // Sert les fichiers statiques

const users = {};

io.on('connection', (socket) => {
  console.log(`Nouvelle connexion : ${socket.id}`);

  // Ajout d'un nouvel utilisateur
  socket.on('newUser', (username) => {
    if (!username || username.length > 15) {
      return socket.emit('message', { username: 'Serveur', message: 'Pseudo invalide.' });
    }
    const isUsernameTaken = Object.values(users).some(user => user.username === username);
    if (isUsernameTaken) {
      return socket.emit('message', { username: 'Serveur', message: 'Ce pseudo est déjà pris.' });
    }

    users[socket.id] = { username, status: 'connected', timestamp: new Date() };
    socket.broadcast.emit('userNotification', { type: 'join', message: `${username} a rejoint le chat.` });
    io.emit('updateUsers', Object.values(users));
  });

  // Réception d'un message
  socket.on('message', ({ message }) => {
    const username = users[socket.id]?.username || 'Anonyme';
    if (!message?.trim()) {
      return socket.emit('message', { username: 'Serveur', message: 'Message invalide.' });
    }
    if (message.length > 200) {
      return socket.emit('message', { username: 'Serveur', message: 'Message trop long.' });
    }
    io.emit('message', { username, message });
  });

  // Gestion de la déconnexion
  socket.on('disconnect', () => {
    const user = users[socket.id];
    if (user) {
      delete users[socket.id];
      io.emit('userNotification', { type: 'leave', message: `${user.username} a quitté le chat.` });
      io.emit('updateUsers', Object.values(users));
    }
    console.log(`Déconnexion : ${socket.id}`);
  });
});

// Lancement du serveur
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Serveur lancé sur le port ${PORT}`));
