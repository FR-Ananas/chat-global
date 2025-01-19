const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static('public')); // Servir les fichiers statiques du dossier 'public'

io.on('connection', (socket) => {
  console.log('Un utilisateur s\'est connecté');

  socket.on('chat message', (msg) => {
    io.emit('chat message', msg); // Diffuser le message à tous les clients connectés
  });

  socket.on('disconnect', () => {
    console.log('Un utilisateur s\'est déconnecté');
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Serveur en écoute sur le port ${PORT}`);
});
