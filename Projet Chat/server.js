const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Serve static files (frontend)
app.use(express.static('public'));

// Stocker les pseudos des utilisateurs
const users = {};

io.on('connection', (socket) => {
  console.log('Un utilisateur est connecté.');

  // Gérer l'arrivée d'un nouvel utilisateur avec son pseudo
  socket.on('newUser', (username) => {
    users[socket.id] = username; // Associer l'ID du socket au pseudo
    console.log(`${username} a rejoint le chat.`);
    socket.broadcast.emit('userJoined', username); // Notifier les autres utilisateurs
  });

  // Gérer les messages envoyés par les utilisateurs
  socket.on('message', (data) => {
    console.log(`${data.username}: ${data.message}`);
    io.emit('message', data); // Envoyer le message à tous les utilisateurs
  });

  // Gérer la déconnexion des utilisateurs
  socket.on('disconnect', () => {
    const username = users[socket.id];
    console.log(`${username} s'est déconnecté.`);
    delete users[socket.id]; // Supprimer l'utilisateur de la liste
    socket.broadcast.emit('userJoined', `${username} a quitté le chat.`);
  });
});

// Démarrer le serveur
server.listen(3000, () => {
  console.log('Serveur lancé sur http://localhost:3000');
});
