const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

let users = [];

// Serve le fichier HTML
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/chat.html');
});

// Gestion des connexions des utilisateurs
io.on('connection', (socket) => {
  console.log('Un utilisateur est connecté');
  
  // Écoute des nouveaux utilisateurs
  socket.on('newUser', (username) => {
    users.push(username);
    io.emit('userList', users);
  });

  // Écoute des messages
  socket.on('message', (data) => {
    io.emit('message', data);
  });

  // Écoute de la déconnexion
  socket.on('disconnectUser', (username) => {
    users = users.filter(user => user !== username);
    io.emit('userList', users);
  });

  // Lorsque l'utilisateur se déconnecte
  socket.on('disconnect', () => {
    console.log('Un utilisateur est déconnecté');
  });
});

// Démarre le serveur sur le port 3000
server.listen(3000, () => {
  console.log('Serveur démarré sur le port 3000');
});
