const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

let users = [];
let channels = [{ name: 'Global', color: '#ffffff', creator: null, messages: [] }];

io.on('connection', (socket) => {
  let currentUser = null;
  let currentChannel = 'Global';

  // Lorsqu'un utilisateur rejoint un canal
  socket.on('joinChannel', ({ username, channel }) => {
    currentUser = username;
    currentChannel = channel;
    if (!users.includes(username)) {
      users.push(username);
    }
    socket.join(channel);

    // Envoie l'historique des messages dans le canal
    const channelMessages = channels.find((c) => c.name === channel)?.messages || [];
    socket.emit('messageHistory', channelMessages);

    // Envoie la liste des utilisateurs dans ce canal
    const channelUsers = Array.from(io.sockets.adapter.rooms.get(channel) || []).map((socketId) => {
      const userSocket = Array.from(io.sockets.sockets).find(([id]) => id === socketId);
      return userSocket ? userSocket[1].handshake.query.username : null;
    });
    socket.emit('userList', channelUsers);
  });

  // Envoi de message
  socket.on('message', ({ username, message, channel }) => {
    const channelObj = channels.find((c) => c.name === channel);
    if (channelObj) {
      channelObj.messages.push({ username, message });
      io.to(channel).emit('message', { username, message });
    }
  });

  // Récupérer la liste des canaux
  socket.on('getChannels', () => {
    socket.emit('channelsList', channels);
  });

  // Supprimer un canal
  socket.on('deleteChannel', (channelName) => {
    channels = channels.filter((c) => c.name !== channelName);
    io.emit('channelsList', channels);
    io.to(channelName).emit('redirectToChannels');
  });

  // Déconnexion d'un utilisateur
  socket.on('disconnect', () => {
    if (currentUser) {
      users = users.filter((u) => u !== currentUser);
      const userChannels = channels.filter((c) => c.creator === currentUser);
      userChannels.forEach((channel) => {
        io.to(channel.name).emit('redirectToChannels');
      });
      channels = channels.filter((c) => c.creator !== currentUser);
      io.emit('channelsList', channels);
    }
  });

  // Liste des utilisateurs d'un canal
  socket.on('getUsers', (channel) => {
    const channelUsers = Array.from(io.sockets.adapter.rooms.get(channel) || []).map((socketId) => {
      const userSocket = Array.from(io.sockets.sockets).find(([id]) => id === socketId);
      return userSocket ? userSocket[1].handshake.query.username : null;
    });
    socket.emit('userList', channelUsers);
  });
});

app.use(express.static('public'));

server.listen(3000, () => {
  console.log('Server is running on port 3000');
});
