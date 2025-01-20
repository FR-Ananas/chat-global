const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

let users = [];
let channels = [{ name: 'Global', color: '#000000', createdBy: null }];
let messages = { Global: [] }; // Historique des messages par canal
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
      messages[name] = []; // Initialiser l'historique du canal
      io.emit('channels', channels);
    }
  });

  socket.on('joinChannel', ({ username, channel }) => {
    socket.join(channel);
    socket.username = username;
    socket.channel = channel;

    if (!users.includes(username)) {
      users.push(username);
    }

    if (!messages[channel]) {
      messages[channel] = [];
    }

    // Envoyer l'historique des messages
    socket.emit('messageHistory', messages[channel]);
    io.emit('userList', users);
  });

  socket.on('message', (data) => {
    const { username, message, channel } = data;
    const messageData = { username, message };

    if (messages[channel]) {
      messages[channel].push(messageData);

      // Limiter à 100 messages pour éviter une surcharge
      if (messages[channel].length > 100) {
        messages[channel].shift();
      }
    }

    io.to(channel).emit('message', messageData);
  });

  socket.on('getUsers', (channel) => {
    const connectedUsers = Array.from(
      io.sockets.adapter.rooms.get(channel) || []
    ).map((socketId) => io.sockets.sockets.get(socketId).username);

    socket.emit('userList', connectedUsers);
  });

  socket.on('disconnect', () => {
    const username = socket.username;

    if (username) {
      users = users.filter((user) => user !== username);
      io.emit('userList', users);
    }
  });

  socket.on('disconnectUser', (username) => {
    users = users.filter((user) => user !== username);
    io.emit('userList', users);
  });
});

server.listen(3000, () => {
  console.log('Serveur démarré sur le port 3000');
});
