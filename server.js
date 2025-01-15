const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static('public'));

const users = {};

io.on('connection', (socket) => {
  // Quand un nouvel utilisateur rejoint
  socket.on('newUser', (username) => {
    users[socket.id] = { username, status: 'connected' };
    socket.broadcast.emit('userNotification', `${username} a rejoint le chat.`);
    io.emit('updateUsers', users);
  });

  // Quand un utilisateur envoie un message
  socket.on('message', (data) => {
    const username = users[socket.id]?.username || 'Anonyme';
    const userMessage = data?.message; // Récupère le message envoyé par le client

    if (typeof userMessage === 'string' && userMessage.trim().length > 0) {
      io.emit('message', { username, message: userMessage }); // Message valide
    } else {
      socket.emit('message', { username: 'Serveur', message: 'Message invalide.' }); // Message invalide
    }
  });

  // Quand un utilisateur se déconnecte
  socket.on('disconnect', () => {
    const user = users[socket.id];
    if (user) {
      io.emit('userNotification', `${user.username} a quitté le chat.`);
      delete users[socket.id];
      io.emit('updateUsers', users);
    }
  });
});

// Lancement du serveur
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Serveur lancé sur le port ${PORT}`));
