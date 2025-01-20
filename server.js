const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

let users = [];
let channels = [{ name: 'Global', color: '#000000', createdBy: null }];
let userChannelCounts = {};

app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', (socket) => {
  socket.on('getChannels', (username) => {
    socket.emit('channels', channels);
  });

  socket.on('createChannel', (channel) => {
    const { username, name, color } = channel;

    if (!userChannelCounts[username]) {
      userChannelCounts[username] = 0;
    }

    if (userChannelCounts[username] >= 2) {
      socket.emit('channelLimitExceeded');
    } else {
      channels.push({ name, color, createdBy: username });
      userChannelCounts[username]++;
      io.emit('channels', channels);
    }
  });

  socket.on('joinChannel', ({ username, channel }) => {
    socket.join(channel);
    socket.username = username;
    socket.channel = channel;
  });

  socket.on('message', (data) => {
    const { username, message, channel } = data;
    io.to(channel).emit('message', { username, message });
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
