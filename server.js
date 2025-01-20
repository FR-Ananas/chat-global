const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

let users = [];
let channels = [{ name: 'Global', color: '#ffffff' }];
let messages = { 'Global': [] };

app.use(express.static('public'));

io.on('connection', (socket) => {
  let username = '';
  let currentChannel = 'Global';

  // Rejoindre un canal
  socket.on('joinChannel', (data) => {
    username = data.username;
    currentChannel = data.channel;

    if (!users.includes(username)) {
      users.push(username);
    }

    socket.join(currentChannel);
    io.to(currentChannel).emit('message', { username: 'System', message: `${username} a rejoint le canal` });
    socket.emit('messageHistory', messages[currentChannel]);
    io.emit('userList', users);
  });

  // Envoyer un message
  socket.on('message', (data) => {
    messages[currentChannel].push({ username: data.username, message: data.message });
    io.to(currentChannel).emit('message', { username: data.username, message: data.message });
  });

  // Créer un canal
  socket.on('createChannel', (data) => {
    if (!channels.some(channel => channel.name === data.channelName)) {
      channels.push({ name: data.channelName, color: data.color });
      io.emit('channelsList', channels);
    }
  });

  // Récupérer la liste des canaux
  socket.on('getChannels', () => {
    socket.emit('channelsList', channels);
  });

  // Récupérer les utilisateurs
  socket.on('getUsers', () => {
    socket.emit('userList', users);
  });

  // Déconnexion
  socket.on('disconnect', () => {
    users = users.filter(user => user !== username);
    io.emit('userList', users);
    io.to(currentChannel).emit('message', { username: 'System', message: `${username} a quitté le canal` });
  });
});

server.listen(3000, () => {
  console.log('Serveur en ligne sur le port 3000');
});
