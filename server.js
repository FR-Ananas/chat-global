const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

let users = [];
let channels = [{ name: 'Global', color: '#000000' }];

app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', (socket) => {
  socket.on('getChannels', () => {
    socket.emit('channels', channels);
  });

  socket.on('createChannel', (channel) => {
    channels.push(channel);
    io.emit('channels', channels);
  });

  socket.on('newUser', (username) => {
    socket.username = username;
    users.push(username);
    io.emit('userList', users);
  });

  socket.on('message', (data) => {
    io.emit('message', data);
  });

  socket.on('disconnectUser', (username) => {
    users = users.filter(user => user !== username);
    io.emit('userList', users);
  });

  socket.on('disconnect', () => {
    const username = socket.username;
    if (username) {
      users = users.filter(user => user !== username);
      io.emit('userList', users);
    }
  });
});

server.listen(3000, () => {
  console.log('Serveur démarré sur le port 3000');
});
