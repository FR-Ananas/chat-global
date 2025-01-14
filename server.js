const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static('public'));

const users = {};

io.on('connection', (socket) => {
  socket.on('newUser', (username) => {
    users[socket.id] = { username, status: 'connected' };
    socket.broadcast.emit('userNotification', `${username} a rejoint le chat.`);
    io.emit('updateUsers', users);
  });

  socket.on('message', (message) => {
    const username = users[socket.id]?.username || 'Anonyme';
    if (typeof message === 'string' && message.trim().length > 0) {
      io.emit('message', { username, message });
    } else {
      socket.emit('message', { username: 'Serveur', message: 'Message invalide.' });
    }
  });

  socket.on('disconnect', () => {
    const user = users[socket.id];
    if (user) {
      io.emit('userNotification', `${user.username} a quitté le chat.`);
      delete users[socket.id];
      io.emit('updateUsers', users);
    }
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Serveur lancé sur le port ${PORT}`));
