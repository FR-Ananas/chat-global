const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static('public'));

const users = new Set();

io.on('connection', (socket) => {
  socket.on('newUser', (username) => {
    users.add(username);
    io.emit('userList', Array.from(users));
  });

  socket.on('message', (data) => {
    io.emit('message', data);
  });

  socket.on('disconnect', () => {
    users.delete(socket.username);
    io.emit('userList', Array.from(users));
  });
});

server.listen(3000, () => {
  console.log('Serveur lancé sur le port 3000');
});
