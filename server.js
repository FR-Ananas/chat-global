const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const fs = require('fs');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

let users = [];
let channels = [{ name: 'Global', color: '#ffffff' }];
let messages = { 'Global': [] };

// Utilisation d'un fichier pour persister les messages
const messagesFile = 'messages.json';

app.use(express.static('public'));

// Charger les messages persistés depuis un fichier
if (fs.existsSync(messagesFile)) {
  messages = JSON.parse(fs.readFileSync(messagesFile));
}

io.on('connection', (socket) => {
  let username = '';
  let currentChannel = 'Global';

  // Rejoindre un canal
  socket.on('joinChannel', (data) => {
    if (!data.username || !data.channel) return;

    username = data.username;
    currentChannel = data.channel;

    if (!users.includes(username)) {
      users.push(username);
    }

    socket.join(currentChannel);
    io.to(currentChannel).emit('message', { username: 'System', message: `${username} a rejoint le canal` });
    socket.emit('messageHistory', messages[currentChannel] || []);
    io.emit('userList', users);
  });

  // Envoyer un message
  socket.on('message', (data) => {
    if (!data.username || !data.message || !data.channel) return;

    const messageData = { username: data.username, message: data.message };

    // Persister les messages dans le fichier
    if (!messages[data.channel]) {
      messages[data.channel] = [];
    }
    messages[data.channel].push(messageData);

    fs.writeFileSync(messagesFile, JSON.stringify(messages, null, 2));

    io.to(data.channel).emit('message', messageData);
  });

  // Créer un canal
  socket.on('createChannel', (data) => {
    if (!data.channelName || channels.some(channel => channel.name === data.channelName)) {
      return;
    }

    channels.push({ name: data.channelName, color: data.color || '#ffffff' });
    io.emit('channelsList', channels);
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
